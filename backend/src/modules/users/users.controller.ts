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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createUserSchema, updateUserSchema } from './schemas/users.schema';

@Controller('users')
@UseGuards(FirebaseAuthGuard, RolesGuard)
@Roles(Role.DISTRICT_ADMIN, Role.FACILITY_ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll(@CurrentUser() currentUser: any) {
    const filters = this.usersService.getFacilityFilters(currentUser);
    return this.usersService.findMany({ filters });
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @CurrentUser() currentUser: any) {
    const user = await this.usersService.findOne(id);
    this.usersService.assertFacilityScope(currentUser, user.facility_id);
    return user;
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(@Body() dto: CreateUserDto, @CurrentUser() currentUser: any) {
    return this.usersService.createUser(dto, currentUser);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateUserSchema)) dto: UpdateUserDto,
    @CurrentUser() currentUser: any,
  ) {
    const user = await this.usersService.findOne(id);
    this.usersService.assertFacilityScope(currentUser, user.facility_id);

    // Filter fields if FACILITY_ADMIN
    if (currentUser.role === Role.FACILITY_ADMIN) {
      delete dto.facilityId;
    }

    const updatePayload: Record<string, any> = {};
    if (dto.name !== undefined) updatePayload.name = dto.name;
    if (dto.role !== undefined) updatePayload.role = dto.role;
    if (dto.status !== undefined) updatePayload.status = dto.status;
    if (dto.facilityId !== undefined) updatePayload.facility_id = dto.facilityId;

    return this.usersService.update(id, updatePayload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() currentUser: any) {
    await this.usersService.deleteUser(id, currentUser);
    return { message: 'User deleted successfully' };
  }
}
