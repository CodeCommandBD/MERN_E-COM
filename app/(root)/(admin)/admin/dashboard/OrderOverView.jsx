"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";


import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart";

const chartData = [
  { month: "January", amount: 186 },
  { month: "February", amount: 305 },
  { month: "March", amount: 237 },
  { month: "April", amount: 73 },
  { month: "May", amount: 209 },
  { month: "June", amount: 214 },
  { month: "July", amount: 190 },
  { month: "August", amount: 150 },
  { month: "September", amount: 120 },
  { month: "October", amount: 100 },
  { month: "November", amount: 80 },
  { month: "December", amount: 60 },
];

const chartConfig = {
  amount: {
    label: "Amount",
    color: "var(--primary)",
  },
};

export function OrderOverView() {
  return (
    <div className="rounded-lg">
      <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent  />}
            />
            <Bar dataKey="amount" fill="var(--primary)" radius={5} />
          </BarChart>
        </ChartContainer>
    </div>
  );
}
