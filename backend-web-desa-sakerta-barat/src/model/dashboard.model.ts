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

export interface LetterStatusData {
  daily: { [key: string]: number };
  weekly: { [key: string]: number };
  monthly: { [key: string]: number };
}

export interface PopulationDocumentRow {
  documentType: string;
  totalRequests: number;
  lastRequestDate: string;
  completionRate: number;
  category: string;
}

export interface PopulationDocumentData {
  rows: PopulationDocumentRow[];
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
    statusData?: LetterStatusData;
  };
  populationDocuments?: PopulationDocumentData;
}

export interface ResidentDashboardResponse {
  totalRequests: {
    total: number;
    growth: number;
    monthlyData: MonthlyData[];
  };
  totalDocuments: {
    total: number;
    growth: number;
    monthlyData: MonthlyData[];
  };
  recentRequests: {
    total: number;
    growth: number;
    monthlyData: MonthlyData[];
  };
  letterStatus: LetterStatusData;
  comparison: ComparisonData;
  populationDocuments: {
    rows: PopulationDocumentRow[];
  };
}
