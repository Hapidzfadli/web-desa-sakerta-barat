import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import { Button } from '../../ui/button';
import { LucideIcon } from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface MonthlyData {
  month: string;
  count: number;
}

interface StatisticCardProps {
  title: string;
  Icon: LucideIcon;
  total: number;
  growth: number;
  monthlyData: MonthlyData[];
  color: string;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  Icon,
  total,
  growth,
  monthlyData,
  color,
}) => {
  const lastThreeMonths = monthlyData.slice(-3);

  const chartOptions = {
    chart: {
      type: 'area',
      height: 100,
      sparkline: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    colors: [color],
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function () {
            return '';
          },
        },
      },
      marker: {
        show: false,
      },
    },
  };

  const series = [
    {
      name: title,
      data: lastThreeMonths.map((data) => data.count),
    },
  ];

  // Function to create a lighter version of the color for the background
  const getLighterColor = (hex: string, percent: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return `#${(0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1)}`;
  };

  const lighterColor = getLighterColor(color, 80); // 80% lighter

  return (
    <Card className="overflow-hidden relative">
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: `linear-gradient(to bottom left, ${lighterColor}, white, white)`,
          zIndex: 0,
        }}
      />
      <CardContent className="relative" style={{ zIndex: 1 }}>
        <div className="flex gap-3 items-center pt-4">
          <div className="icon">
            <Button
              className="rounded-full p-0"
              style={{
                backgroundColor: getLighterColor(color, 90),
                width: '2rem',
                height: '2rem',
              }}
              title={title}
            >
              <Icon style={{ color: color, width: '1rem', height: '1rem' }} />
            </Button>
          </div>
          <div className="total">
            <div className="title-total text-sm text-[#A3AED0]">{title}</div>
            <div className="text-2xl font-bold text-[#2B3674] py-2">
              {total}
            </div>
            <div style={{ color: color }} className={`text-sm`}>
              {growth >= 0 ? '↑' : '↓'} {Math.abs(growth).toFixed(2)}%
            </div>
          </div>
          <div className="chart ml-auto">
            <Chart
              options={chartOptions}
              series={series}
              type="area"
              height={30}
              width={80}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticCard;
