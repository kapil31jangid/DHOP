import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/services/base.service';
import { BedsRepository } from './beds.repository';

@Injectable()
export class BedsService extends BaseService<any> {
  constructor(protected readonly bedsRepository: BedsRepository) {
    super(bedsRepository);
  }
}
