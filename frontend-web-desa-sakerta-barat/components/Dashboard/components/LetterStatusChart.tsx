import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ApexOptions } from 'apexcharts';
import {
  translateStatus,
  RequestStatus,
} from '../../../lib/letterRequestUtils';
import { LetterStatusData } from '../types/dashboard.type';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const statusColors: Record<RequestStatus, string> = {
  [RequestStatus.SUBMITTED]: '#B1AFFF',
  [RequestStatus.APPROVED]: '#B6C7AA',
  [RequestStatus.REJECTED]: '#FF7D29',
  [RequestStatus.SIGNED]: '#FFC96F',
  [RequestStatus.COMPLETED]: '#7EA1FF',
  [RequestStatus.ARCHIVED]: '#FFEC9E',
};

interface LetterStatusChartProps {
  statusData: LetterStatusData;
}

const LetterStatusChart: React.FC<LetterStatusChartProps> = ({
  statusData,
}) => {
  const [timeframe, setTimeframe] = useState('monthly');

  const chartData = React.useMemo(() => {
    const currentData = statusData[timeframe as keyof LetterStatusData];
    const labels = Object.keys(currentData).map(translateStatus);
    const series = Object.values(currentData);
    const colors = Object.keys(currentData).map(
      (status) => statusColors[status as RequestStatus] || '#000000',
    );

    return { labels, series, colors };
  }, [statusData, timeframe]);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'pie',
      animations: {
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    labels: chartData.labels,
    colors: chartData.colors,
    legend: { show: false },
    stroke: {
      width: 0,
      colors: ['#ffffff'],
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number, opts: any) {
        const percent = Math.round(val);
        return percent > 5 ? `${percent}%` : '';
      },
      style: {
        fontSize: '12px',
        fontFamily: 'DM Sans, Poppins, sans-serif',
        fontWeight: 'bold',
        colors: ['#ffffff'],
      },
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 1,
        left: 1,
        blur: 3,
        opacity: 0.3,
      },
    },
    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          size: '60%',
        },
      },
    },
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 0.1,
        },
      },
      active: {
        filter: {
          type: 'darken',
          value: 0.1,
        },
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (value: number) {
          return value.toString();
        },
      },
      style: {
        fontSize: '14px',
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="head-form">Status Surat</CardTitle>
        <Select
          value={timeframe}
          onValueChange={(value) => setTimeframe(value)}
        >
          <SelectTrigger className="w-[120px] border-0 bg-[#F4F7FE] text-[#A3AED0]">
            <SelectValue placeholder="Pilih periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Harian</SelectItem>
            <SelectItem value="weekly">Mingguan</SelectItem>
            <SelectItem value="monthly">Bulanan</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="">
        <div className="flex flex-col items-center">
          <Chart
            options={chartOptions}
            series={chartData.series}
            type="pie"
            height={300}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 gap-4 text-center">
          {Object.entries(statusData[timeframe as keyof LetterStatusData]).map(
            ([status, count], index) => (
              <div
                key={status}
                className={`flex flex-col items-center ${index % 2 === 1 ? 'border-l border-gray-200' : ''}`}
              >
                <span
                  className="w-3 h-3 rounded-full mb-1"
                  style={{
                    backgroundColor: statusColors[status as RequestStatus],
                  }}
                ></span>
                <span className="text-xs font-normal text-[#A3AED0]">
                  {translateStatus(status)}
                </span>
                <span className="text-sm font-bold text-[#2B3674]">
                  {count}
                </span>
              </div>
            ),
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LetterStatusChart;
