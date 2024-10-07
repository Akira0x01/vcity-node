import { DecCoin } from "./DecCoin";

export interface ValidatorDistributionInfo {
    operatorAddress: string;
    selfBondRewards: DecCoin[];
    commission: DecCoin[];
}