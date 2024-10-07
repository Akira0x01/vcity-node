import { BondStatus } from "./BondState.enum";

export interface Validator {
    operatorAddress: string;
    consensusPubkey: string;
    jailed: boolean;
    status: BondStatus;
    tokens: string;
    delegatorShares: string;
    description: string;
    unbondingHeight: string;
    unbondingTime: string;
    commission: string;
    minSelfDelegation: string;
}