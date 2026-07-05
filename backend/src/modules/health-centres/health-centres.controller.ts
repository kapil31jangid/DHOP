import {
  Body,
  Controller,
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
  async getAll() {
    return this.healthCentresService.findMany();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
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
