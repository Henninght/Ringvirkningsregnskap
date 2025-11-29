"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { sectorData as rawSectorData } from "@/data/mockData";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// Convert to compatible format for recharts
const sectorData = rawSectorData.map(item => ({
  ...item,
  [Symbol.iterator]: undefined,
})) as Array<{ name: string; value: number; color: string; [key: string]: unknown }>;

export function SectorPieChart() {
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize data
  const memoizedData = useMemo(() => sectorData, []);

  // Total for sentral visning
  const totalValue = useMemo(() =>
    sectorData.reduce((sum, item) => sum + item.value, 0),
    []
  );

  // Hover handlers for interaktivitet
  const handleMouseEnter = (_: unknown, index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <Card className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
      <CardHeader>
        <CardTitle>Verdi per sektor</CardTitle>
        <p className="text-xs text-slate-500 mt-1">Fordeling av total verdiskaping</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          {/* Chart */}
          <div className="h-[200px] w-[200px] flex-shrink-0 relative">
            {mounted ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={memoizedData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={hoveredIndex !== null ? 90 : 85}
                      innerRadius={50}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                      animationBegin={200}
                      animationDuration={600}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      {memoizedData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="white"
                          strokeWidth={hoveredIndex === index ? 3 : 2}
                          style={{
                            cursor: "pointer",
                            opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.6 : 1,
                            transition: "all 0.2s ease-in-out",
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #dee2e6",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(30,42,56,0.1)",
                        padding: "10px 14px",
                        fontSize: "13px",
                      }}
                      formatter={(value: number) => [`${value}%`, "Andel"]}
                      labelStyle={{ fontWeight: 600, color: "#212529", marginBottom: "4px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Sentral tekst overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    {hoveredIndex !== null ? (
                      <>
                        <div className="text-xs text-slate-500 truncate max-w-[70px]">
                          {memoizedData[hoveredIndex].name}
                        </div>
                        <div className="text-lg font-bold text-petrol-600">
                          {memoizedData[hoveredIndex].value}%
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-xs text-slate-500">Total</div>
                        <div className="text-lg font-bold text-slate-800">{totalValue}%</div>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full w-full bg-slate-100 rounded-full animate-pulse" />
            )}
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-3">
            {sectorData.map((sector) => (
              <div key={sector.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: sector.color }}
                  />
                  <span className="text-sm text-slate-700">{sector.name}</span>
                </div>
                <span className="text-sm font-semibold text-slate-800">{sector.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
