import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '../../../lib/actions/dashboard.action';
import { DashboardData } from '../types/dashboard.type';

export const useDashboardData = () => {
  const { data, isLoading, isError } = useQuery<DashboardData, Error>({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
    staleTime: 60000,
  });

  return {
    data,
    isLoading,
    isError,
  };
};

export default useDashboardData;
