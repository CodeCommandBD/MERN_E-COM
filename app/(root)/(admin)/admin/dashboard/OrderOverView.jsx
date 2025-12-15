"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart";

const chartConfig = {
  amount: {
    label: "Amount",
    color: "var(--primary)",
  },
};

export function OrderOverView({ data }) {
  if (!data || data.length === 0) return <div>No data available</div>;

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm h-full p-4 overflow-hidden">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Order Overview</h2>
      </div>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
            tick={{ fill: 'currentColor' }}
            className="text-gray-900 dark:text-gray-100"
          />
          <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
          <Bar dataKey="amount" fill="var(--primary)" radius={5} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
