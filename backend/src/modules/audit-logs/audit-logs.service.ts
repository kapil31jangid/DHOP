import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/services/base.service';
import { AuditLogsRepository } from './audit-logs.repository';

@Injectable()
export class AuditLogsService extends BaseService<any> {
  constructor(protected readonly auditLogsRepository: AuditLogsRepository) {
    super(auditLogsRepository);
  }
}
