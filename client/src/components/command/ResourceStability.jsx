import React from 'react';
import { Droplet, Wind, Shield, Flame, Activity, PackageCheck, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import StatusLed from './StatusLed';
import TacticalPanel from './TacticalPanel';

export default function ResourceStability() {
  const resourceMetrics = [
    {
      id: 'water',
      name: 'DEEP WATER RECLAMATION',
      subtext: 'REVERSE OSMOSIS & MINERAL SYNTHESIS',
      value: '82%',
      status: 'operational',
      statusLabel: 'OPERATIONAL',
      icon: Droplet,
      meter: 82,
      meterColor: 'bg-[#7CFF00]',
      burnRate: '1.2% / DAY',
      reserves: '68,000 LITERS',
    },
    {
      id: 'air',
      name: 'ATMOSPHERIC SCRUBBERS',
      subtext: 'CARBON DIOXIDE & PARTICULATE EXTRACTION',
      value: '41%',
      status: 'critical',
      statusLabel: 'DEGRADED',
      icon: Wind,
      meter: 41,
      meterColor: 'bg-[#D32F2F]',
      burnRate: 'FILTER SATURATION: 91%',
      reserves: '14 SPARE CELLS',
    },
    {
      id: 'vault',
      name: 'CRYOGENIC SEED VAULT',
      subtext: 'GENETIC BIODIVERSITY PRESERVATION',
      value: '99.4%',
      status: 'operational',
      statusLabel: 'HERMETIC',
      icon: Shield,
      meter: 99.4,
      meterColor: 'bg-[#7CFF00]',
      burnRate: '0.01% DRIFT / YR',
      reserves: '2.4M SPECIMENS',
    },
    {
      id: 'power',
      name: 'GEOTHERMAL FUSION CORE',
      subtext: 'DEEP CORE THERMAL TAP & REACTOR 1-3',
      value: '68%',
      status: 'operational',
      statusLabel: 'GRID STABLE',
      icon: Flame,
      meter: 68,
      meterColor: 'bg-[#7CFF00]',
      burnRate: 'OUTPUT: 450 MW',
      reserves: 'UNLIMITED GEOTHERMAL',
    },
    {
      id: 'rations',
      name: 'CALORIC SYNTHESIS',
      subtext: 'ALGAL PROTEIN & CARBOHYDRATE PRINTING',
      value: '76%',
      status: 'warning',
      statusLabel: 'RATIONED',
      icon: PackageCheck,
      meter: 76,
      meterColor: 'bg-[#C9A227]',
      burnRate: '2,200 KCAL / PERSON / DAY',
      reserves: '31 DAYS REMAINING',
    },
    {
      id: 'medical',
      name: 'BIOSYNTHETIC MEDICINE',
      subtext: 'ANTIBIOTIC & ANTIRAD PRINTERS',
      value: '54%',
      status: 'warning',
      statusLabel: 'LIMITED STOCK',
      icon: Activity,
      meter: 54,
      meterColor: 'bg-[#C9A227]',
      burnRate: 'RADIO-PROTECTANT: LOW',
      reserves: '420 DOSES OMEGA',
    },
  ];

  return (
    <section id="resources" className="py-12 sm:py-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#1B2123] gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] text-[#7CFF00] tracking-widest">
              [ SEC.03 // LIFE SUPPORT & RESOURCE INVENTORY ]
            </span>
            <span className="w-1.5 h-1.5 bg-[#7CFF00] rounded-full led-pulse-green" />
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#EDEFF1]">
            SURVIVAL RESOURCE RESERVES
          </h2>
        </div>

        <div className="font-mono text-[10px] text-[#A8ADB2]/60 tracking-wider">
          DEPLETION RATE MODEL: EXPONENTIAL // PROTOCOL 26
        </div>
      </div>

      {/* Grid of Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {resourceMetrics.map((res) => {
          const Icon = res.icon;
          return (
            <div
              key={res.id}
              className="bg-[#101313] border border-[#1B2123] hover:border-[#2A3337] p-4 sm:p-5 transition-all relative"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#A8ADB2]" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#EDEFF1] font-semibold">
                    {res.name}
                  </span>
                </div>
                <StatusLed status={res.status} size="sm" label={res.statusLabel} />
              </div>

              <div className="text-[10px] font-mono text-[#A8ADB2]/60 mb-3">
                {res.subtext}
              </div>

              <div className="flex items-baseline justify-between mb-2">
                <div
                  className={cn(
                    'font-mono font-bold text-2xl',
                    res.status === 'critical'
                      ? 'text-[#D32F2F]'
                      : res.status === 'warning'
                      ? 'text-[#C9A227]'
                      : 'text-[#7CFF00]'
                  )}
                >
                  {res.value}
                </div>
                <span className="font-mono text-[9px] text-[#A8ADB2]/50">CAPACITY</span>
              </div>

              {/* Meter bar */}
              <div className="w-full bg-[#050606] h-1.5 border border-[#1B2123] mb-3">
                <div
                  className={cn('h-full transition-all duration-500', res.meterColor)}
                  style={{ width: `${Math.min(res.meter, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[9px] font-mono text-[#A8ADB2]/70 pt-2 border-t border-[#1B2123]">
                <span>{res.burnRate}</span>
                <span className="text-[#EDEFF1]">{res.reserves}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
