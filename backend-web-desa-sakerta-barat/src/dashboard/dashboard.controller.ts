import {
  Controller,
  Get,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import {
  DashboardResponse,
  ResidentDashboardResponse,
} from '../model/dashboard.model';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('/api/dashboard')
@UseGuards(AuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @Roles(Role.ADMIN, Role.KADES)
  async getAdminDashboardData(): Promise<DashboardResponse> {
    try {
      return await this.dashboardService.getAdminDashboardData();
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Failed to fetch admin dashboard data: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while fetching admin dashboard data',
      );
    }
  }

  @Get('resident')
  @Roles(Role.WARGA)
  async getResidentDashboardData(
    @Auth() user: any,
  ): Promise<ResidentDashboardResponse> {
    try {
      return await this.dashboardService.getResidentDashboardData(user.id);
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Failed to fetch resident dashboard data: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while fetching resident dashboard data',
      );
    }
  }
}
