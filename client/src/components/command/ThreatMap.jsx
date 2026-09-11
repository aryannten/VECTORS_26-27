import React, { useState } from 'react';
import { MapPin, ShieldAlert, Globe, Radio, Eye, Layers, Compass } from 'lucide-react';
import { cn } from '../../lib/utils';
import StatusLed from './StatusLed';
import TacticalPanel from './TacticalPanel';

export default function ThreatMap() {
  const [activeSector, setActiveSector] = useState('sector-01');

  const sectors = [
    {
      id: 'sector-01',
      name: 'SECTOR 01 // EURASIAN HIGHLANDS',
      code: 'EUR-01',
      coords: "55°45'N // 37°37'E",
      threatTier: 'OMEGA',
      threatLevel: 94,
      status: 'critical',
      survivorDensity: '1.2M SURVIVORS',
      radiationLevel: '480 mSv/hr',
      description:
        'Massive atmospheric fallout zone. Ground telemetry suggests subterranean vault systems in the Ural range are sealed and generating power.',
      pos: { x: 58, y: 32 },
    },
    {
      id: 'sector-02',
      name: 'SECTOR 02 // PACIFIC TRENCH RIM',
      code: 'PAC-02',
      coords: "35°41'N // 139°41'E",
      threatTier: 'DELTA',
      threatLevel: 78,
      status: 'warning',
      survivorDensity: '3.4M SURVIVORS',
      radiationLevel: '120 mSv/hr',
      description:
        'Seismic fracture zone active. Offshore thermal generators operating at reduced efficiency. Autonomous communication buoys deployed.',
      pos: { x: 82, y: 44 },
    },
    {
      id: 'sector-03',
      name: 'SECTOR 03 // NORTH AMERICAN CORE',
      code: 'NAC-03',
      coords: "39°44'N // 104°59'W",
      threatTier: 'GAMMA',
      threatLevel: 62,
      status: 'warning',
      survivorDensity: '2.1M SURVIVORS',
      radiationLevel: '45 mSv/hr',
      description:
        'Rocky Mountain redoubt sector. Severe grid collapse along eastern seaboard; continental broadcast repeater holding signal.',
      pos: { x: 24, y: 38 },
    },
    {
      id: 'sector-04',
      name: 'SECTOR 04 // ATLANTIC SEED VAULT',
      code: 'ATV-04',
      coords: "78°14'N // 15°29'E",
      threatTier: 'BETA',
      threatLevel: 18,
      status: 'operational',
      survivorDensity: '380K SURVIVORS',
      radiationLevel: '4 mSv/hr',
      description:
        'Deep permafrost seed crypt. Fully autonomous solar & geothermal backup online. Cryogenic gene banks 99.4% viable.',
      pos: { x: 52, y: 16 },
    },
    {
      id: 'sector-05',
      name: 'SECTOR 05 // SOUTHERN CRADLE',
      code: 'SOC-05',
      coords: "33°51'S // 151°12'E",
      threatTier: 'EPSILON',
      threatLevel: 42,
      status: 'standby',
      survivorDensity: '1.3M SURVIVORS',
      radiationLevel: '18 mSv/hr',
      description:
        'Southern oceanic shelter perimeter. Low ambient fallout, but solar arrays compromised by high atmospheric particulate clouds.',
      pos: { x: 88, y: 78 },
    },
  ];

  const currentSector = sectors.find((s) => s.id === activeSector) || sectors[0];

  return (
    <section id="threat-map" className="py-12 sm:py-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#1B2123] gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] text-[#7CFF00] tracking-widest">
              [ SEC.02 // GLOBAL THREAT TOPOGRAPHY ]
            </span>
            <span className="w-1.5 h-1.5 bg-[#C9A227] rounded-full led-pulse-gold" />
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#EDEFF1]">
            WORLD THREAT MAP
          </h2>
        </div>

        <div className="flex items-center gap-4 text-[10px] font-mono text-[#A8ADB2]/70">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D32F2F]" />
            OMEGA (CRITICAL)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
            DELTA (WARNING)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7CFF00]" />
            BETA (OPERATIONAL)
          </span>
        </div>
      </div>

      {/* Map + Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Interactive Tactical Map SVG Projection */}
        <div className="lg:col-span-8 bg-[#090B0B] border border-[#1B2123] p-4 sm:p-6 relative min-h-[380px] sm:min-h-[460px] flex flex-col justify-between overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 pointer-events-none tactical-grid opacity-30" />
          {/* Horizontal Scanline */}
          <div className="absolute inset-0 pointer-events-none tactical-scanlines opacity-25" />

          {/* Top Map Coordinates Bar */}
          <div className="relative z-10 flex items-center justify-between text-[9px] font-mono text-[#A8ADB2]/60 pb-2 border-b border-[#1B2123]/60">
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#7CFF00]" />
              <span>PROJECTION: MERCATOR TACTICAL 26</span>
            </div>
            <div>COORDINATES: {currentSector.coords}</div>
          </div>

          {/* Map Visual Area with Stylized World Continents SVG */}
          <div className="relative z-10 w-full flex-1 my-4 flex items-center justify-center">
            <div className="relative w-full h-full max-w-2xl aspect-[2/1]">
              {/* Stylized Vector World Continents */}
              <svg
                viewBox="0 0 1000 500"
                className="w-full h-full opacity-60 filter drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Latitude & Longitude Coordinate Lines */}
                <g stroke="#1B2123" strokeWidth="1" strokeDasharray="3 3">
                  <line x1="0" y1="125" x2="1000" y2="125" />
                  <line x1="0" y1="250" x2="1000" y2="250" />
                  <line x1="0" y1="375" x2="1000" y2="375" />
                  <line x1="250" y1="0" x2="250" y2="500" />
                  <line x1="500" y1="0" x2="500" y2="500" />
                  <line x1="750" y1="0" x2="750" y2="500" />
                </g>

                {/* North America */}
                <path
                  d="M160,80 L230,85 L280,120 L270,160 L240,190 L210,210 L190,260 L160,250 L120,180 L110,130 Z"
                  fill="#151A1C"
                  stroke="#2C353A"
                  strokeWidth="1.5"
                />
                {/* Greenland */}
                <path
                  d="M380,40 L450,50 L430,100 L370,90 Z"
                  fill="#151A1C"
                  stroke="#2C353A"
                  strokeWidth="1.5"
                />
                {/* South America */}
                <path
                  d="M240,280 L310,290 L340,350 L310,430 L270,450 L240,380 Z"
                  fill="#151A1C"
                  stroke="#2C353A"
                  strokeWidth="1.5"
                />
                {/* Europe */}
                <path
                  d="M480,90 L560,95 L580,140 L530,180 L480,160 L460,110 Z"
                  fill="#151A1C"
                  stroke="#2C353A"
                  strokeWidth="1.5"
                />
                {/* Africa */}
                <path
                  d="M470,190 L550,190 L580,260 L570,350 L510,380 L460,280 Z"
                  fill="#151A1C"
                  stroke="#2C353A"
                  strokeWidth="1.5"
                />
                {/* Asia / Eurasia */}
                <path
                  d="M580,85 L820,95 L880,160 L830,230 L740,270 L650,220 L580,150 Z"
                  fill="#151A1C"
                  stroke="#2C353A"
                  strokeWidth="1.5"
                />
                {/* Australia */}
                <path
                  d="M780,330 L870,340 L880,410 L810,430 L770,380 Z"
                  fill="#151A1C"
                  stroke="#2C353A"
                  strokeWidth="1.5"
                />
              </svg>

              {/* Glowing Interactive Sector Pins */}
              {sectors.map((sec) => {
                const isCurrent = sec.id === activeSector;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setActiveSector(sec.id)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                    style={{ left: `${sec.pos.x}%`, top: `${sec.pos.y}%` }}
                    title={sec.name}
                  >
                    {/* Ping Waves */}
                    <span
                      className={cn(
                        'absolute -inset-2 rounded-full animate-ping opacity-60',
                        sec.status === 'critical'
                          ? 'bg-[#D32F2F]'
                          : sec.status === 'warning'
                          ? 'bg-[#C9A227]'
                          : 'bg-[#7CFF00]'
                      )}
                    />

                    {/* Outer Target Box */}
                    <span
                      className={cn(
                        'relative flex items-center justify-center w-5 h-5 border transition-all duration-200',
                        isCurrent
                          ? 'border-white bg-[#050606] shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-110'
                          : 'border-[#2C353A] bg-[#050606]/90 hover:border-[#A8ADB2]'
                      )}
                    >
                      <span
                        className={cn(
                          'w-2 h-2 rounded-full',
                          sec.status === 'critical'
                            ? 'bg-[#D32F2F] shadow-[0_0_6px_#D32F2F]'
                            : sec.status === 'warning'
                            ? 'bg-[#C9A227] shadow-[0_0_6px_#C9A227]'
                            : 'bg-[#7CFF00] shadow-[0_0_6px_#7CFF00]'
                        )}
                      />
                    </span>

                    {/* Sector Code Badge */}
                    <span
                      className={cn(
                        'absolute left-6 top-0 font-mono text-[8px] tracking-wider px-1 py-0.5 border whitespace-nowrap transition-opacity',
                        isCurrent
                          ? 'border-[#7CFF00] text-[#7CFF00] bg-[#050606]'
                          : 'border-[#1B2123] text-[#A8ADB2]/70 bg-[#090B0B]'
                      )}
                    >
                      {sec.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Map Footer Information */}
          <div className="relative z-10 flex items-center justify-between text-[9px] font-mono text-[#A8ADB2]/60 pt-2 border-t border-[#1B2123]/60">
            <div>SATELLITE DOWNLINK: ORBITAL-V</div>
            <div className="text-[#7CFF00]">ACTIVE THREAT ZONES: 5 SECTORS</div>
          </div>
        </div>

        {/* Sector Telemetry Readout Panel */}
        <div className="lg:col-span-4 bg-[#101313] border border-[#1B2123] p-5 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1B2123]">
              <div>
                <span className="font-mono text-[9px] text-[#A8ADB2]/60 uppercase tracking-widest">
                  SECTOR DOSSIER
                </span>
                <h3 className="font-display font-bold text-sm text-[#EDEFF1] uppercase tracking-wider">
                  {currentSector.code}
                </h3>
              </div>
              <StatusLed status={currentSector.status} size="sm" label={currentSector.threatTier} />
            </div>

            {/* Sector Full Name */}
            <div className="text-xs font-mono font-semibold text-[#7CFF00] mb-3">
              {currentSector.name}
            </div>

            {/* Threat Meter */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#A8ADB2] mb-1">
                <span>SECTOR THREAT INDEX:</span>
                <span className="text-[#C9A227] font-bold">{currentSector.threatLevel}%</span>
              </div>
              <div className="w-full bg-[#050606] h-1.5 border border-[#1B2123]">
                <div
                  className={cn(
                    'h-full transition-all duration-500',
                    currentSector.status === 'critical'
                      ? 'bg-[#D32F2F]'
                      : currentSector.status === 'warning'
                      ? 'bg-[#C9A227]'
                      : 'bg-[#7CFF00]'
                  )}
                  style={{ width: `${currentSector.threatLevel}%` }}
                />
              </div>
            </div>

            {/* Sector Telemetry Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4 font-mono text-xs">
              <div className="p-2 bg-[#090B0B] border border-[#1B2123]">
                <div className="text-[8px] text-[#A8ADB2]/60 uppercase tracking-wider">POPULATION</div>
                <div className="text-[#EDEFF1] font-bold mt-0.5">{currentSector.survivorDensity}</div>
              </div>

              <div className="p-2 bg-[#090B0B] border border-[#1B2123]">
                <div className="text-[8px] text-[#A8ADB2]/60 uppercase tracking-wider">RADIATION</div>
                <div className="text-[#C9A227] font-bold mt-0.5">{currentSector.radiationLevel}</div>
              </div>
            </div>

            {/* Sector Narrative Summary */}
            <div className="p-3 bg-[#090B0B] border border-[#1B2123] text-xs font-sans text-[#A8ADB2] leading-relaxed">
              <div className="font-mono text-[9px] text-[#7CFF00] uppercase mb-1">
                AUTOMATED BRIEFING // PROTOCOL 26:
              </div>
              <p>{currentSector.description}</p>
            </div>
          </div>

          {/* Sector Switcher Tabs */}
          <div className="mt-5 pt-3 border-t border-[#1B2123]">
            <div className="font-mono text-[9px] text-[#A8ADB2]/50 uppercase mb-2">
              SWITCH SECTOR VIEW
            </div>
            <div className="grid grid-cols-5 gap-1 font-mono text-[10px]">
              {sectors.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSector(sec.id)}
                  className={cn(
                    'py-1 text-center border transition-all cursor-pointer font-bold',
                    activeSector === sec.id
                      ? 'bg-[#7CFF00]/10 border-[#7CFF00] text-[#7CFF00]'
                      : 'bg-[#050606] border-[#1B2123] text-[#A8ADB2] hover:border-[#2C353A]'
                  )}
                >
                  {sec.code.split('-')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
