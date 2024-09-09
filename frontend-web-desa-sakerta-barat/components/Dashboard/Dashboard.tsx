'use client';
import React from 'react';
import StatisticCard from './components/StatisticCard';
import { Users, FileText, Archive } from 'lucide-react';
import useDashboardData from './hook/useDashboardData';
import ComparisonChart from './components/ComparisonChart';
import LetterStatusChart from './components/LetterStatusChart';
import PopulationDocumentsTable from './components/PopulationDocumentsTable';
import { useUser } from '../../app/context/UserContext';

const Dashboard: React.FC = () => {
  const { data, isLoading, isError } = useDashboardData();
  const { user } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching dashboard data</div>;
  if (!data) return <div>No data available</div>;

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'KADES';

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isAdmin ? (
            <>
              <StatisticCard
                title="Total Pengguna"
                Icon={Users}
                total={data.users.total}
                growth={data.users.growth}
                monthlyData={data.users.monthlyData}
                color="#00a1ff"
              />
              <StatisticCard
                title="Total Surat"
                Icon={FileText}
                total={data.letters.totalRequests}
                growth={data.letters.requestGrowth}
                monthlyData={data.letters.monthlyRequestData}
                color="#ff0000"
              />
              <StatisticCard
                title="Total Arsip"
                Icon={Archive}
                total={data.letters.totalArchived}
                growth={data.letters.archivedGrowth}
                monthlyData={data.letters.monthlyArchivedData}
                color="#FFA000"
              />
            </>
          ) : (
            <>
              <StatisticCard
                title="Total Permohonan"
                Icon={FileText}
                total={data.totalRequests.total}
                growth={data.totalRequests.growth}
                monthlyData={data.totalRequests.monthlyData}
                color="#00a1ff"
              />
              <StatisticCard
                title="Total Dokumen"
                Icon={Archive}
                total={data.totalDocuments.total}
                growth={data.totalDocuments.growth}
                monthlyData={data.totalDocuments.monthlyData}
                color="#ff0000"
              />
              <StatisticCard
                title="Permohonan Terbaru"
                Icon={FileText}
                total={data.recentRequests.total}
                growth={data.recentRequests.growth}
                monthlyData={data.recentRequests.monthlyData}
                color="#FFA000"
              />
            </>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <ComparisonChart
              comparisonData={
                isAdmin ? data.letters.comparison : data.comparison
              }
            />
            {data.populationDocuments && (
              <PopulationDocumentsTable data={data.populationDocuments.rows} />
            )}
          </div>
          <div className="lg:col-span-1">
            <LetterStatusChart
              statusData={isAdmin ? data.letters.statusData : data.letterStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
