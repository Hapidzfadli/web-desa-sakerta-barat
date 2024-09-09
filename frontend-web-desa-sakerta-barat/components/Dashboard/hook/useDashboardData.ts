import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '../../../lib/actions/dashboard.action';
import { DashboardData, ResidentDashboardData } from '../types/dashboard.type';
import { useUser } from '../../../app/context/UserContext';
export const useDashboardData = () => {
  const { user } = useUser();

  const { data, isLoading, isError } = useQuery<
    DashboardData | ResidentDashboardData,
    Error
  >({
    queryKey: ['dashboardData', user?.role],
    queryFn: () => fetchDashboardData(user?.role || ''),
    staleTime: 60000,
    enabled: !!user,
  });

  return {
    data,
    isLoading,
    isError,
  };
};

export default useDashboardData;
