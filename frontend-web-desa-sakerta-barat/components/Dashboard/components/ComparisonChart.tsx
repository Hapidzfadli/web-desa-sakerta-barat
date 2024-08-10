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

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const generateData = (type: 'daily' | 'weekly' | 'monthly') => {
  const currentDate = new Date();
  const labels: string[] = [];
  const currentData: number[] = [];
  const previousData: number[] = [];

  switch (type) {
    case 'daily':
      // Comparing current week with previous week
      for (let i = 6; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() - i);
        labels.push(date.toLocaleDateString('id-ID', { weekday: 'short' }));
        currentData.push(Math.floor(Math.random() * 20) + 10);
        previousData.push(Math.floor(Math.random() * 20) + 10);
      }
      break;
    case 'weekly':
      // Comparing current month with previous month
      const currentMonth = currentDate.getMonth();
      const previousMonth = (currentMonth - 1 + 12) % 12;
      const currentMonthName = currentDate.toLocaleString('default', {
        month: 'short',
      });
      const previousMonthName = new Date(
        currentDate.getFullYear(),
        previousMonth,
        1,
      ).toLocaleString('default', { month: 'short' });

      for (let i = 1; i <= 4; i++) {
        labels.push(` W${i}`);
        currentData.push(Math.floor(Math.random() * 50) + 30);
      }
      for (let i = 1; i <= 4; i++) {
        previousData.push(Math.floor(Math.random() * 50) + 30);
      }
      break;
    case 'monthly':
      // Comparing current year with previous year
      const currentYear = currentDate.getFullYear();
      const previousYear = currentYear - 1;
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      for (let i = 0; i < 12; i++) {
        labels.push(`${months[i]}`);
        currentData.push(Math.floor(Math.random() * 100) + 50);
        previousData.push(Math.floor(Math.random() * 100) + 50);
      }
      break;
  }

  return { labels, currentData, previousData };
};

const ComparisonChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>(
    'monthly',
  );

  const { labels, currentData, previousData } = useMemo(
    () => generateData(timeframe),
    [timeframe],
  );

  const totalCurrent = currentData.reduce((sum, value) => sum + value, 0);
  const totalPrevious = previousData.reduce((sum, value) => sum + value, 0);
  const growthPercentage = (
    ((totalCurrent - totalPrevious) / totalPrevious) *
    100
  ).toFixed(2);

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
    { name: 'Periode Ini', data: currentData },
    { name: 'Periode Sebelumnya', data: previousData },
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
