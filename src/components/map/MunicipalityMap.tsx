"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Municipality } from "@/types/ripple";
import {
  municipalityData,
  calculateHeatmapIntensity,
  getHeatmapColor,
  getCounties,
} from "@/data/municipalities";
import { MapPin, Users, Activity, Filter } from "lucide-react";

// Formater tall med norsk locale
const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("nb-NO", {
    maximumFractionDigits: 0,
  }).format(value);
};

// Dynamisk import av Leaflet (client-side only)
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false }
);

type MetricType = "employees" | "nurses" | "coverage";

interface MunicipalityMapProps {
  selectedCounty?: string | null;
  onMunicipalityClick?: (municipality: Municipality) => void;
}

export function MunicipalityMap({
  selectedCounty,
  onMunicipalityClick,
}: MunicipalityMapProps) {
  const [mounted, setMounted] = useState(false);
  const [metric, setMetric] = useState<MetricType>("nurses");
  const [countyFilter, setCountyFilter] = useState<string | null>(selectedCounty || null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize fylker
  const counties = useMemo(() => getCounties(), []);

  // Memoize filtrerte kommuner
  const filteredMunicipalities = useMemo(() =>
    countyFilter
      ? municipalityData.filter((m) => m.county === countyFilter)
      : municipalityData,
    [countyFilter]
  );

  // Memoize max-verdier for radius-beregning
  const maxValues = useMemo(() => ({
    employees: Math.max(...municipalityData.map((m) => m.employees)),
    nurses: Math.max(...municipalityData.map((m) => m.nurses || 0)),
    coverage: Math.max(...municipalityData.map((m) => m.coverageRatio || 0)),
  }), []);

  const metricLabels: Record<MetricType, string> = {
    employees: "Ansatte",
    nurses: "Sykepleiere",
    coverage: "Dekningsgrad",
  };

  const handleMunicipalityClick = useCallback((municipality: Municipality) => {
    setSelectedMunicipality(municipality);
    onMunicipalityClick?.(municipality);
  }, [onMunicipalityClick]);

  // Beregn radius basert på verdi - optimalisert
  const getRadius = useCallback((municipality: Municipality): number => {
    const value =
      metric === "employees"
        ? municipality.employees
        : metric === "nurses"
        ? municipality.nurses || 0
        : municipality.coverageRatio || 0;

    const maxValue = maxValues[metric];

    // Skaler radius mellom 8 og 30
    const minRadius = 8;
    const maxRadius = 30;
    return minRadius + (value / maxValue) * (maxRadius - minRadius);
  }, [metric, maxValues]);

  if (!mounted) {
    return (
      <Card className="h-full animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin size={18} className="text-petrol-500" />
            Kommunekart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] bg-slate-100 rounded-xl flex items-center justify-center">
            <div className="text-slate-400">Laster kart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full animate-slide-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin size={18} className="text-petrol-500" />
            Kommunekart - Sykepleierdekning
          </CardTitle>

          {/* Metric selector */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value as MetricType)}
              className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-petrol-500/20"
            >
              <option value="nurses">Sykepleiere</option>
              <option value="employees">Ansatte</option>
              <option value="coverage">Dekningsgrad</option>
            </select>
          </div>
        </div>

        {/* County filter */}
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={() => setCountyFilter(null)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              countyFilter === null
                ? "bg-petrol-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Alle fylker
          </button>
          {counties.map((county) => (
            <button
              key={county}
              onClick={() => setCountyFilter(county)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                countyFilter === county
                  ? "bg-petrol-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {county}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {/* Map container */}
        <div className="h-[500px] rounded-xl overflow-hidden border border-slate-200">
          <MapContainer
            center={[65.0, 13.0]}
            zoom={4}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            {filteredMunicipalities.map((municipality) => {
              const intensity = calculateHeatmapIntensity(municipality, metric);
              const color = getHeatmapColor(intensity);
              const radius = getRadius(municipality);

              return (
                <CircleMarker
                  key={municipality.id}
                  center={[municipality.coordinates.lat, municipality.coordinates.lng]}
                  radius={radius}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 0.7,
                    color: "#3d838b",
                    weight: selectedMunicipality?.id === municipality.id ? 3 : 1,
                  }}
                  eventHandlers={{
                    click: () => handleMunicipalityClick(municipality),
                  }}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                    <div className="text-sm" style={{ minWidth: "160px" }}>
                      <div className="font-semibold text-slate-800">{municipality.name}</div>
                      <div className="text-slate-500 text-xs mb-2">{municipality.county}</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Sykepleiere:</span>
                          <span className="font-medium text-petrol-600">{formatNumber(municipality.nurses || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Dekningsgrad:</span>
                          <span className="font-medium text-sage-600">{municipality.coverageRatio?.toFixed(1)} per 1000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Befolkning:</span>
                          <span className="font-medium">{formatNumber(municipality.population)}</span>
                        </div>
                      </div>
                    </div>
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-slate-500 mb-1">
              <MapPin size={14} />
              <span className="text-xs">Kommuner</span>
            </div>
            <div className="text-xl font-bold text-slate-800" style={{ fontFamily: "var(--font-outfit)" }}>
              {filteredMunicipalities.length}
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-slate-500 mb-1">
              <Users size={14} />
              <span className="text-xs">Sykepleiere</span>
            </div>
            <div className="text-xl font-bold text-petrol-600" style={{ fontFamily: "var(--font-outfit)" }}>
              {filteredMunicipalities
                .reduce((sum, m) => sum + (m.nurses || 0), 0)
                .toLocaleString("nb-NO")}
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-slate-500 mb-1">
              <Activity size={14} />
              <span className="text-xs">Snitt dekningsgrad</span>
            </div>
            <div className="text-xl font-bold text-sage-600" style={{ fontFamily: "var(--font-outfit)" }}>
              {(
                filteredMunicipalities.reduce((sum, m) => sum + (m.coverageRatio || 0), 0) /
                filteredMunicipalities.length
              ).toFixed(1)}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex">
              {["#f0f7f7", "#b8d8da", "#5a9fa6", "#3d838b"].map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-3 first:rounded-l last:rounded-r"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500">
              Lav - Hoy {metricLabels[metric].toLowerCase()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-petrol-400/50" />
              <div className="w-5 h-5 rounded-full bg-petrol-400/50" />
            </div>
            <span className="text-xs text-slate-500">Storrelse = antall</span>
          </div>
        </div>

        {/* Selected municipality details */}
        {selectedMunicipality && (
          <div className="mt-4 p-4 bg-petrol-50 rounded-xl border border-petrol-200">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-slate-800">{selectedMunicipality.name}</h4>
                <p className="text-sm text-slate-500">{selectedMunicipality.county}</p>
              </div>
              <button
                onClick={() => setSelectedMunicipality(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                x
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-3 text-sm">
              <div>
                <div className="text-slate-500">Befolkning</div>
                <div className="font-semibold">{selectedMunicipality.population.toLocaleString("nb-NO")}</div>
              </div>
              <div>
                <div className="text-slate-500">Sykepleiere</div>
                <div className="font-semibold text-petrol-600">
                  {selectedMunicipality.nurses?.toLocaleString("nb-NO")}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Dekningsgrad</div>
                <div className="font-semibold text-sage-600">
                  {selectedMunicipality.coverageRatio?.toFixed(1)} per 1000
                </div>
              </div>
              <div>
                <div className="text-slate-500">Ansatte</div>
                <div className="font-semibold">{selectedMunicipality.employees}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
