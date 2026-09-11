import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Play, Pause, Filter, ShieldCheck, Download, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import StatusLed from './StatusLed';
import TacticalPanel from './TacticalPanel';

export default function SystemLogs() {
  const [logs, setLogs] = useState([
    { id: 1, time: '22:41:09', text: 'NETWORK NODE 07 // ONLINE', level: 'nominal' },
    { id: 2, time: '22:41:13', text: 'ATMOSPHERIC ANOMALY // DETECTED', level: 'warning' },
    { id: 3, time: '22:41:18', text: 'POWER GRID // 68% CAPACITY STABLE', level: 'nominal' },
    { id: 4, time: '22:41:22', text: 'NORTHERN SECTOR // SIGNAL LOST', level: 'critical' },
    { id: 5, time: '22:41:27', text: 'CRYOGENIC VAULT 04 // HERMETIC SEAL VERIFIED', level: 'nominal' },
    { id: 6, time: '22:41:31', text: 'RADAR AZIMUTH 145° // BOGEY CONVOY DETECTED', level: 'warning' },
    { id: 7, time: '22:41:35', text: 'SOLAR RADIATION FLUX // +14.2% OVER BASELINE', level: 'warning' },
    { id: 8, time: '22:41:40', text: 'WATER RECLAMATION REVERSE OSMOSIS // ACTIVE', level: 'nominal' },
    { id: 9, time: '22:41:45', text: 'EMERGENCY BROADCAST BEACON // TRANSMITTING', level: 'nominal' },
  ]);

  const [isPaused, setIsPaused] = useState(false);
  const [filterLevel, setFilterLevel] = useState('all');
  const scrollRef = useRef(null);

  // Incoming periodic simulated log generator
  useEffect(() => {
    if (isPaused) return;

    const mockEvents = [
      { text: 'SATELLITE DOWNLINK ORBITAL-V // TELEMETRY HANDSHAKE', level: 'nominal' },
      { text: 'GEOTHERMAL DRILL HEAD 02 // VIBRATION WARNING', level: 'warning' },
      { text: 'PERIMETER SENSOR FENCE SECTOR 03 // DISRUPTION', level: 'critical' },
      { text: 'AIR SCRUBBER FILTER CARTRIDGE // LIFE AT 41%', level: 'warning' },
      { text: 'AUTOMATED SURVIVAL CACHE 12 // BIOMETRIC VERIFIED', level: 'nominal' },
      { text: 'IONOSPHERIC DISTURBANCE // CARRIER FREQ DRIFT', level: 'warning' },
      { text: 'VAULT AIRLOCK INTERIOR PRESSURE // 101.3 kPa NOMINAL', level: 'nominal' },
    ];

    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 8);
      const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];

      setLogs((prev) => [
        ...prev.slice(-30), // keep latest 30 logs
        {
          id: Date.now(),
          time: timeStr,
          text: randomEvent.text,
          level: randomEvent.level,
        },
      ]);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Auto-scroll to bottom of logs
  useEffect(() => {
    if (!isPaused && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isPaused]);

  const filteredLogs = logs.filter((log) => {
    if (filterLevel === 'all') return true;
    return log.level === filterLevel;
  });

  const levelColor = {
    nominal: 'text-[#7CFF00]',
    warning: 'text-[#C9A227]',
    critical: 'text-[#D32F2F]',
  };

  const levelBadge = {
    nominal: 'bg-[#7CFF00]/10 text-[#7CFF00] border-[#7CFF00]/40',
    warning: 'bg-[#C9A227]/10 text-[#C9A227] border-[#C9A227]/40',
    critical: 'bg-[#D32F2F]/15 text-[#D32F2F] border-[#D32F2F]/50',
  };

  return (
    <TacticalPanel
      title="SYSTEM CONSOLE LOGS"
      subtitle="KERNEL FEED // REAL-TIME MACHINE TELEMETRY"
      tag="STREAM: ACTIVE"
      status="operational"
      statusLabel="NOMINAL"
      action={
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className={cn(
              'px-2 py-1 border flex items-center gap-1 transition-colors cursor-pointer',
              isPaused
                ? 'bg-[#C9A227]/10 border-[#C9A227] text-[#C9A227]'
                : 'bg-[#050606] border-[#1B2123] text-[#A8ADB2] hover:border-[#2C353A]'
            )}
            title={isPaused ? 'Resume stream' : 'Pause stream'}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            <span className="hidden sm:inline">{isPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>
        </div>
      }
    >
      {/* Log Controls Filter Bar */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-[#1B2123] gap-2 font-mono text-[10px]">
        <div className="flex items-center gap-1">
          <Filter className="w-3 h-3 text-[#A8ADB2]/60 mr-1" />
          <span className="text-[#A8ADB2]/50 uppercase">FILTER:</span>
          {['all', 'nominal', 'warning', 'critical'].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setFilterLevel(lvl)}
              className={cn(
                'px-2 py-0.5 uppercase border transition-all cursor-pointer',
                filterLevel === lvl
                  ? 'bg-[#7CFF00]/10 border-[#7CFF00] text-[#7CFF00] font-bold'
                  : 'border-[#1B2123] text-[#A8ADB2]/60 hover:text-[#EDEFF1] bg-[#050606]'
              )}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="text-[9px] text-[#A8ADB2]/50">
          LOG ENTRIES: {filteredLogs.length} // BUFFER SIZE: 30
        </div>
      </div>

      {/* Terminal Log Output Window */}
      <div
        ref={scrollRef}
        className="h-64 sm:h-72 overflow-y-auto bg-[#050606] border border-[#1B2123] p-3 font-mono text-xs space-y-1.5 select-text scrollbar-thin"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-[#A8ADB2]/40 text-center py-8">NO LOGS MATCH CURRENT FILTER LEVEL</div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2.5 py-0.5 hover:bg-[#101313] transition-colors leading-relaxed"
            >
              <span className="text-[#A8ADB2]/50 shrink-0 select-none">[{log.time}]</span>
              <span
                className={cn(
                  'text-[9px] px-1 py-0.2 border shrink-0 uppercase tracking-wider',
                  levelBadge[log.level] || levelBadge.nominal
                )}
              >
                {log.level}
              </span>
              <span className={cn('break-all font-medium', levelColor[log.level] || levelColor.nominal)}>
                {log.text}
              </span>
            </div>
          ))
        )}

        {/* Blinking Cursor Prompt */}
        {!isPaused && (
          <div className="flex items-center gap-2 text-[#7CFF00] pt-1">
            <span className="text-[#A8ADB2]/50">&gt;&gt;</span>
            <span className="inline-block w-2 h-3.5 bg-[#7CFF00] animate-pulse" />
          </div>
        )}
      </div>

      {/* Footer System Line */}
      <div className="mt-3 flex items-center justify-between font-mono text-[9px] text-[#A8ADB2]/60">
        <div>CHANNEL: SYS_DAEMON_PIPE_0</div>
        <div>CHECKSUM: OK [0x8FA4]</div>
      </div>
    </TacticalPanel>
  );
}
