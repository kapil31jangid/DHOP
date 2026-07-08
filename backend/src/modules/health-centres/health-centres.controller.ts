import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
import { HealthCentresService } from './health-centres.service';
import { CreateHealthCentreDto } from './dto/create-health-centre.dto';
import { UpdateHealthCentreDto } from './dto/update-health-centre.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createHealthCentreSchema, updateHealthCentreSchema } from './schemas/health-centres.schema';

@Controller('health-centres')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class HealthCentresController {
  constructor(private readonly healthCentresService: HealthCentresService) {}

  @Get()
  @Roles(Role.DISTRICT_ADMIN, Role.FACILITY_ADMIN, Role.HEALTHCARE_STAFF, Role.OPERATIONS_STAFF)
  async getAll(@CurrentUser() currentUser: any) {
    const filters: Record<string, any> = {};
    if (currentUser.role !== Role.DISTRICT_ADMIN) {
      filters.id = currentUser.facilityId;
    }
    return this.healthCentresService.findMany({ filters });
  }

  @Get(':id')
  @Roles(Role.DISTRICT_ADMIN, Role.FACILITY_ADMIN, Role.HEALTHCARE_STAFF, Role.OPERATIONS_STAFF)
  async getOne(@Param('id') id: string, @CurrentUser() currentUser: any) {
    if (currentUser.role !== Role.DISTRICT_ADMIN && currentUser.facilityId !== id) {
      throw new ForbiddenException('Access denied: You can only access your assigned health centre');
    }
    return this.healthCentresService.findOne(id);
  }

  @Post()
  @Roles(Role.DISTRICT_ADMIN)
  @UsePipes(new ZodValidationPipe(createHealthCentreSchema))
  async create(@Body() dto: CreateHealthCentreDto) {
    const mappedPayload = {
      district_id: dto.districtId,
      name: dto.name,
      type: dto.type,
      address: dto.address,
      contact_number: dto.contactNumber,
      status: dto.status || 'Active',
    };
    return this.healthCentresService.create(mappedPayload);
  }

  @Patch(':id')
  @Roles(Role.DISTRICT_ADMIN)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateHealthCentreSchema)) dto: UpdateHealthCentreDto,
  ) {
    const mappedPayload: Record<string, any> = {};
    if (dto.districtId !== undefined) mappedPayload.district_id = dto.districtId;
    if (dto.name !== undefined) mappedPayload.name = dto.name;
    if (dto.type !== undefined) mappedPayload.type = dto.type;
    if (dto.address !== undefined) mappedPayload.address = dto.address;
    if (dto.contactNumber !== undefined) mappedPayload.contact_number = dto.contactNumber;
    if (dto.status !== undefined) mappedPayload.status = dto.status;

    return this.healthCentresService.update(id, mappedPayload);
  }
}
