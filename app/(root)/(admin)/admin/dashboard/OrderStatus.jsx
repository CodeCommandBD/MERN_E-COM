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

  const getStatusColor = (status) => {
    const colors = {
      pending:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      processing:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      shipped:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      delivered:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      confirmed: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
      unverified:
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    );
  };

  return (
    <div className="rounded-lg border bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm h-full p-4 overflow-hidden flex flex-col">
      <div className="mb-4 flex-shrink-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Order Summary</h2>
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
                            className="fill-foreground text-3xl font-bold dark:fill-white"
                          >
                            {totalOrders.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground dark:fill-white"
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

        <div className="mt-4 flex-1 overflow-auto pr-2">
          <ul>
            {data.map((item) => (
              <li
                key={item.status}
                className="flex items-center justify-between mb-3 text-sm"
              >
                <span className="capitalize text-gray-600 dark:text-gray-300 font-medium">
                  {chartConfig[item.status]?.label || item.status}
                </span>
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-bold ${getStatusColor(
                    item.status
                  )}`}
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
