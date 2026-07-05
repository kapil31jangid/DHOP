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
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createPatientSchema, updatePatientSchema } from './schemas/patients.schema';

@Controller('patients')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  async getAll(@CurrentUser() currentUser: any) {
    const filters = this.patientsService.getFacilityFilters(currentUser);
    return this.patientsService.findMany({ filters });
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @CurrentUser() currentUser: any) {
    const patient = await this.patientsService.findOne(id);
    this.patientsService.assertFacilityScope(currentUser, patient.facility_id);
    return patient;
  }

  @Post()
  @Roles(Role.DISTRICT_ADMIN, Role.FACILITY_ADMIN, Role.HEALTHCARE_STAFF)
  @UsePipes(new ZodValidationPipe(createPatientSchema))
  async create(@Body() dto: CreatePatientDto, @CurrentUser() currentUser: any) {
    const facilityId =
      currentUser.role === Role.DISTRICT_ADMIN ? dto.facilityId : currentUser.facilityId;
    const mappedPayload = {
      facility_id: facilityId,
      patient_id_code: dto.patientIdCode,
      name: dto.name,
      age: dto.age,
      gender: dto.gender,
      visit_type: dto.visitType,
      disease_category: dto.diseaseCategory,
      assigned_doctor: dto.assignedDoctor,
      visit_date: dto.visitDate || new Date().toISOString().split('T')[0],
    };
    return this.patientsService.create(mappedPayload);
  }

  @Patch(':id')
  @Roles(Role.DISTRICT_ADMIN, Role.FACILITY_ADMIN, Role.HEALTHCARE_STAFF)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePatientSchema)) dto: UpdatePatientDto,
    @CurrentUser() currentUser: any,
  ) {
    const patient = await this.patientsService.findOne(id);
    this.patientsService.assertFacilityScope(currentUser, patient.facility_id);

    const mappedPayload: Record<string, any> = {};
    if (dto.patientIdCode !== undefined) mappedPayload.patient_id_code = dto.patientIdCode;
    if (dto.name !== undefined) mappedPayload.name = dto.name;
    if (dto.age !== undefined) mappedPayload.age = dto.age;
    if (dto.gender !== undefined) mappedPayload.gender = dto.gender;
    if (dto.visitType !== undefined) mappedPayload.visit_type = dto.visitType;
    if (dto.diseaseCategory !== undefined)
      mappedPayload.disease_category = dto.diseaseCategory;
    if (dto.assignedDoctor !== undefined) mappedPayload.assigned_doctor = dto.assignedDoctor;
    if (dto.visitDate !== undefined) mappedPayload.visit_date = dto.visitDate;

    return this.patientsService.update(id, mappedPayload);
  }

  @Delete(':id')
  @Roles(Role.FACILITY_ADMIN)
  async remove(@Param('id') id: string, @CurrentUser() currentUser: any) {
    const patient = await this.patientsService.findOne(id);
    this.patientsService.assertFacilityScope(currentUser, patient.facility_id);
    await this.patientsService.delete(id);
    return { message: 'Patient record deleted successfully' };
  }
}
