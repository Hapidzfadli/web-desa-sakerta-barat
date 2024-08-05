import { Controller, Get, Put, Param, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('/api/notifications')
@UseGuards(AuthGuard, RolesGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  async getNotifications(@Auth() user: any) {
    return this.notificationService.getNotifications(user.id);
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @Auth() user: any) {
    return this.notificationService.markAsRead(parseInt(id), user.id);
  }
}
