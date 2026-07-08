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
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createMedicineSchema, updateMedicineSchema } from './schemas/medicines.schema';

@Controller('medicines')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @Get()
  @Roles(Role.DISTRICT_ADMIN, Role.FACILITY_ADMIN, Role.HEALTHCARE_STAFF, Role.OPERATIONS_STAFF)
  async getAll(@CurrentUser() currentUser: any) {
    const filters = this.medicinesService.getFacilityFilters(currentUser);
    return this.medicinesService.findMany({ filters });
  }

  @Get(':id')
  @Roles(Role.DISTRICT_ADMIN, Role.FACILITY_ADMIN, Role.HEALTHCARE_STAFF, Role.OPERATIONS_STAFF)
  async getOne(@Param('id') id: string, @CurrentUser() currentUser: any) {
    const medicine = await this.medicinesService.findOne(id);
    this.medicinesService.assertFacilityScope(currentUser, medicine.facility_id);
    return medicine;
  }

  @Post()
  @Roles(Role.FACILITY_ADMIN, Role.HEALTHCARE_STAFF)
  @UsePipes(new ZodValidationPipe(createMedicineSchema))
  async create(@Body() dto: CreateMedicineDto, @CurrentUser() currentUser: any) {
    const facilityId =
      currentUser.role === Role.DISTRICT_ADMIN ? dto.facilityId : currentUser.facilityId;
    const mappedPayload = {
      facility_id: facilityId,
      name: dto.name,
      category: dto.category,
      batch_number: dto.batchNumber,
      expiry_date: dto.expiryDate,
      quantity: dto.quantity,
      threshold: dto.threshold,
    };
    return this.medicinesService.create(mappedPayload);
  }

  @Patch(':id')
  @Roles(Role.FACILITY_ADMIN, Role.HEALTHCARE_STAFF)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateMedicineSchema)) dto: UpdateMedicineDto,
    @CurrentUser() currentUser: any,
  ) {
    const medicine = await this.medicinesService.findOne(id);
    this.medicinesService.assertFacilityScope(currentUser, medicine.facility_id);

    const mappedPayload: Record<string, any> = {};
    if (dto.name !== undefined) mappedPayload.name = dto.name;
    if (dto.category !== undefined) mappedPayload.category = dto.category;
    if (dto.batchNumber !== undefined) mappedPayload.batch_number = dto.batchNumber;
    if (dto.expiryDate !== undefined) mappedPayload.expiry_date = dto.expiryDate;
    if (dto.quantity !== undefined) mappedPayload.quantity = dto.quantity;
    if (dto.threshold !== undefined) mappedPayload.threshold = dto.threshold;

    return this.medicinesService.update(id, mappedPayload);
  }

  @Delete(':id')
  @Roles(Role.FACILITY_ADMIN)
  async remove(@Param('id') id: string, @CurrentUser() currentUser: any) {
    const medicine = await this.medicinesService.findOne(id);
    this.medicinesService.assertFacilityScope(currentUser, medicine.facility_id);
    await this.medicinesService.delete(id);
    return { message: 'Medicine deleted successfully' };
  }
}
