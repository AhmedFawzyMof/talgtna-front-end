import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface ChartDataType {
  month: string;
  monthly_total: number;
}

export function Overview({ chartData }: { chartData?: ChartDataType[] }) {
  const [data, setData] = useState<ChartDataType[]>([]);
  useEffect(() => {
    const newChartData = chartData?.map((item: ChartDataType) => {
      return {
        ...item,
        month: item.month.replace(/-/g, "/").slice(2, 7),
      } as ChartDataType;
    });
    if (!newChartData) return;
    setData(newChartData);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `ج ${value}`}
        />
        <Tooltip
          formatter={(value) => [`EGP${value}`, "Revenue"]}
          labelFormatter={(label) => `Month: ${label}`}
        />
        <Bar
          dataKey="monthly_total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
