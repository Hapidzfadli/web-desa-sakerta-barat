import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import {
  ComparisonData,
  DashboardResponse,
  LetterStatusData,
  MonthlyData,
} from '../model/dashboard.model';
import {
  subDays,
  subWeeks,
  subMonths,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
} from 'date-fns';
import { RequestStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async getDashboardData(): Promise<DashboardResponse> {
    try {
      const [userStats, letterStats, comparisonData, statusData] =
        await Promise.all([
          this.getUserStats(),
          this.getLetterStats(),
          this.getComparisonData(),
          this.getLetterStatusData(),
        ]);

      return {
        users: userStats,
        letters: {
          ...letterStats,
          comparison: comparisonData,
          statusData,
        },
      };
    } catch (error) {
      this.logger.error('Error fetching dashboard data', { error });
      throw new Error('Error fetching dashboard data');
    }
  }

  private async getUserStats(): Promise<DashboardResponse['users']> {
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

  private async getLetterStats(): Promise<DashboardResponse['letters']> {
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

  private async getComparisonData(): Promise<ComparisonData> {
    const [daily, weekly, monthly] = await Promise.all([
      this.getDailyComparison(),
      this.getWeeklyComparison(),
      this.getMonthlyComparison(),
    ]);

    return { daily, weekly, monthly };
  }

  private async getDailyComparison(): Promise<ComparisonData['daily']> {
    const currentDate = new Date();
    const labels = Array.from({ length: 7 }, (_, i) =>
      format(subDays(currentDate, 6 - i), 'EEE'),
    );

    const current = await Promise.all(
      labels.map((_, i) => this.getCountForDay(subDays(currentDate, 6 - i))),
    );

    const previous = await Promise.all(
      labels.map((_, i) => this.getCountForDay(subDays(currentDate, 13 - i))),
    );

    return { labels, current, previous };
  }

  private async getWeeklyComparison(): Promise<ComparisonData['weekly']> {
    const currentDate = new Date();
    const labels = ['W1', 'W2', 'W3', 'W4'];

    const current = await Promise.all(
      labels.map((_, i) => this.getCountForWeek(subWeeks(currentDate, 3 - i))),
    );

    const previous = await Promise.all(
      labels.map((_, i) => this.getCountForWeek(subWeeks(currentDate, 7 - i))),
    );

    return { labels, current, previous };
  }

  private async getMonthlyComparison(): Promise<ComparisonData['monthly']> {
    const currentDate = new Date();
    const labels = Array.from({ length: 12 }, (_, i) =>
      format(subMonths(currentDate, 11 - i), 'MMM'),
    );

    const current = await Promise.all(
      labels.map((_, i) =>
        this.getCountForMonth(subMonths(currentDate, 11 - i)),
      ),
    );

    const previous = await Promise.all(
      labels.map((_, i) =>
        this.getCountForMonth(subMonths(currentDate, 23 - i)),
      ),
    );

    return { labels, current, previous };
  }

  private async getCountForDay(date: Date): Promise<number> {
    return this.prismaService.letterRequest.count({
      where: {
        createdAt: {
          gte: startOfDay(date),
          lt: endOfDay(date),
        },
      },
    });
  }

  private async getCountForWeek(date: Date): Promise<number> {
    return this.prismaService.letterRequest.count({
      where: {
        createdAt: {
          gte: startOfWeek(date),
          lt: endOfWeek(date),
        },
      },
    });
  }

  private async getCountForMonth(date: Date): Promise<number> {
    return this.prismaService.letterRequest.count({
      where: {
        createdAt: {
          gte: startOfMonth(date),
          lt: endOfMonth(date),
        },
      },
    });
  }

  private async getLetterStatusData(): Promise<LetterStatusData> {
    const now = new Date();
    const dailyStart = startOfDay(subDays(now, 1));
    const weeklyStart = startOfWeek(now);
    const monthlyStart = startOfMonth(now);

    const [dailyData, weeklyData, monthlyData] = await Promise.all([
      this.getStatusDataForPeriod(dailyStart, now),
      this.getStatusDataForPeriod(weeklyStart, now),
      this.getStatusDataForPeriod(monthlyStart, now),
    ]);

    return {
      daily: dailyData,
      weekly: weeklyData,
      monthly: monthlyData,
    };
  }

  private async getStatusDataForPeriod(
    startDate: Date,
    endDate: Date,
  ): Promise<{ [key: string]: number }> {
    const statusCounts = await this.prismaService.letterRequest.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const statusData: { [key: string]: number } = {
      SUBMITTED: 0,
      APPROVED: 0,
      REJECTED: 0,
      SIGNED: 0,
      COMPLETED: 0,
      ARCHIVED: 0,
    };

    statusCounts.forEach((item) => {
      if (item.status === 'REJECTED' || item.status === 'REJECTED_BY_KADES') {
        statusData.REJECTED += item._count.status;
      } else {
        statusData[item.status] = item._count.status;
      }
    });

    return statusData;
  }

  private calculateGrowth(current: number, previous: number): number {
    return previous > 0
      ? ((current - previous) / previous) * 100
      : current * 100;
  }
}
