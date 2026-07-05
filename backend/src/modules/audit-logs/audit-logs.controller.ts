import { Controller, Get, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.constants';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuditLogsService } from './audit-logs.service';

@Controller('audit-logs')
@UseGuards(FirebaseAuthGuard, RolesGuard)
@Roles(Role.DISTRICT_ADMIN, Role.FACILITY_ADMIN)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  async getAll(@CurrentUser() currentUser: any) {
    const filters = this.auditLogsService.getFacilityFilters(currentUser);
    return this.auditLogsService.findMany({
      filters,
      orderBy: { column: 'timestamp', ascending: false },
    });
  }
}
