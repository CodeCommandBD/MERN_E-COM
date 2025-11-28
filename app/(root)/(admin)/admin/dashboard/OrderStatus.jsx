"use client";

import { Pie, PieChart } from "recharts";
import React from "react";
import { Label } from "recharts";

import { CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A donut chart";

const chartData = [
  { status: "pending", count: 275, fill: "var(--color-pending)" },
  { status: "processing", count: 200, fill: "var(--color-processing)" },
  { status: "shipped", count: 187, fill: "var(--color-shipped)" },
  { status: "delivered", count: 173, fill: "var(--color-delivered)" },
  { status: "cancelled", count: 90, fill: "var(--color-cancelled)" },
  { status: "unverified", count: 900, fill: "var(--color-unverified)" },
];

const chartConfig = {
  status: {
    label: "Status",
  },
  pending: {
    label: "Pending",
    color: "hsl(45, 93%, 47%)",
  },
  processing: {
    label: "Processing",
    color: "hsl(217, 91%, 60%)",
  },
  shipped: {
    label: "Shipped",
    color: "hsl(271, 91%, 65%)",
  },
  delivered: {
    label: "Delivered",
    color: "hsl(142, 71%, 45%)",
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(0, 84%, 60%)",
  },
  unverified: {
    label: "Unverified",
    color: "hsl(215, 16%, 47%)",
  },
};

export function OrderStatus() {
  const totalOrders = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, []);
  return (
    <div className="rounded-lg">
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalOrders.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Orders
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <div>
        <ul>
          {chartData.map((item) => (
            <li
              key={item.status}
              className="flex items-center justify-between mb-3 text-sm"
            >
              <span className="capitalize">
                {chartConfig[item.status]?.label || item.status}
              </span>
              <span
                className="rounded-full px-2 text-sm text-white"
                style={{ backgroundColor: chartConfig[item.status]?.color }}
              >
                {item.count}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
