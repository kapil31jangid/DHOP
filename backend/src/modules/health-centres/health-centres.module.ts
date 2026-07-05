import { Module } from '@nestjs/common';
import { HealthCentresController } from './health-centres.controller';
import { HealthCentresService } from './health-centres.service';
import { HealthCentresRepository } from './health-centres.repository';

@Module({
  controllers: [HealthCentresController],
  providers: [HealthCentresService, HealthCentresRepository],
  exports: [HealthCentresService, HealthCentresRepository],
})
export class HealthCentresModule {}
