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
  confirmed: {
    label: "Confirmed",
    color: "hsl(200, 80%, 50%)",
  },
  unverified: {
    label: "Unverified",
    color: "hsl(215, 16%, 47%)",
  },
};

export function OrderStatus({ data = [] }) {
  const totalOrders = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.count, 0);
  }, [data]);

  const hasData = totalOrders > 0;

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full p-4 overflow-hidden flex flex-col">
      <div className="mb-4 flex-shrink-0">
        <h2 className="text-xl font-semibold">Order Summary</h2>
      </div>
      <CardContent className="flex-1 pb-0 min-h-0 flex flex-col">
        <div className="flex-shrink-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[200px]"
          >
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Pie
                data={
                  hasData
                    ? data
                    : [{ status: "none", count: 1, fill: "var(--muted)" }]
                }
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                outerRadius={80}
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
        </div>

        <div className="mt-4 flex-1 overflow-auto">
          <ul>
            {data.map((item) => (
              <li
                key={item.status}
                className="flex items-center justify-between mb-3 text-sm"
              >
                <span className="capitalize">
                  {chartConfig[item.status]?.label || item.status}
                </span>
                <span
                  className="rounded-full px-2 text-sm text-white"
                  style={{
                    backgroundColor:
                      item.fill || chartConfig[item.status]?.color,
                  }}
                >
                  {item.count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </div>
  );
}
