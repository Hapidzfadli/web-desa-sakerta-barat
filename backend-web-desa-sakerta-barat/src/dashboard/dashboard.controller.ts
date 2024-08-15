import {
  Controller,
  Get,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardResponse } from '../model/dashboard.model';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('/api/dashboard')
@UseGuards(AuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @Roles(Role.ADMIN, Role.KADES)
  async getDashboardData(): Promise<DashboardResponse> {
    try {
      return await this.dashboardService.getDashboardData();
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Failed to fetch dashboard data: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while fetching dashboard data',
      );
    }
  }
}
