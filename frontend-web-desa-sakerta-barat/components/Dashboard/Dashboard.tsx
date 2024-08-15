'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatisticCard from './components/StatisticCard';
import { Users, FileText, Archive } from 'lucide-react';
import useDashboardData from './hook/useDashboardData';
import ComparisonChart from './components/ComparisonChart';
const Dashboard: React.FC = () => {
  const { data, isLoading, isError } = useDashboardData();

  console.log(data);
  console.log(isError);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching dashboard data</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="container mx-auto p-4 ">
      <div className="flexp-4 flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </div>
        <div className="grid grid-cols-3 mt-6 gap-4">
          <div className="col-span-2 ">
            <ComparisonChart comparisonData={data.letters.comparison} />
          </div>
          <div className=" ">
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
