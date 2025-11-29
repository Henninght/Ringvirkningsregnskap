"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { directEffectsData } from "@/data/mockData";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Formater tall med norsk locale
const formatNorwegianNumber = (value: number): string => {
  return new Intl.NumberFormat("nb-NO", {
    maximumFractionDigits: 0,
  }).format(value);
};

const COLORS = {
  fou: "#6b74a8",
  infrastruktur: "#3d838b",
  lonninger: "#5c825c",
  direkteEffekter: "#d9a04a",
};

export function DirectEffectsChart() {
  // Memoize data for bedre ytelse
  const memoizedData = useMemo(() => directEffectsData, []);

  // Custom tooltip formatter
  const tooltipFormatter = (value: number, name: string) => {
    const labels: Record<string, string> = {
      direkteEffekter: "Direkte effekter",
      lonninger: "Lønninger",
      infrastruktur: "Infrastruktur",
      fou: "FoU",
    };
    return [`${formatNorwegianNumber(value)} mill NOK`, labels[name] || name];
  };

  return (
    <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <CardHeader>
        <CardTitle>Direkte effekter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={memoizedData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorFou" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.fou} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS.fou} stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorInfra" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={COLORS.infrastruktur}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={COLORS.infrastruktur}
                    stopOpacity={0.2}
                  />
                </linearGradient>
                <linearGradient id="colorLonn" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={COLORS.lonninger}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={COLORS.lonninger}
                    stopOpacity={0.2}
                  />
                </linearGradient>
                <linearGradient id="colorDirekte" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={COLORS.direkteEffekter}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={COLORS.direkteEffekter}
                    stopOpacity={0.2}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(value) => formatNorwegianNumber(value)}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  padding: "12px 16px",
                }}
                labelStyle={{ fontWeight: 600, color: "#1e293b", marginBottom: "4px" }}
                formatter={tooltipFormatter}
              />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="circle"
                iconSize={8}
              />
              <Area
                type="monotone"
                dataKey="direkteEffekter"
                name="Direkte effekter"
                stackId="1"
                stroke={COLORS.direkteEffekter}
                fill="url(#colorDirekte)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="lonninger"
                name="Lønninger"
                stackId="1"
                stroke={COLORS.lonninger}
                fill="url(#colorLonn)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="infrastruktur"
                name="Infrastruktur"
                stackId="1"
                stroke={COLORS.infrastruktur}
                fill="url(#colorInfra)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="fou"
                name="FoU"
                stackId="1"
                stroke={COLORS.fou}
                fill="url(#colorFou)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
