import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Users, 
  Thermometer, 
  Wind, 
  Hourglass, 
  Zap,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import StatusLed from './StatusLed';
import TacticalPanel from './TacticalPanel';

export default function TelemetryGrid() {
  // Live subtle fluctuation simulator for survivor count and power grid
  const [survivorCount, setSurvivorCount] = useState(8421903);
  const [powerGrid, setPowerGrid] = useState(68.4);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Subtle survivor fluctuation (-2 to +1)
      setSurvivorCount((prev) => prev + (Math.floor(Math.random() * 4) - 2));
      // Subtle power grid wobble (0.1%)
      setPowerGrid((prev) => +(prev + (Math.random() * 0.2 - 0.1)).toFixed(1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const telemetryData = [
    {
      id: 'threat',
      title: 'LIVE THREAT LEVEL',
      value: '87%',
      subtext: 'TIER: OMEGA-3 // CRITICAL',
      status: 'warning',
      statusLabel: 'HIGH ALERT',
      accentColor: 'gold', // #C9A227
      icon: AlertTriangle,
      metricValueClass: 'text-[#C9A227]',
      detail: 'Planetary seismic and atmospheric anomalies exceed safe thresholds. Containment protocols initiated.',
      meter: 87,
      meterColor: 'bg-[#C9A227]',
    },
    {
      id: 'survivors',
      title: 'SURVIVOR COUNT',
      value: survivorCount.toLocaleString('en-US', { minimumIntegerDigits: 8 }),
      subtext: 'BIOMETRIC SIGNATURES VERIFIED',
      status: 'operational',
      statusLabel: 'MONITORING',
      accentColor: 'green', // #7CFF00
      icon: Users,
      metricValueClass: 'text-[#EDEFF1]',
      detail: '84 automated shelter clusters reporting. Uplink ping frequency every 120s.',
      meter: 42,
      meterColor: 'bg-[#7CFF00]',
    },
    {
      id: 'temperature',
      title: 'GLOBAL TEMPERATURE',
      value: '+4.7°C',
      subtext: 'THERMAL ANOMALY DELTA',
      status: 'warning',
      statusLabel: 'ELEVATED',
      accentColor: 'gold',
      icon: Thermometer,
      metricValueClass: 'text-[#C9A227]',
      detail: 'Atmospheric infrared backscatter index: 14.8 W/m². Arctic ice mass delta: -91.2%.',
      meter: 78,
      meterColor: 'bg-[#C9A227]',
    },
    {
      id: 'air_quality',
      title: 'AIR QUALITY',
      value: 'CRITICAL',
      subtext: 'PARTICULATE 412 PPM // TOXIC',
      status: 'critical',
      statusLabel: 'RESPIRATORY LOCK',
      accentColor: 'danger',
      icon: Wind,
      metricValueClass: 'text-[#D32F2F]',
      detail: 'Heavy aerosolized ash and chemical fall-off. External atmosphere uninhabitable without class-4 filtration.',
      meter: 92,
      meterColor: 'bg-[#D32F2F]',
    },
    {
      id: 'resources',
      title: 'RESOURCE RESERVE',
      value: '31 DAYS',
      subtext: 'RATIONING PROTOCOL: DELTA',
      status: 'warning',
      statusLabel: 'DEPLETION RATE 2.8%',
      accentColor: 'gold',
      icon: Hourglass,
      metricValueClass: 'text-[#EDEFF1]',
      detail: 'Caloric synthesize units at 74% capacity. Deep water purification filters require recycling cycle in 8 days.',
      meter: 31,
      meterColor: 'bg-[#A8ADB2]',
    },
    {
      id: 'power',
      title: 'POWER GRID',
      value: `${powerGrid}%`,
      subtext: 'AUXILIARY GEOTHERMAL ONLINE',
      status: 'operational',
      statusLabel: 'GRID STABLE',
      accentColor: 'green',
      icon: Zap,
      metricValueClass: 'text-[#7CFF00]',
      detail: 'Vault reactors 1, 3, and 4 functioning at rated capacity. Reactor 2 offline for seismic isolation repairs.',
      meter: powerGrid,
      meterColor: 'bg-[#7CFF00]',
    },
  ];

  return (
    <section id="system" className="py-12 sm:py-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#1B2123] gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] text-[#7CFF00] tracking-widest">
              [ SEC.01 // TELEMETRY ]
            </span>
            <span className="w-1.5 h-1.5 bg-[#7CFF00] rounded-full led-pulse-green" />
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#EDEFF1]">
            COMMAND CENTER TELEMETRY
          </h2>
        </div>

        <div className="font-mono text-[10px] text-[#A8ADB2]/60 tracking-wider">
          POLLING INTERVAL: 4000MS // ENCRYPTION: AES-256-GCM
        </div>
      </div>

      {/* 6 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {telemetryData.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedCard === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedCard(isSelected ? null : item.id)}
              className={cn(
                'relative bg-[#101313] border p-4 sm:p-5 transition-all duration-200 cursor-pointer select-none group',
                isSelected
                  ? 'border-[#7CFF00]/60 shadow-[0_0_20px_rgba(124,255,0,0.1)]'
                  : 'border-[#1B2123] hover:border-[#2C353A] hover:bg-[#121616]'
              )}
            >
              {/* Corner crosshair accents */}
              <span className="absolute -top-1 -left-1 text-[8px] text-[#A8ADB2]/30 font-mono">+</span>
              <span className="absolute -top-1 -right-1 text-[8px] text-[#A8ADB2]/30 font-mono">+</span>
              <span className="absolute -bottom-1 -left-1 text-[8px] text-[#A8ADB2]/30 font-mono">+</span>
              <span className="absolute -bottom-1 -right-1 text-[8px] text-[#A8ADB2]/30 font-mono">+</span>

              {/* Card Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#A8ADB2]/80 group-hover:text-[#EDEFF1] transition-colors" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#A8ADB2]">
                    {item.title}
                  </span>
                </div>
                <StatusLed status={item.status} size="sm" label={item.statusLabel} />
              </div>

              {/* Main Readout Value */}
              <div className="flex items-baseline justify-between mb-3">
                <div className={cn('font-mono font-bold text-2xl sm:text-3xl tracking-tight', item.metricValueClass)}>
                  {item.value}
                </div>
                <span className="text-[10px] text-[#A8ADB2]/40 font-mono group-hover:text-[#7CFF00] transition-colors">
                  [TEL.RAW]
                </span>
              </div>

              {/* Progress / Stability Meter */}
              <div className="w-full bg-[#050606] h-1.5 border border-[#1B2123] overflow-hidden mb-2.5">
                <div
                  className={cn('h-full transition-all duration-500', item.meterColor)}
                  style={{ width: `${Math.min(item.meter, 100)}%` }}
                />
              </div>

              {/* Subtext and Technical Metadata */}
              <div className="flex items-center justify-between text-[9px] font-mono text-[#A8ADB2]/60 pt-1 border-t border-[#1B2123]/60">
                <span className="truncate">{item.subtext}</span>
                <span className="shrink-0 text-[#C9A227]/80">ID: {item.id.toUpperCase()}</span>
              </div>

              {/* Expanded detail toggle */}
              {isSelected && (
                <div className="mt-3 pt-2.5 border-t border-[#2A3337] text-xs text-[#A8ADB2] font-sans leading-relaxed bg-[#090B0B] p-2.5">
                  <div className="font-mono text-[9px] text-[#7CFF00] mb-1">DIAGNOSTIC TELEMETRY REPORT:</div>
                  <p>{item.detail}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
