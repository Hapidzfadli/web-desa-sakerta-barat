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
}

export interface DashboardData {
  users: UserStats;
  letters: LetterStats;
}
