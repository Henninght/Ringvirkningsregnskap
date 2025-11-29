"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { historicalData } from "@/data/mockData";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

// Formater tall med norsk locale
const formatNorwegianNumber = (value: number): string => {
  return new Intl.NumberFormat("nb-NO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
};

export function HistoricalChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize data og beregninger
  const memoizedData = useMemo(() => historicalData, []);

  const { growth, isPositive } = useMemo(() => {
    const latestValue = historicalData[historicalData.length - 1].value;
    const previousValue = historicalData[historicalData.length - 2].value;
    const growthValue = ((latestValue - previousValue) / previousValue * 100);
    return {
      growth: growthValue.toFixed(1),
      isPositive: growthValue >= 0
    };
  }, []);

  return (
    <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Historisk verdiskaping</CardTitle>
            <p className="text-xs text-slate-500 mt-1">Utvikling over tid (mrd NOK)</p>
          </div>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${
              isPositive ? "bg-success-50 text-success-700" : "bg-red-50 text-red-700"
            }`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span className="text-xs font-medium">{isPositive ? "+" : ""}{growth}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={memoizedData}
                margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3d838b" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3d838b" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e9ecef"
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6c757d", fontSize: 11 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6c757d", fontSize: 11 }}
                  tickFormatter={(value) => formatNorwegianNumber(value)}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #dee2e6",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(30,42,56,0.1)",
                    padding: "10px 14px",
                    fontSize: "13px",
                  }}
                  formatter={(value: number) => [
                    `${formatNorwegianNumber(value)} mrd NOK`,
                    "Verdiskaping",
                  ]}
                  labelStyle={{ fontWeight: 600, color: "#212529", marginBottom: "4px" }}
                  labelFormatter={(label) => `År ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3d838b"
                  strokeWidth={2.5}
                  fill="url(#colorValue)"
                  dot={{
                    fill: "#3d838b",
                    strokeWidth: 2,
                    stroke: "white",
                    r: 3.5,
                  }}
                  activeDot={{
                    fill: "#3d838b",
                    strokeWidth: 2.5,
                    stroke: "white",
                    r: 5,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full bg-slate-100 rounded-lg animate-pulse" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
