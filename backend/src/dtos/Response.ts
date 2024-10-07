interface ValidatorInfo {
    operator_address: string;
    consensus_pubkey: {
      type_url: string;
      value: string;
    };
    jailed: boolean;
    status: string;
    tokens: string;
    delegator_shares: string;
    description: {
      moniker: string;
      identity: string;
      website: string;
      security_contact: string;
      details: string;
    };
    unbonding_height: string;
    unbonding_time: string;
    commission: {
      commission_rates: {
        rate: string;
        max_rate: string;
        max_change_rate: string;
      };
      update_time: string;
    };
    min_self_delegation: string;
    unbonding_on_hold_ref_count: string;
    unbonding_ids: string[];
}
  
interface ValidatorsResponse {
    validators: ValidatorInfo[];
    pagination: Pagination;
}

interface Pagination {
    next_key: string;
    total: string;
}

interface Delegation {
    delegator_address: string;
    validator_address: string;
    shares: string;
}

interface Balance {
    denom: string;
    amount: string;
}

interface DelegationResponse {
    delegation: Delegation;
    balance: Balance;
}

interface DelegationsResponse {
    delegation_responses: DelegationResponse[];
    pagination: Pagination;
}