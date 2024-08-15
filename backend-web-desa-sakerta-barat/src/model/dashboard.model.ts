export interface MonthlyData {
  month: string;
  count: number;
}

export interface ComparisonData {
  daily: {
    current: number[];
    previous: number[];
    labels: string[];
  };
  weekly: {
    current: number[];
    previous: number[];
    labels: string[];
  };
  monthly: {
    current: number[];
    previous: number[];
    labels: string[];
  };
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
    comparison?: ComparisonData;
    monthlyRequestData: MonthlyData[];
    monthlyArchivedData: MonthlyData[];
  };
}
