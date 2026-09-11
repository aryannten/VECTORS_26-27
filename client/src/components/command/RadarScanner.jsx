import React, { useState, useEffect } from 'react';
import { Radio, Crosshair, ZoomIn, ZoomOut, AlertCircle, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';
import StatusLed from './StatusLed';
import TacticalPanel from './TacticalPanel';

export default function RadarScanner() {
  const [rangeKm, setRangeKm] = useState(50);
  const [selectedBlip, setSelectedBlip] = useState(null);
  const [sweepAngle, setSweepAngle] = useState(0);

  // Targets tracked on radar
  const targets = [
    {
      id: 'TGT-01',
      type: 'hostile',
      name: 'ATMOSPHERIC ANOMALY',
      azimuth: 42,
      distanceRatio: 0.72,
      dangerLevel: 'HIGH',
      coordinates: "48°14'N // 16°20'E",
      elevation: '+3,400m',
      status: 'critical',
    },
    {
      id: 'TGT-02',
      type: 'friendly',
      name: 'CONVOY DELTA-09',
      azimuth: 145,
      distanceRatio: 0.45,
      dangerLevel: 'SECURE',
      coordinates: "47°58'N // 16°45'E",
      elevation: '+120m',
      status: 'operational',
    },
    {
      id: 'TGT-03',
      type: 'neutral',
      name: 'AUTOMATED WEATHER BUOY',
      azimuth: 220,
      distanceRatio: 0.85,
      dangerLevel: 'LOW',
      coordinates: "47°30'N // 15°50'E",
      elevation: '+45m',
      status: 'standby',
    },
    {
      id: 'TGT-04',
      type: 'warning',
      name: 'POWER NODE FAILURE',
      azimuth: 310,
      distanceRatio: 0.32,
      dangerLevel: 'ELEVATED',
      coordinates: "48°22'N // 16°08'E",
      elevation: 'GROUND',
      status: 'warning',
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-stretch">
      {/* Radar Visual Display Container */}
      <div className="flex-1 bg-[#090B0B] border border-[#1B2123] p-6 sm:p-8 flex flex-col items-center justify-center relative min-h-[380px] sm:min-h-[440px] overflow-hidden">
        {/* Background coordinate grid */}
        <div className="absolute inset-0 pointer-events-none tactical-grid opacity-20" />

        {/* Outer Circular Scope Frame */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full border border-[#7CFF00]/25 bg-[#050606] shadow-[inset_0_0_40px_rgba(0,0,0,0.9),0_0_30px_rgba(124,255,0,0.03)] flex items-center justify-center">
          
          {/* Concentric Range Rings */}
          <div className="absolute inset-4 sm:inset-6 rounded-full border border-[#7CFF00]/15" />
          <div className="absolute inset-12 sm:inset-16 rounded-full border border-[#7CFF00]/15" />
          <div className="absolute inset-20 sm:inset-28 rounded-full border border-[#7CFF00]/15" />
          <div className="absolute w-2 h-2 rounded-full bg-[#7CFF00]/60 shadow-[0_0_8px_#7CFF00]" />

          {/* Crosshair Cardinal Axes */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-[1px] bg-[#7CFF00]/20" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-full w-[1px] bg-[#7CFF00]/20" />
          </div>

          {/* Degree Markings on Circumference */}
          <span className="absolute top-1 text-[8px] font-mono text-[#7CFF00]/60">000°</span>
          <span className="absolute right-1 text-[8px] font-mono text-[#7CFF00]/60">090°</span>
          <span className="absolute bottom-1 text-[8px] font-mono text-[#7CFF00]/60">180°</span>
          <span className="absolute left-1 text-[8px] font-mono text-[#7CFF00]/60">270°</span>

          {/* Rotating Radar Sweep Beam */}
          <div className="absolute inset-0 pointer-events-none radar-sweep-beam rounded-full">
            <div 
              className="w-1/2 h-1/2 origin-bottom-right"
              style={{
                background: 'conic-gradient(from 180deg at 100% 100%, transparent 280deg, rgba(124, 255, 0, 0.02) 320deg, rgba(124, 255, 0, 0.25) 360deg)',
                borderRight: '1.5px solid #7CFF00',
                filter: 'drop-shadow(0 0 6px #7CFF00)',
              }}
            />
          </div>

          {/* Tracked Target Blips */}
          {targets.map((tgt) => {
            // Calculate polar coordinates
            const rad = ((tgt.azimuth - 90) * Math.PI) / 180;
            // Max radius in percentage from center
            const radiusPercent = tgt.distanceRatio * 44; 
            const x = 50 + radiusPercent * Math.cos(rad);
            const y = 50 + radiusPercent * Math.sin(rad);

            const isSelected = selectedBlip?.id === tgt.id;

            return (
              <button
                key={tgt.id}
                type="button"
                onClick={() => setSelectedBlip(tgt)}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer focus:outline-none"
                style={{ left: `${x}%`, top: `${y}%` }}
                title={`${tgt.name} (${tgt.id})`}
              >
                {/* Outer Ping Ripple */}
                <span
                  className={cn(
                    'absolute -inset-1 rounded-full animate-ping opacity-60',
                    tgt.status === 'critical' ? 'bg-[#D32F2F]' : tgt.status === 'warning' ? 'bg-[#C9A227]' : 'bg-[#7CFF00]'
                  )}
                />

                {/* Core Blip Dot */}
                <span
                  className={cn(
                    'relative block w-2 h-2 rounded-full border shadow-md',
                    isSelected ? 'ring-2 ring-white scale-125' : '',
                    tgt.status === 'critical'
                      ? 'bg-[#D32F2F] border-white shadow-[0_0_8px_#D32F2F]'
                      : tgt.status === 'warning'
                      ? 'bg-[#C9A227] border-white shadow-[0_0_8px_#C9A227]'
                      : 'bg-[#7CFF00] border-white shadow-[0_0_8px_#7CFF00]'
                  )}
                />

                {/* Target Label Tag */}
                <span className="absolute left-3 top-[-6px] font-mono text-[8px] tracking-wider text-[#A8ADB2] bg-[#050606]/90 px-1 border border-[#1B2123] whitespace-nowrap opacity-75 group-hover:opacity-100 transition-opacity">
                  {tgt.id}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scope Bottom Telemetry bar */}
        <div className="mt-4 flex items-center justify-between w-full max-w-sm font-mono text-[9px] text-[#A8ADB2]/70">
          <div>SWEEP: 4.0 SEC/ROT</div>
          <div className="text-[#7CFF00]">TRACKING: 4 TARGETS</div>
          <div>RANGE: {rangeKm} KM</div>
        </div>
      </div>

      {/* Target Telemetry & Controls Sidebar */}
      <div className="w-full lg:w-80 flex flex-col justify-between bg-[#101313] border border-[#1B2123] p-4 sm:p-5">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1B2123]">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-[#7CFF00]" />
              <span className="font-display font-bold text-xs uppercase tracking-widest text-[#EDEFF1]">
                RADAR TELEMETRY
              </span>
            </div>
            <StatusLed status="operational" size="sm" label="ONLINE" />
          </div>

          {/* Range Selection Controls */}
          <div className="mb-5">
            <div className="font-mono text-[9px] text-[#A8ADB2]/70 uppercase tracking-widest mb-2">
              RADAR RANGE RADIUS
            </div>
            <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
              {[25, 50, 100].map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => setRangeKm(km)}
                  className={cn(
                    'py-1.5 px-2 text-center border transition-all cursor-pointer font-bold',
                    rangeKm === km
                      ? 'bg-[#7CFF00]/10 border-[#7CFF00] text-[#7CFF00]'
                      : 'bg-[#050606] border-[#1B2123] text-[#A8ADB2] hover:border-[#2C353A]'
                  )}
                >
                  {km} KM
                </button>
              ))}
            </div>
          </div>

          {/* Selected Target Dossier */}
          <div>
            <div className="font-mono text-[9px] text-[#A8ADB2]/70 uppercase tracking-widest mb-2">
              TARGET INTERCEPT DOSSIER
            </div>

            {selectedBlip ? (
              <div className="p-3 bg-[#090B0B] border border-[#2A3337] space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#1B2123]">
                  <span className="text-[#EDEFF1] font-bold">{selectedBlip.id}</span>
                  <StatusLed status={selectedBlip.status} size="sm" label={selectedBlip.dangerLevel} />
                </div>
                <div className="text-[11px] text-[#7CFF00] font-semibold">{selectedBlip.name}</div>
                <div className="text-[10px] text-[#A8ADB2] space-y-1 pt-1">
                  <div>COORDS: {selectedBlip.coordinates}</div>
                  <div>AZIMUTH: {selectedBlip.azimuth}°</div>
                  <div>RANGE: {Math.round(selectedBlip.distanceRatio * rangeKm)} KM</div>
                  <div>ALTITUDE: {selectedBlip.elevation}</div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#090B0B] border border-[#1B2123] text-center font-mono text-[10px] text-[#A8ADB2]/50">
                SELECT A BLIP ON RADAR SCOPE TO ENGAGE TRACKING TELEMETRY
              </div>
            )}
          </div>
        </div>

        {/* Quick Target List */}
        <div className="mt-4 pt-3 border-t border-[#1B2123]">
          <div className="font-mono text-[9px] text-[#A8ADB2]/50 mb-2">ACTIVE SENSOR BLIPS</div>
          <div className="space-y-1">
            {targets.map((tgt) => (
              <button
                key={tgt.id}
                type="button"
                onClick={() => setSelectedBlip(tgt)}
                className={cn(
                  'w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-mono border text-left transition-colors cursor-pointer',
                  selectedBlip?.id === tgt.id
                    ? 'border-[#7CFF00]/60 bg-[#050606] text-[#7CFF00]'
                    : 'border-transparent hover:border-[#1B2123] text-[#A8ADB2]'
                )}
              >
                <span>{tgt.id} // {tgt.name.slice(0, 16)}</span>
                <span className={tgt.status === 'critical' ? 'text-[#D32F2F]' : tgt.status === 'warning' ? 'text-[#C9A227]' : 'text-[#7CFF00]'}>
                  [{tgt.dangerLevel}]
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
