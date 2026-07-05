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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createNotificationSchema } from './schemas/notifications.schema';

@Controller('notifications')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getAll(@CurrentUser() currentUser: any) {
    const filters = this.notificationsService.getFacilityFilters(currentUser);
    return this.notificationsService.findMany({ filters });
  }

  @Post()
  @Roles(Role.DISTRICT_ADMIN, Role.FACILITY_ADMIN)
  @UsePipes(new ZodValidationPipe(createNotificationSchema))
  async create(@Body() dto: CreateNotificationDto, @CurrentUser() currentUser: any) {
    const facilityId =
      currentUser.role === Role.DISTRICT_ADMIN ? dto.facilityId : currentUser.facilityId;
    const mappedPayload = {
      facility_id: facilityId || null,
      type: dto.type,
      title: dto.title,
      message: dto.message,
      is_read: dto.isRead || false,
    };
    return this.notificationsService.create(mappedPayload);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @CurrentUser() currentUser: any) {
    const notification = await this.notificationsService.findOne(id);
    if (notification.facility_id) {
      this.notificationsService.assertFacilityScope(currentUser, notification.facility_id);
    }
    return this.notificationsService.update(id, { is_read: true });
  }
}
