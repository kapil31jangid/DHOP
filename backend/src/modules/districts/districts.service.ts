import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/services/base.service';
import { DistrictsRepository } from './districts.repository';

@Injectable()
export class DistrictsService extends BaseService<any> {
  constructor(protected readonly districtsRepository: DistrictsRepository) {
    super(districtsRepository);
  }
}
