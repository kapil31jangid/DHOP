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
import { DistrictsService } from './districts.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createDistrictSchema, updateDistrictSchema } from './schemas/districts.schema';

@Controller('districts')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Get()
  async getAll() {
    return this.districtsService.findMany();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.districtsService.findOne(id);
  }

  @Post()
  @Roles(Role.DISTRICT_ADMIN)
  @UsePipes(new ZodValidationPipe(createDistrictSchema))
  async create(@Body() dto: CreateDistrictDto) {
    return this.districtsService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.DISTRICT_ADMIN)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateDistrictSchema)) dto: UpdateDistrictDto,
  ) {
    return this.districtsService.update(id, dto);
  }
}
