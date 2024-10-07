interface StakingParams {
    status?: string;
    pagination?: {
      key?: string;
      offset?: string;
      limit?: string;
      count_total?: boolean;
      reverse?: boolean;
    };
}

export { StakingParams }