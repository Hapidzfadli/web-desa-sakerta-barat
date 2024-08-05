import { Injectable } from '@nestjs/common';

import { NotificationGateway } from './notification.gateway';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private notificationGateway: NotificationGateway,
  ) {}

  async createNotification(userIds: number[], content: string) {
    const notification = await this.prisma.notification.create({
      data: {
        content,
        recipients: {
          create: userIds.map((userId) => ({ userId })),
        },
      },
      include: {
        recipients: true,
      },
    });

    // Send real-time notification via WebSocket to all recipients
    userIds.forEach((userId) => {
      this.notificationGateway.sendNotification(userId, {
        id: notification.id,
        content: notification.content,
        isRead: false,
        createdAt: notification.createdAt,
      });
    });

    return notification;
  }

  async getNotifications(userId: number) {
    return this.prisma.notification.findMany({
      where: {
        recipients: {
          some: {
            userId,
          },
        },
      },
      include: {
        recipients: {
          where: {
            userId,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(notificationId: number, userId: number) {
    return this.prisma.notificationRecipient.update({
      where: {
        notificationId_userId: {
          notificationId,
          userId,
        },
      },
      data: { isRead: true },
    });
  }
}
