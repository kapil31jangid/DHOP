import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ForbiddenException,
} from '@nestjs/common';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.constants';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ReportsService } from './reports.service';
import { GenerateReportDto } from './dto/generate-report.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { generateReportSchema } from './schemas/reports.schema';

@Controller('reports')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @Roles(Role.DISTRICT_ADMIN, Role.FACILITY_ADMIN, Role.HEALTHCARE_STAFF, Role.OPERATIONS_STAFF)
  async getAll(@CurrentUser() currentUser: any) {
    const filters = this.reportsService.getFacilityFilters(currentUser);
    return this.reportsService.findMany({ filters });
  }

  @Get(':id')
  @Roles(Role.DISTRICT_ADMIN, Role.FACILITY_ADMIN, Role.HEALTHCARE_STAFF, Role.OPERATIONS_STAFF)
  async getOne(@Param('id') id: string, @CurrentUser() currentUser: any) {
    const report = await this.reportsService.findOne(id);
    if (report.facility_id) {
      this.reportsService.assertFacilityScope(currentUser, report.facility_id);
    } else if (currentUser.role !== Role.DISTRICT_ADMIN) {
      throw new ForbiddenException(
        'Access denied: District-wide reports are restricted to District Admin',
      );
    }
    return report;
  }

  @Post()
  @Roles(Role.DISTRICT_ADMIN, Role.FACILITY_ADMIN)
  @UsePipes(new ZodValidationPipe(generateReportSchema))
  async generate(@Body() dto: GenerateReportDto, @CurrentUser() currentUser: any) {
    const facilityId =
      currentUser.role === Role.DISTRICT_ADMIN ? dto.facilityId : currentUser.facilityId;
    const mappedPayload = {
      facility_id: facilityId || null,
      report_type: dto.reportType,
      generated_by: currentUser.id,
      file_url: dto.fileUrl || null,
      status: dto.status || 'Completed',
    };
    return this.reportsService.create(mappedPayload);
  }
}
