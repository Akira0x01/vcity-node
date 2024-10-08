#!/bin/bash

set -e

BIN_DIR="/home/user/bin"
CHAIND="$BIN_DIR/evmosd"
DATA_DIR="/home/user/.vcity"
CHAINID="vcitychain_20230825-1"
DENOM_UNIT="uvcity"

validator_key_file="$HOME/.vcity/validator_key"
# create new key
$CHAIND keys add validator --keyring-backend test --home $DATA_DIR --output json > $validator_key_file

# export account address to .vcity/validator_address
validator_address_file="$HOME/.vcity/validator_address"
$CHAIND debug addr $($CHAIND keys show validator -a --keyring-backend test --home $DATA_DIR) > $validator_address_file
hex_address=$(grep "Address hex:" "$validator_address_file" | awk -F'[: ]' '{print $3}')
$CHAIND debug addr $hex_address >> $validator_address_file