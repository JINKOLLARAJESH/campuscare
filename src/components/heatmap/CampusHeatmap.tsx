import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { INITIAL_LOCATIONS } from '../../lib/mockData';
import { ComplaintCategory, CampusLocation } from '../../types';
import { MapPin, Filter, Layers, AlertCircle, CheckCircle2, ShieldCheck, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CampusHeatmapProps {
  onSelectLocation?: (locationName: string) => void;
}

export const CampusHeatmap: React.FC<CampusHeatmapProps> = ({ onSelectLocation }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high' | 'active'>('all');
  const [activeLocation, setActiveLocation] = useState<CampusLocation | null>(INITIAL_LOCATIONS[0]);

  const getHeatmapColor = (activeCount: number) => {
    if (activeCount >= 5) {
      return {
        dot: 'bg-rose-500 animate-ping',
        pin: 'bg-rose-600 text-white shadow-rose-500/50',
        tag: 'High Concentration',
        badgeColor: 'danger' as const,
      };
    }
    if (activeCount >= 3) {
      return {
        dot: 'bg-amber-500 animate-pulse',
        pin: 'bg-amber-500 text-white shadow-amber-500/50',
        tag: 'Moderate Activity',
        badgeColor: 'warning' as const,
      };
    }
    return {
      dot: 'bg-emerald-500',
      pin: 'bg-emerald-600 text-white shadow-emerald-500/50',
      tag: 'Low Activity',
      badgeColor: 'success' as const,
    };
  };

  const filteredLocations = INITIAL_LOCATIONS.filter((loc) => {
    if (selectedFilter === 'high') return loc.activeIncidents >= 4;
    if (selectedFilter === 'active') return loc.activeIncidents > 0;
    return true;
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-royal-600" />
            Campus Incident Hotspot Heatmap
          </CardTitle>
          <CardDescription>
            Geospatial visualization of campus facilities with aggregated report density (privacy protected)
          </CardDescription>
        </div>

        {/* Heatmap Legend */}
        <div className="flex items-center gap-3 text-xs bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300">Low (&lt;3)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600 dark:text-slate-300">Moderate (3-4)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-600 dark:text-slate-300">Hotspot (5+)</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-600 dark:text-slate-300">Filter View:</span>
            <button
              onClick={() => setSelectedFilter('all')}
              className={cn(
                'px-2.5 py-1 rounded-md transition-colors',
                selectedFilter === 'all'
                  ? 'bg-navy-900 text-white dark:bg-royal-600 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              )}
            >
              All Zones ({INITIAL_LOCATIONS.length})
            </button>
            <button
              onClick={() => setSelectedFilter('high')}
              className={cn(
                'px-2.5 py-1 rounded-md transition-colors',
                selectedFilter === 'high'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              )}
            >
              High Density Hotspots
            </button>
            <button
              onClick={() => setSelectedFilter('active')}
              className={cn(
                'px-2.5 py-1 rounded-md transition-colors',
                selectedFilter === 'active'
                  ? 'bg-navy-900 text-white dark:bg-royal-600 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              )}
            >
              Active Incidents
            </button>
          </div>

          <span className="text-[11px] text-slate-400">
            Click any beacon to view facility metrics
          </span>
        </div>

        {/* Campus Map Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Visual Campus Blueprint */}
          <div className="lg:col-span-2 relative aspect-[16/10] bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner p-4">
            {/* Architectural Grid Background */}
            <div
              className="absolute inset-0 opacity-[0.15] dark:opacity-[0.25]"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #2563EB 1px, transparent 1px), radial-gradient(circle, #2563EB 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Campus Zone Borders & Labels */}
            <div className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-600">
              North Residential Zone
            </div>
            <div className="absolute top-4 right-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-600">
              Tech & Research Enclave
            </div>
            <div className="absolute bottom-4 left-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-600">
              Athletics & West Grounds
            </div>
            <div className="absolute bottom-4 right-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-600">
              Administrative & South Gate
            </div>

            {/* Simulated Campus Layout Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 dark:opacity-20 stroke-slate-400 dark:stroke-slate-600">
              <path d="M 120 100 Q 250 180 350 150 T 600 240" fill="none" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M 200 350 Q 320 220 480 300" fill="none" strokeWidth="2" strokeDasharray="4 4" />
            </svg>

            {/* Beacons */}
            {filteredLocations.map((loc) => {
              const heat = getHeatmapColor(loc.activeIncidents);
              const isSelected = activeLocation?.id === loc.id;

              return (
                <div
                  key={loc.id}
                  style={{ left: `${loc.coordinates.x}%`, top: `${loc.coordinates.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
                  onClick={() => {
                    setActiveLocation(loc);
                    if (onSelectLocation) onSelectLocation(loc.name);
                  }}
                >
                  {/* Outer pulse circle */}
                  <span
                    className={cn(
                      'absolute -inset-2 rounded-full opacity-40',
                      heat.dot
                    )}
                  />

                  {/* Marker Pin */}
                  <div
                    className={cn(
                      'relative px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg transition-transform duration-200 group-hover:scale-110 font-bold text-xs',
                      heat.pin,
                      isSelected && 'ring-4 ring-white dark:ring-royal-400 scale-110'
                    )}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="font-mono text-xs">{loc.activeIncidents}</span>
                  </div>

                  {/* Hover Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
                    <div className="bg-navy-950 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
                      <div className="font-bold">{loc.name}</div>
                      <div className="text-slate-300 text-[10px]">
                        {loc.activeIncidents} Active • {loc.resolvedIncidents} Resolved
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Location Detail Card */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            {activeLocation ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <Badge variant={getHeatmapColor(activeLocation.activeIncidents).badgeColor}>
                      {getHeatmapColor(activeLocation.activeIncidents).tag}
                    </Badge>
                    <span className="text-[11px] font-mono text-slate-400">
                      Zone: {activeLocation.zone}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                    {activeLocation.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Building: {activeLocation.building}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-semibold text-rose-600 block">
                      Active Cases
                    </span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      {activeLocation.activeIncidents}
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-semibold text-emerald-600 block">
                      Resolved
                    </span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      {activeLocation.resolvedIncidents}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300 leading-relaxed flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                  <span>
                    Locations with 5 or more active reports trigger automatic safety alerts to the Chief Proctor and Facilities Director.
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                Select a campus location beacon
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
