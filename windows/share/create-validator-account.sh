#!/bin/bash

set -e

BIN_DIR="/home/user/bin"
CHAIND="$BIN_DIR/evmosd"
DATA_DIR="/home/user/.vcity"
CHAINID="vcitychain_20230825-1"
DENOM_UNIT="uvcity"

# create new key
$CHAIND keys add validator --keyring-backend test --home $DATA_DIR --output json > "$HOME/.vcity/validator_key"

# export account address to .vcity/validator_address
$CHAIND debug addr $($CHAIND keys show validator -a --keyring-backend test --home $DATA_DIR) > "$HOME/.vcity/validator_address"