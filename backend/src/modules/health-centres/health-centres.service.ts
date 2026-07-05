import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/services/base.service';
import { HealthCentresRepository } from './health-centres.repository';

@Injectable()
export class HealthCentresService extends BaseService<any> {
  constructor(
    protected readonly healthCentresRepository: HealthCentresRepository,
  ) {
    super(healthCentresRepository);
  }
}
