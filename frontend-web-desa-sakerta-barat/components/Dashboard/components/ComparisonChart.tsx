import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Calendar, BarChart2, CircleCheckBig } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ComparisonData, ComparisonChartProps } from '../types/dashboard.type';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ComparisonChart: React.FC<ComparisonChartProps> = ({
  comparisonData,
}) => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>(
    'monthly',
  );

  const { labels, current, previous } = comparisonData[timeframe];

  const totalCurrent = current.reduce((sum, value) => sum + value, 0);
  const totalPrevious = previous.reduce((sum, value) => sum + value, 0);
  const growthPercentage =
    totalPrevious !== 0
      ? (((totalCurrent - totalPrevious) / totalPrevious) * 100).toFixed(2)
      : totalCurrent * 100;

  const chartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      background: '#ffffff',
      parentHeightOffset: 0,
      parentWidthOffset: 0,
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
      categories: labels,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#A3AED0',
          fontSize: '12px',
        },
        rotate: 0,
      },
    },
    yaxis: { show: false },
    grid: { show: false },
    tooltip: {
      x: { format: 'dd/MM/yy' },
    },
    legend: { show: false },
    colors: ['#4318FF', '#6AD2FF'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
  };

  const series = [
    { name: 'Periode Ini', data: current },
    { name: 'Periode Sebelumnya', data: previous },
  ];

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'daily':
        return 'Minggu Ini vs Minggu Lalu';
      case 'weekly':
        return 'Bulan Ini vs Bulan Lalu';
      case 'monthly':
        return 'Tahun Ini vs Tahun Lalu';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <Select
          defaultValue="monthly"
          onValueChange={(value) =>
            setTimeframe(value as 'daily' | 'weekly' | 'monthly')
          }
        >
          <SelectTrigger className="w-[180px] border-0 bg-[#F4F7FE] text-[#A3AED0]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Pilih periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Harian</SelectItem>
            <SelectItem value="weekly">Mingguan</SelectItem>
            <SelectItem value="monthly">Bulanan</SelectItem>
          </SelectContent>
        </Select>
        <div className="h-8 w-8 bg-[#F4F7FE] rounded-lg flex items-center justify-center">
          <BarChart2 className="h-4 w-4 text-[#4318FF]" />
        </div>
      </div>

      <div className="grid grid-cols-3 mt-6">
        <div className="mr-6 flex-col flex gap-4">
          <div className="flex flex-col text-sm">
            <h2 className="text-4xl font-bold text-[#2B3674]">
              {totalCurrent}
            </h2>
            <span className="text-[#A3AED0]">Total Permohonan</span>
          </div>
          <div className="text-sm text-green-500 flex items-center mt-1">
            <CircleCheckBig className="h-5 w-5 bg-[#05CD99] text-white rounded-full mr-2" />
            <span className="font-semibold">On track</span>
          </div>
        </div>
        <div className="h-64 w-full col-span-2 relative">
          <span
            className={`absolute z-10 top-0 right-0 text-sm ${Number(growthPercentage) >= 0 ? 'text-green-500' : 'text-red-500'}`}
          >
            {Number(growthPercentage) >= 0 ? '+' : ''}
            {growthPercentage}%
          </span>
          {/* <span className="absolute z-10 top-0 left-0 text-sm text-[#A3AED0]">
            {getTimeframeLabel()}
          </span> */}
          <Chart
            options={chartOptions}
            series={series}
            type="area"
            height="100%"
            width="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default ComparisonChart;
