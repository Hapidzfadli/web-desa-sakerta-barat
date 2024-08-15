import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { DashboardResponse, MonthlyData } from '../model/dashboard.model';
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async getDashboardData(): Promise<DashboardResponse> {
    try {
      const [userStats, letterStats] = await Promise.all([
        this.getUserStats(),
        this.getLetterStats(),
      ]);

      return {
        users: userStats,
        letters: letterStats,
      };
    } catch (error) {
      this.logger.error('Error fetching dashboard data', { error });
      throw new Error('Error fetching dashboard data');
    }
  }

  private async getUserStats() {
    const totalUsers = await this.prismaService.user.count();
    const monthlyData = await this.getUserMonthlyData();
    const currentMonthCount = monthlyData[monthlyData.length - 1].count;
    const previousMonthCount = monthlyData[monthlyData.length - 2].count;
    const growth = this.calculateGrowth(currentMonthCount, previousMonthCount);

    return {
      total: totalUsers,
      growth,
      currentMonthCount,
      previousMonthCount,
      monthlyData,
    };
  }

  private async getLetterStats() {
    const totalRequests = await this.prismaService.letterRequest.count();
    const totalArchived = await this.prismaService.archivedLetter.count();

    const monthlyRequestData = await this.getLetterRequestMonthlyData();
    const monthlyArchivedData = await this.getArchivedLetterMonthlyData();

    const currentMonthRequests =
      monthlyRequestData[monthlyRequestData.length - 1].count;
    const previousMonthRequests =
      monthlyRequestData[monthlyRequestData.length - 2].count;
    const currentMonthArchived =
      monthlyArchivedData[monthlyArchivedData.length - 1].count;
    const previousMonthArchived =
      monthlyArchivedData[monthlyArchivedData.length - 2].count;

    const requestGrowth = this.calculateGrowth(
      currentMonthRequests,
      previousMonthRequests,
    );
    const archivedGrowth = this.calculateGrowth(
      currentMonthArchived,
      previousMonthArchived,
    );

    return {
      totalRequests,
      totalArchived,
      requestGrowth,
      archivedGrowth,
      currentMonthRequests,
      previousMonthRequests,
      currentMonthArchived,
      previousMonthArchived,
      monthlyRequestData,
      monthlyArchivedData,
    };
  }

  private async getUserMonthlyData(): Promise<MonthlyData[]> {
    return this.getMonthlyData(async (start, end) =>
      this.prismaService.user.count({
        where: {
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      }),
    );
  }

  private async getLetterRequestMonthlyData(): Promise<MonthlyData[]> {
    return this.getMonthlyData(async (start, end) =>
      this.prismaService.letterRequest.count({
        where: {
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      }),
    );
  }

  private async getArchivedLetterMonthlyData(): Promise<MonthlyData[]> {
    return this.getMonthlyData(async (start, end) =>
      this.prismaService.archivedLetter.count({
        where: {
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      }),
    );
  }

  private async getMonthlyData(
    countFunction: (start: Date, end: Date) => Promise<number>,
  ): Promise<MonthlyData[]> {
    const currentDate = new Date();
    const data = await Promise.all(
      Array.from({ length: 6 }, (_, i) => i).map(async (monthsAgo) => {
        const monthStart = startOfMonth(subMonths(currentDate, monthsAgo));
        const monthEnd = endOfMonth(subMonths(currentDate, monthsAgo));

        const count = await countFunction(monthStart, monthEnd);

        return {
          month: monthStart.toISOString().slice(0, 7), // Format: YYYY-MM
          count,
        };
      }),
    );

    return data.sort((a, b) => a.month.localeCompare(b.month));
  }

  private calculateGrowth(current: number, previous: number): number {
    return previous > 0
      ? ((current - previous) / previous) * 100
      : current * 100;
  }
}
