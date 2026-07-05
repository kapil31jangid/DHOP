import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.constants';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BedsService } from './beds.service';
import { CreateBedDto } from './dto/create-bed.dto';
import { UpdateBedDto } from './dto/update-bed.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createBedSchema, updateBedSchema } from './schemas/beds.schema';

@Controller('beds')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class BedsController {
  constructor(private readonly bedsService: BedsService) {}

  @Get()
  async getAll(@CurrentUser() currentUser: any) {
    const filters = this.bedsService.getFacilityFilters(currentUser);
    return this.bedsService.findMany({ filters });
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @CurrentUser() currentUser: any) {
    const bed = await this.bedsService.findOne(id);
    this.bedsService.assertFacilityScope(currentUser, bed.facility_id);
    return bed;
  }

  @Post()
  @Roles(Role.FACILITY_ADMIN, Role.OPERATIONS_STAFF)
  @UsePipes(new ZodValidationPipe(createBedSchema))
  async create(@Body() dto: CreateBedDto, @CurrentUser() currentUser: any) {
    const facilityId =
      currentUser.role === Role.DISTRICT_ADMIN ? dto.facilityId : currentUser.facilityId;
    const mappedPayload = {
      facility_id: facilityId,
      bed_number: dto.bedNumber,
      ward: dto.ward,
      bed_type: dto.bedType,
      status: dto.status || 'Available',
      assigned_patient_id: dto.assignedPatientId || null,
    };
    return this.bedsService.create(mappedPayload);
  }

  @Patch(':id')
  @Roles(Role.FACILITY_ADMIN, Role.OPERATIONS_STAFF)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateBedSchema)) dto: UpdateBedDto,
    @CurrentUser() currentUser: any,
  ) {
    const bed = await this.bedsService.findOne(id);
    this.bedsService.assertFacilityScope(currentUser, bed.facility_id);

    const mappedPayload: Record<string, any> = {};
    if (dto.bedNumber !== undefined) mappedPayload.bed_number = dto.bedNumber;
    if (dto.ward !== undefined) mappedPayload.ward = dto.ward;
    if (dto.bedType !== undefined) mappedPayload.bed_type = dto.bedType;
    if (dto.status !== undefined) mappedPayload.status = dto.status;
    if (dto.assignedPatientId !== undefined)
      mappedPayload.assigned_patient_id = dto.assignedPatientId;

    return this.bedsService.update(id, mappedPayload);
  }

  @Delete(':id')
  @Roles(Role.FACILITY_ADMIN)
  async remove(@Param('id') id: string, @CurrentUser() currentUser: any) {
    const bed = await this.bedsService.findOne(id);
    this.bedsService.assertFacilityScope(currentUser, bed.facility_id);
    await this.bedsService.delete(id);
    return { message: 'Bed record deleted successfully' };
  }
}
