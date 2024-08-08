export interface MonthlyData {
  month: string;
  count: number;
}

export class DashboardResponse {
  users: {
    total: number;
    growth: number;
    currentMonthCount: number;
    previousMonthCount: number;
    monthlyData: MonthlyData[];
  };
  letters: {
    totalRequests: number;
    totalArchived: number;
    requestGrowth: number;
    archivedGrowth: number;
    currentMonthRequests: number;
    previousMonthRequests: number;
    currentMonthArchived: number;
    previousMonthArchived: number;
    monthlyRequestData: MonthlyData[];
    monthlyArchivedData: MonthlyData[];
  };
}
