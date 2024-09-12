#!/bin/bash

set -e

BIN_DIR="/home/user/bin"
if ! echo "$PATH" | tr ':' '\n' | grep -q "$BIN_DIR"; then
    export PATH="$PATH:$BIN_DIR"
fi

DENOM="vcity"

CHAIN="vcitychain"
CHAINID="$CHAIN"_2023825-1

CHAIND="evmosd"

echo "Moniker: $MONIKER"
echo "Key name: $KEY"
echo "MNEMONIC: $MNEMONIC"

BUILD_DIR=$(pwd)
SHARE_DIR=$BUILD_DIR/share
DATA_DIR=$BUILD_DIR/.vcity
CONF_DIR=$DATA_DIR/config
CONFIG=$CONF_DIR/config.toml
GENESIS=$CONF_DIR/genesis.json
TEMP_GENESIS=$CONF_DIR/tmp_genesis.json

mkdir -p "$DATA_DIR"

echo "Create and add $KEY keys"
echo "$MNEMONIC" | $CHAIND keys add "$KEY" --home "$DATA_DIR" --chain-id "$CHAINID" --keyring-backend test --recover
echo "Init $CHAIN with moniker=$MONIKER and chain-id=$CHAINID"
$CHAIND init "$MONIKER" --chain-id "$CHAINID" --home "$DATA_DIR"

echo "Prepare genesis..."
echo "- Set gas limit in genesis"
jq '.consensus_params["block"]["max_gas"]="40000000"' "$GENESIS" > "$TEMP_GENESIS" && mv "$TEMP_GENESIS" "$GENESIS"

echo "- Set $DENOM as denom"
sed -i.bak "s/aphoton/$DENOM/g" $GENESIS
sed -i.bak "s/stake/$DENOM/g" $GENESIS
sed -i.bak "s/aevmos/$DENOM/g" $GENESIS

# Change proposal periods to pass within a reasonable time for local testing
sed -i.bak 's/"max_deposit_period": "172800s"/"max_deposit_period": "600s"/g' "$GENESIS"
sed -i.bak 's/"voting_period": "172800s"/"voting_period": "600s"/g' "$GENESIS"

echo "- Allocate genesis accounts"
$CHAIND add-genesis-account \
"$($CHAIND keys show $KEY -a --home $DATA_DIR --keyring-backend test)" 100000000000000000000000000$DENOM \
--home $DATA_DIR --keyring-backend test

echo "- Sign genesis transaction"
$CHAIND gentx $KEY 100000000000000000000000$DENOM --keyring-backend test --home $DATA_DIR --chain-id $CHAINID

echo "- Add all other validators genesis accounts"
addresses=(
    "evmos164c52kkezr4qpzvq66wmk7x68jsv8q4fth8vrf"
    "evmos17ey5n2pa97u5hdf960s5vl7tunndk8vlqv5fud"
    "evmos1mxxxhn3zj9jesvs7fll7xv4qyraheskampvd9p"
    "evmos1vjdlv3z558htxuu9efkrhgjc500vtl3pnelzea"
)
for address in "${addresses[@]}"; do
    echo "Adding genesis account for address: $address"
    $CHAIND add-genesis-account  "$address" 50000000000000000000000000$DENOM --home $DATA_DIR --keyring-backend test
    [ $? -eq 0 ] && echo "$address added" || echo "$address failed"
done

echo "- Collect genesis tx"
$CHAIND collect-gentxs --home $DATA_DIR

echo "- Run validate-genesis to ensure everything worked and that the genesis file is setup correctly"
$CHAIND validate-genesis --home $DATA_DIR

cp $GENESIS $SHARE_DIR
cp $CONF_DIR/client.toml $SHARE_DIR
sed -i "s/^seeds = .*/seeds = "\"$(${CHAIND} tendermint show-node-id --home ${DATA_DIR})@192.167.10.2:26656\""/" $CONFIG
cp $CONFIG $SHARE_DIR
cp $CONF_DIR/app.toml $SHARE_DIR
