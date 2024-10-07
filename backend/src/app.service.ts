import { Injectable } from '@nestjs/common';
import { BlockchainService } from './blockchian/services/blockchain.service';

@Injectable()
export class AppService {
  constructor(private readonly blockchainService: BlockchainService) {}

  getHello(): string {
    return 'Hello World!';
  }

  getStakings(): string {
    return 'This is staking service';
  }

  getDistributions(address: string): string {
    return this.blockchainService.getDistributions(address);
  }

  withdraw(): string {
    return 'This is withdraw service';
  }
}
