import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/services/base.service';
import { AttendanceRepository } from './attendance.repository';

@Injectable()
export class AttendanceService extends BaseService<any> {
  constructor(protected readonly attendanceRepository: AttendanceRepository) {
    super(attendanceRepository);
  }
}
