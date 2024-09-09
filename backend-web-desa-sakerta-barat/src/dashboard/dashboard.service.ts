import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import {
  ComparisonData,
  DashboardResponse,
  LetterStatusData,
  MonthlyData,
  PopulationDocumentData,
  PopulationDocumentRow,
  ResidentDashboardResponse,
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

  async getAdminDashboardData(): Promise<DashboardResponse> {
    try {
      const [
        userStats,
        letterStats,
        comparisonData,
        statusData,
        populationDocumentData,
      ] = await Promise.all([
        this.getUserStats(),
        this.getLetterStats(),
        this.getComparisonData(),
        this.getLetterStatusData(),
        this.getPopulationDocumentData(),
      ]);

      return {
        users: userStats,
        letters: {
          ...letterStats,
          comparison: comparisonData,
          statusData,
        },
        populationDocuments: populationDocumentData,
      };
    } catch (error) {
      this.logger.error('Error fetching admin dashboard data', { error });
      throw new Error('Error fetching admin dashboard data');
    }
  }

  async getResidentDashboardData(
    userId: number,
  ): Promise<ResidentDashboardResponse> {
    try {
      const resident = await this.prismaService.resident.findUnique({
        where: { userId: userId },
      });

      if (!resident) {
        throw new NotFoundException('Resident not found');
      }

      const [
        totalRequests,
        totalDocuments,
        recentRequests,
        letterStatus,
        comparison,
        populationDocuments,
      ] = await Promise.all([
        this.getTotalRequestsData(resident.id),
        this.getTotalDocumentsData(resident.id),
        this.getRecentRequestsData(resident.id),
        this.getLetterStatusData(resident.id),
        this.getComparisonData(resident.id),
        this.getPopulationDocumentData(resident.id),
      ]);

      return {
        totalRequests,
        totalDocuments,
        recentRequests,
        letterStatus,
        comparison,
        populationDocuments,
      };
    } catch (error) {
      this.logger.error('Error fetching resident dashboard data', { error });
      throw new Error('Error fetching resident dashboard data');
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

  private async getTotalRequestsData(
    residentId?: number,
  ): Promise<ResidentDashboardResponse['totalRequests']> {
    const monthlyData = await this.getMonthlyData(async (start, end) =>
      this.prismaService.letterRequest.count({
        where: {
          ...(residentId && { residentId }),
          createdAt: { gte: start, lte: end },
        },
      }),
    );

    const total = monthlyData.reduce((sum, data) => sum + data.count, 0);
    const currentMonthCount = monthlyData[monthlyData.length - 1].count;
    const previousMonthCount = monthlyData[monthlyData.length - 2].count;
    const growth = this.calculateGrowth(currentMonthCount, previousMonthCount);

    return { total, growth, monthlyData };
  }

  private async getTotalDocumentsData(
    residentId?: number,
  ): Promise<ResidentDashboardResponse['totalDocuments']> {
    const monthlyData = await this.getMonthlyData(async (start, end) =>
      this.prismaService.document.count({
        where: {
          ...(residentId && { residentId }),
          createdAt: { gte: start, lte: end },
        },
      }),
    );

    const total = monthlyData.reduce((sum, data) => sum + data.count, 0);
    const currentMonthCount = monthlyData[monthlyData.length - 1].count;
    const previousMonthCount = monthlyData[monthlyData.length - 2].count;
    const growth = this.calculateGrowth(currentMonthCount, previousMonthCount);

    return { total, growth, monthlyData };
  }

  private async getRecentRequestsData(
    residentId?: number,
  ): Promise<ResidentDashboardResponse['recentRequests']> {
    const monthlyData = await this.getMonthlyData(async (start, end) =>
      this.prismaService.letterRequest.count({
        where: {
          ...(residentId && { residentId }),
          createdAt: { gte: start, lte: end },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    );

    const total = monthlyData.reduce((sum, data) => sum + data.count, 0);
    const currentMonthCount = monthlyData[monthlyData.length - 1].count;
    const previousMonthCount = monthlyData[monthlyData.length - 2].count;
    const growth = this.calculateGrowth(currentMonthCount, previousMonthCount);

    return { total, growth, monthlyData };
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

  private async getComparisonData(
    residentId?: number,
  ): Promise<ComparisonData> {
    const [daily, weekly, monthly] = await Promise.all([
      this.getDailyComparison(residentId),
      this.getWeeklyComparison(residentId),
      this.getMonthlyComparison(residentId),
    ]);

    return { daily, weekly, monthly };
  }

  private async getDailyComparison(
    residentId?: number,
  ): Promise<ComparisonData['daily']> {
    const currentDate = new Date();
    const labels = Array.from({ length: 7 }, (_, i) =>
      format(subDays(currentDate, 6 - i), 'EEE'),
    );

    const current = await Promise.all(
      labels.map((_, i) =>
        this.getCountForDay(subDays(currentDate, 6 - i), residentId),
      ),
    );

    const previous = await Promise.all(
      labels.map((_, i) =>
        this.getCountForDay(subDays(currentDate, 13 - i), residentId),
      ),
    );

    return { labels, current, previous };
  }

  private async getWeeklyComparison(
    residentId?: number,
  ): Promise<ComparisonData['weekly']> {
    const currentDate = new Date();
    const labels = ['W1', 'W2', 'W3', 'W4'];

    const current = await Promise.all(
      labels.map((_, i) =>
        this.getCountForWeek(subWeeks(currentDate, 3 - i), residentId),
      ),
    );

    const previous = await Promise.all(
      labels.map((_, i) =>
        this.getCountForWeek(subWeeks(currentDate, 7 - i), residentId),
      ),
    );

    return { labels, current, previous };
  }

  private async getMonthlyComparison(
    residentId?: number,
  ): Promise<ComparisonData['monthly']> {
    const currentDate = new Date();
    const labels = Array.from({ length: 12 }, (_, i) =>
      format(subMonths(currentDate, 11 - i), 'MMM'),
    );

    const current = await Promise.all(
      labels.map((_, i) =>
        this.getCountForMonth(subMonths(currentDate, 11 - i), residentId),
      ),
    );

    const previous = await Promise.all(
      labels.map((_, i) =>
        this.getCountForMonth(subMonths(currentDate, 23 - i), residentId),
      ),
    );

    return { labels, current, previous };
  }

  private async getCountForDay(
    date: Date,
    residentId?: number,
  ): Promise<number> {
    return this.prismaService.letterRequest.count({
      where: {
        ...(residentId && { residentId }),
        createdAt: {
          gte: startOfDay(date),
          lt: endOfDay(date),
        },
      },
    });
  }

  private async getCountForWeek(
    date: Date,
    residentId?: number,
  ): Promise<number> {
    return this.prismaService.letterRequest.count({
      where: {
        ...(residentId && { residentId }),
        createdAt: {
          gte: startOfWeek(date),
          lt: endOfWeek(date),
        },
      },
    });
  }

  private async getCountForMonth(
    date: Date,
    residentId?: number,
  ): Promise<number> {
    return this.prismaService.letterRequest.count({
      where: {
        ...(residentId && { residentId }),
        createdAt: {
          gte: startOfMonth(date),
          lt: endOfMonth(date),
        },
      },
    });
  }

  private async getLetterStatusData(
    residentId?: number,
  ): Promise<LetterStatusData> {
    const now = new Date();
    const dailyStart = startOfDay(subDays(now, 1));
    const weeklyStart = startOfWeek(now);
    const monthlyStart = startOfMonth(now);

    const [dailyData, weeklyData, monthlyData] = await Promise.all([
      this.getStatusDataForPeriod(dailyStart, now, residentId),
      this.getStatusDataForPeriod(weeklyStart, now, residentId),
      this.getStatusDataForPeriod(monthlyStart, now, residentId),
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
    residentId?: number,
  ): Promise<{ [key: string]: number }> {
    const statusCounts = await this.prismaService.letterRequest.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
      where: {
        ...(residentId && { residentId }),
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

  private async getPopulationDocumentData(
    residentId?: number,
  ): Promise<PopulationDocumentData> {
    let letterRequests;
    if (residentId) {
      letterRequests = await this.prismaService.letterRequest.findMany({
        where: { residentId },
        include: {
          letterType: {
            include: {
              category: true,
            },
          },
        },
      });
    } else {
      letterRequests = await this.prismaService.letterRequest.findMany({
        include: {
          letterType: {
            include: {
              category: true,
            },
          },
        },
      });
    }

    const documentTypes = letterRequests.reduce((acc, request) => {
      if (!acc[request.letterTypeId]) {
        acc[request.letterTypeId] = {
          id: request.letterTypeId,
          name: request.letterType.name,
          category: request.letterType.category.name,
          requests: [],
        };
      }
      acc[request.letterTypeId].requests.push(request);
      return acc;
    }, {});

    const rows: PopulationDocumentRow[] = Object.values(documentTypes).map(
      (documentType: any) => {
        const totalRequests = documentType.requests.length;
        const completedRequests = documentType.requests.filter(
          (request) =>
            request.status === RequestStatus.COMPLETED ||
            request.status === RequestStatus.ARCHIVED,
        ).length;
        const latestRequest = documentType.requests.reduce(
          (latest, request) =>
            latest.createdAt > request.createdAt ? latest : request,
          documentType.requests[0],
        );

        const completionRate = (completedRequests / totalRequests) * 100;

        return {
          documentType: documentType.name,
          category: documentType.category,
          totalRequests: totalRequests,
          lastRequestDate: format(latestRequest.createdAt, 'dd MMM yyyy'),
          completionRate: Math.round(completionRate),
        };
      },
    );

    return { rows };
  }

  private calculateGrowth(current: number, previous: number): number {
    return previous > 0
      ? ((current - previous) / previous) * 100
      : current > 0
        ? 100
        : 0;
  }
}
