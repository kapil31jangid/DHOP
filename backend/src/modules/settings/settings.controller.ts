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
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createSettingSchema, updateSettingSchema } from './schemas/settings.schema';

@Controller('settings')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @Roles(Role.DISTRICT_ADMIN, Role.FACILITY_ADMIN)
  async getAll(@CurrentUser() currentUser: any) {
    const filters = this.settingsService.getFacilityFilters(currentUser);
    return this.settingsService.findMany({ filters });
  }

  @Get(':id')
  @Roles(Role.DISTRICT_ADMIN, Role.FACILITY_ADMIN)
  async getOne(@Param('id') id: string, @CurrentUser() currentUser: any) {
    const setting = await this.settingsService.findOne(id);
    this.settingsService.assertFacilityScope(currentUser, setting.facility_id);
    return setting;
  }

  @Post()
  @Roles(Role.DISTRICT_ADMIN, Role.FACILITY_ADMIN)
  @UsePipes(new ZodValidationPipe(createSettingSchema))
  async create(@Body() dto: CreateSettingDto, @CurrentUser() currentUser: any) {
    const facilityId =
      currentUser.role === Role.DISTRICT_ADMIN ? dto.facilityId : currentUser.facilityId;
    const mappedPayload = {
      facility_id: facilityId,
      key: dto.key,
      value: dto.value,
    };
    return this.settingsService.create(mappedPayload);
  }

  @Patch(':id')
  @Roles(Role.DISTRICT_ADMIN, Role.FACILITY_ADMIN)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateSettingSchema)) dto: UpdateSettingDto,
    @CurrentUser() currentUser: any,
  ) {
    const setting = await this.settingsService.findOne(id);
    this.settingsService.assertFacilityScope(currentUser, setting.facility_id);

    const mappedPayload: Record<string, any> = {};
    if (dto.key !== undefined) mappedPayload.key = dto.key;
    if (dto.value !== undefined) mappedPayload.value = dto.value;

    return this.settingsService.update(id, mappedPayload);
  }

  @Delete(':id')
  @Roles(Role.DISTRICT_ADMIN, Role.FACILITY_ADMIN)
  async remove(@Param('id') id: string, @CurrentUser() currentUser: any) {
    const setting = await this.settingsService.findOne(id);
    this.settingsService.assertFacilityScope(currentUser, setting.facility_id);
    await this.settingsService.delete(id);
    return { message: 'Setting deleted successfully' };
  }
}
