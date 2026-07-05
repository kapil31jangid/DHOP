import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/services/base.service';
import { SettingsRepository } from './settings.repository';

@Injectable()
export class SettingsService extends BaseService<any> {
  constructor(protected readonly settingsRepository: SettingsRepository) {
    super(settingsRepository);
  }
}
