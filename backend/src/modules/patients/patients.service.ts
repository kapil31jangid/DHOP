import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/services/base.service';
import { PatientsRepository } from './patients.repository';

@Injectable()
export class PatientsService extends BaseService<any> {
  constructor(protected readonly patientsRepository: PatientsRepository) {
    super(patientsRepository);
  }
}
