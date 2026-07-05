import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/services/base.service';
import { ReportsRepository } from './reports.repository';

@Injectable()
export class ReportsService extends BaseService<any> {
  constructor(protected readonly reportsRepository: ReportsRepository) {
    super(reportsRepository);
  }
}
