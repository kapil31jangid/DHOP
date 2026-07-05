import { Module } from '@nestjs/common';
import { BedsController } from './beds.controller';
import { BedsService } from './beds.service';
import { BedsRepository } from './beds.repository';

@Module({
  controllers: [BedsController],
  providers: [BedsService, BedsRepository],
  exports: [BedsService, BedsRepository],
})
export class BedsModule {}
