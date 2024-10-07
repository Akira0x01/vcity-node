import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ValidatorDistributionInfo } from './dtos/ValidatorDistributionInfo';
import { DecCoin } from './dtos/DecCoin';
import { BlockchainService } from './blockchian/services/blockchain.service';
import { Validator } from './dtos/Validator';
import { AddressTransformer } from './utils/addressTransformer';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService, private readonly blockchainService: BlockchainService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/stakings')
  getStakings(): string {
    return this.appService.getStakings();
  }

  @Get('/distributions/:address')
  getDistribution(@Param('address') address: string): string {
    return this.appService.getDistributions(address);
  }

  @Get('distributions/validatorDistribution/:validatorAddress')
  getValidatorDistribution(@Param('validatorAddress') validatorAddress: string): Promise<ValidatorDistributionInfo> {
    return this.blockchainService.getValidatorDistribution(validatorAddress);
  }

  @Get('distributions/validatorOutstandingRewards/:validatorAddress')
  getValidatorOutstandingRewards(@Param('validatorAddress') validatorAddress: string): Promise<DecCoin[]> {
    return this.blockchainService.getValidatorOutstandingRewards(validatorAddress);
  }

  @Get('stakings/validator/:validatorAddress')
  getValidator(@Param('validatorAddress') validatorAddress: string): Promise<Validator> {
    return this.blockchainService.getValidator(validatorAddress);
  }

  @Get('stakings/validatorDelegations/:validatorAddress')
  getValidatorDelegations(@Param('validatorAddress') validatorAddress: string): Promise<DelegationsResponse> {
    return this.blockchainService.getValidatorDelegations(validatorAddress, {})
  }

  @Get('stakings/delegations/:delegatorAddress')
  getDelegations(@Param('delegatorAddress') delegatorAddress: string): Promise<DelegationsResponse> {
    return this.blockchainService.getDelegations(delegatorAddress, {})
  }

  @Get('address/bech32ToEIP55Hex/:bech32Address')
  bech32ToEIP55Hex(@Param('bech32Address') bech32Address: string): string | null {
    return AddressTransformer.bech32ToEIP55Hex(bech32Address);
  }

  @Get('address/eip55HexToBech32/:eip55HexAddress')
  eip55HexToBech32(@Param('eip55HexAddress') eip55HexAddress: string): string | null {
    return AddressTransformer.eip55HexToBech32(eip55HexAddress);
  }

  @Post('stakings/withdraw')
  withdraw(): string {
    return this.appService.withdraw();
  }
}
