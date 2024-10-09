const { ethers } = require("ethers");

url = "http://207.81.171.181:8545";

async function getRewardsAndWithdraw() {
    const provider = new ethers.JsonRpcProvider(url);
    const distributionAddress = "0x0000000000000000000000000000000000000801";
    const distribution = require("./extensions/precompiles/abi/distribution.json");
    const distributionContract = new ethers.Contract(distributionAddress, distribution, provider);
    const delegatorAddress = "0x1bdd429e96efEe051e83c9b30C584b4DDd999C49";
    const validatorAddress = "evmosvaloper1r0w5985kalhq285rexesckztfhwen8zfzmymfl";

    const wallet = new ethers.Wallet("69fb30a0b459364deaf9075991c2b20c6293ea8d5b7c998724b1b573355eee51");
    const signer = wallet.connect(provider);
    const contractWithSigner = distributionContract.connect(signer);

    try {
        const delegationRewards = await distributionContract.delegationRewards(delegatorAddress, validatorAddress);
        console.log("Result:", delegationRewards);
        const rewards = delegationRewards.map(reward => {
            return {
                denom: reward.denom,
                amount: reward.amount.toString() // transfer BigNumber to string
            };
        });
        rewardAmount = rewards.amount;
        console.log(`Validator Address: ${validatorAddress}, Rewards:`, rewards);

        const withdrawTx = await contractWithSigner.withdrawDelegatorRewards(delegatorAddress, validatorAddress);
        // const txResponse = await signer.sendTransaction(withdrawTx);
        console.log(`Transaction hash: ${withdrawTx.hash}`);
        const receipt = await withdrawTx.wait();
        console.log(`Transaction receipt: ${receipt.status}`);
    } catch (error) {
        console.error('Error:', error);
    }
}

getRewardsAndWithdraw();