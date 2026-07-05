import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/services/base.service';
import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService extends BaseService<any> {
  constructor(
    protected readonly notificationsRepository: NotificationsRepository,
  ) {
    super(notificationsRepository);
  }
}
