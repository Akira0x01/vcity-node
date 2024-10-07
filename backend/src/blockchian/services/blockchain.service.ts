import { Injectable } from "@nestjs/common";
import { ValidatorDistributionInfo } from "src/dtos/ValidatorDistributionInfo";
import { Validator } from "src/dtos/Validator";
import { ethers } from "ethers";
import { DecCoin } from "src/dtos/DecCoin";
import { StakingParams } from "src/dtos/Paramas";
import axios from 'axios';
import { AddressTransformer } from "src/utils/addressTransformer";

const fs = require('fs');
const path = require('path');

const transform = (key: string, value: any) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  };

@Injectable()
export class BlockchainService {
    private distributionAddress = '0x0000000000000000000000000000000000000801';
    private stakingAddress = '0x0000000000000000000000000000000000000800';
    private provider = new ethers.JsonRpcProvider('http://207.81.171.181:8545')

    private distributionContract: ethers.Contract;
    private stakingContract: ethers.Contract;

    constructor() {
        this.init();
    }

    private async init() {
        const distributionABIPath = path.join(__dirname, '../../../src/blockchian/contracts/abis/distribution.json');
        const stakingABIPath = path.join(__dirname, '../../../src/blockchian/contracts/abis/staking.json');
        
        const distributionABI = fs.readFileSync(distributionABIPath, 'utf8');
        const stakingABI = fs.readFileSync(stakingABIPath, 'utf8');
        
        this.stakingContract = new ethers.Contract(this.stakingAddress, stakingABI, this.provider);
        this.distributionContract = new ethers.Contract(this.distributionAddress, distributionABI, this.provider);
    }

    getDistributions(address: string): string {
        return 'This is distribution service, address: ' + address;
    }

    async getValidatorDistribution(validatorAddress: string): Promise<ValidatorDistributionInfo> {
        const distributionInfo = await this.distributionContract.validatorDistributionInfo(validatorAddress);
        const transformedInfo = JSON.parse(JSON.stringify(distributionInfo, transform));
        return transformedInfo as ValidatorDistributionInfo;
    }

    async getValidatorOutstandingRewards(validatorAddress: string): Promise<DecCoin[]> {
        const rewards = await this.distributionContract.validatorOutstandingRewards(validatorAddress);
        const transformedRewards = JSON.parse(JSON.stringify(rewards, transform));
        return transformedRewards as DecCoin[]
    }

    // TODO: need to fix REVERT DATA issue
    async getValidator(validatorAddress: string): Promise<Validator> {
        let validator: Validator;
        try {
            const validator = await this.stakingContract.validator(validatorAddress);
        } catch (error) {
            console.error('Transaction failed:', error);
            return
        }
        
        const transformedValidator = JSON.parse(JSON.stringify(validator, transform));
        return transformedValidator as Validator
    }

    async getValidatorDelegations(validatorAddr: string, params: StakingParams): Promise<DelegationsResponse> {
        const apiIP = '207.81.171.181';
        const apiPort = '1317';
        const baseUrl = `http://${apiIP}:${apiPort}/cosmos/staking/v1beta1/validators/${validatorAddr}/delegations`;
    
        try {
        const response = await axios.get(baseUrl, { params });
        return AddressTransformer.transformDelegatorAddresses(response.data);
        } catch (error) {
        console.error('Error fetching delegations:', error);
        throw error;
        }
    }

    async getDelegations(delegatorAddr: string, params: StakingParams): Promise<DelegationsResponse> {
        const apiIP = '207.81.171.181';
        const apiPort = '1317';
        const baseUrl = `http://${apiIP}:${apiPort}/cosmos/staking/v1beta1/delegations/${delegatorAddr}`;
        try {
            const response = await axios.get(baseUrl, { params });
            return AddressTransformer.transformDelegatorAddresses(response.data);
            } catch (error) {
                console.error('Error fetching delegations:', error);
                throw error;
        }
    }
}