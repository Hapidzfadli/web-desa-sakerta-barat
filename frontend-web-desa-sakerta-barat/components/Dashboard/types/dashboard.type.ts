export interface MonthlyData {
  month: string;
  count: number;
}

export interface UserStats {
  total: number;
  growth: number;
  currentMonthCount: number;
  previousMonthCount: number;
  monthlyData: MonthlyData[];
}

export interface LetterStats {
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
  comparison?: ComparisonData;
}

export interface DashboardData {
  users: UserStats;
  letters: LetterStats;
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
export interface ComparisonChartProps {
  comparisonData: ComparisonData;
}
