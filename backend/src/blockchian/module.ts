import { Module } from "@nestjs/common";
import { BlockchainService } from "./services/blockchain.service";


@Module({
    controllers: [],
    providers: [BlockchainService],
    exports: [BlockchainService]
})

export class BlockchianModule {}