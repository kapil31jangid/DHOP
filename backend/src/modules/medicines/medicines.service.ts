import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/services/base.service';
import { MedicinesRepository } from './medicines.repository';

@Injectable()
export class MedicinesService extends BaseService<any> {
  constructor(protected readonly medicinesRepository: MedicinesRepository) {
    super(medicinesRepository);
  }
}
