import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.constants';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AttendanceService } from './attendance.service';
import { LogAttendanceDto } from './dto/log-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { logAttendanceSchema, updateAttendanceSchema } from './schemas/attendance.schema';

@Controller('attendance')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @Roles(Role.DISTRICT_ADMIN, Role.FACILITY_ADMIN, Role.OPERATIONS_STAFF)
  async getAll(
    @CurrentUser() currentUser: any,
    @Query('date') date?: string,
  ) {
    const filters = this.attendanceService.getFacilityFilters(currentUser);
    const targetDate = date !== undefined ? date : new Date().toISOString().split('T')[0];
    if (targetDate && targetDate !== 'all') {
      filters.date = targetDate;
    }
    return this.attendanceService.findMany({ filters });
  }

  @Get(':id')
  @Roles(Role.DISTRICT_ADMIN, Role.FACILITY_ADMIN, Role.OPERATIONS_STAFF)
  async getOne(@Param('id') id: string, @CurrentUser() currentUser: any) {
    const attendance = await this.attendanceService.findOne(id);
    this.attendanceService.assertFacilityScope(currentUser, attendance.facility_id);
    return attendance;
  }

  @Post()
  @Roles(Role.FACILITY_ADMIN, Role.OPERATIONS_STAFF)
  @UsePipes(new ZodValidationPipe(logAttendanceSchema))
  async log(@Body() dto: LogAttendanceDto, @CurrentUser() currentUser: any) {
    const facilityId =
      currentUser.role === Role.DISTRICT_ADMIN ? dto.facilityId : currentUser.facilityId;
    const mappedPayload = {
      facility_id: facilityId,
      user_id: dto.userId,
      date: dto.date || new Date().toISOString().split('T')[0],
      check_in: dto.checkIn,
      check_out: dto.checkOut,
      status: dto.status || 'Present',
    };
    return this.attendanceService.create(mappedPayload);
  }

  @Patch(':id')
  @Roles(Role.FACILITY_ADMIN, Role.OPERATIONS_STAFF)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateAttendanceSchema)) dto: UpdateAttendanceDto,
    @CurrentUser() currentUser: any,
  ) {
    const attendance = await this.attendanceService.findOne(id);
    this.attendanceService.assertFacilityScope(currentUser, attendance.facility_id);

    const mappedPayload: Record<string, any> = {};
    if (dto.date !== undefined) mappedPayload.date = dto.date;
    if (dto.checkIn !== undefined) mappedPayload.check_in = dto.checkIn;
    if (dto.checkOut !== undefined) mappedPayload.check_out = dto.checkOut;
    if (dto.status !== undefined) mappedPayload.status = dto.status;

    return this.attendanceService.update(id, mappedPayload);
  }
}
