import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Shield, ChevronRight, Lock, Key, Download, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';
import StatusLed from './StatusLed';
import TacticalPanel from './TacticalPanel';
import TacticalButton from './TacticalButton';

export default function SurvivalArchive() {
  const [selectedProtocol, setSelectedProtocol] = useState(0);

  const protocols = [
    {
      id: 'P-01',
      title: 'PROTOCOL 01 // SUBTERRANEAN SHELTER LOCKDOWN',
      classification: 'RESTRICTED',
      clearance: 'LVL 3',
      date: 'DAY 00 // ZERO-HOUR',
      status: 'operational',
      summary:
        'Immediate hermetic isolation of all hardened underground command centers and civil survival pods. External blast doors engage 3-point hydraulic dogging. Ventilation shifts to closed-loop chemical filtration.',
      directives: [
        'Engage hydraulic bulkheads on sectors 1 through 9',
        'Verify zero positive pressure atmospheric bypass',
        'Initialize primary geothermal turbine coupling',
        'Arm perimeter seismic motion arrays',
      ],
    },
    {
      id: 'P-08',
      title: 'PROTOCOL 08 // ATMOSPHERIC DECONTAMINATION',
      classification: 'CLASSIFIED',
      clearance: 'LVL 4',
      date: 'DAY 03 // FALLOUT PHASE',
      status: 'warning',
      summary:
        'Continuous cyclical scrubbing of radioactive ash, aerosolized lead, and biological agents. Electrostatic precipitators require mechanical backwash every 36 hours.',
      directives: [
        'Route air intake through multi-stage HEPA-Rad activated charcoal',
        'Monitor particulate counter at intake manifold B',
        'Quarantine outer airlock chambers following surface excursions',
      ],
    },
    {
      id: 'P-14',
      title: 'PROTOCOL 14 // EMERGENCY RATIONING & SYNTHESIS',
      classification: 'OFFICIAL USE',
      clearance: 'LVL 2',
      date: 'DAY 12 // SUSTENANCE',
      status: 'operational',
      summary:
        'Automated caloric distribution. Standard daily allotment fixed at 2,200 kcal with balanced electrolyte enrichment. Hydration synthesis capped at 2.4 liters per registered biometric badge.',
      directives: [
        'Calibrate algae bioreactor nutrient injections',
        'Scan citizen RFID passes at synthesis distribution kiosks',
        'Maintain reserve grain vault temperature at -4°C',
      ],
    },
    {
      id: 'P-26',
      title: 'PROTOCOL 26 // VECTORS CORE RECONSTRUCTION',
      classification: 'COSMIC TOP SECRET',
      clearance: 'LVL 5',
      date: 'DAY 30 // REBIRTH',
      status: 'operational',
      summary:
        'The master protocol governing festival and technical survival operations. Integrates high-performance computing, combat robotics, encrypted communication networks, and global human potential.',
      directives: [
        'Link decentralized developer terminals across global survival nodes',
        'Host 24-hour technical hackathon sprints to rebuild infrastructure',
        'Deploy autonomous combat rovers for surface hazard mapping',
        'Broadcast public access keys for new survivor registration',
      ],
    },
  ];

  const current = protocols[selectedProtocol];

  return (
    <section id="survival" className="py-12 sm:py-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#1B2123] gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] text-[#7CFF00] tracking-widest">
              [ SEC.04 // SURVIVAL PROTOCOL ARCHIVES ]
            </span>
            <span className="w-1.5 h-1.5 bg-[#C9A227] rounded-full led-pulse-gold" />
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#EDEFF1]">
            DECLASSIFIED SURVIVAL ARCHIVE
          </h2>
        </div>

        <div className="font-mono text-[10px] text-[#A8ADB2]/60 tracking-wider">
          CLASSIFICATION: MIL-SPEC DOOMSDAY DIRECTIVES
        </div>
      </div>

      {/* Grid: Protocols List + Protocol Document Viewer */}
      <div id="archive" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: List of Protocols */}
        <div className="lg:col-span-5 space-y-2">
          {protocols.map((p, idx) => {
            const isSelected = selectedProtocol === idx;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProtocol(idx)}
                className={cn(
                  'w-full text-left p-3.5 sm:p-4 border transition-all cursor-pointer relative group flex items-start justify-between gap-3',
                  isSelected
                    ? 'bg-[#101313] border-[#7CFF00] shadow-[0_0_15px_rgba(124,255,0,0.1)]'
                    : 'bg-[#050606] border-[#1B2123] hover:border-[#2C353A] hover:bg-[#090B0B]'
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 font-mono text-[9px] mb-1">
                    <span className={isSelected ? 'text-[#7CFF00]' : 'text-[#C9A227]'}>
                      [{p.id}]
                    </span>
                    <span className="text-[#A8ADB2]/60">{p.clearance}</span>
                    <span className="text-[#A8ADB2]/40">|</span>
                    <span className="text-[#A8ADB2]/60 truncate">{p.date}</span>
                  </div>

                  <div className="font-display font-bold text-xs uppercase tracking-wide text-[#EDEFF1] truncate">
                    {p.title.split('//')[1] || p.title}
                  </div>
                </div>

                <StatusLed status={p.status} size="sm" />
              </button>
            );
          })}

          {/* Quick Registration & Festival Gateway Action Card */}
          <div className="p-4 bg-[#101313] border border-[#2A3337] mt-4">
            <div className="flex items-center gap-2 mb-1.5 font-mono text-[10px] text-[#C9A227]">
              <Key className="w-3.5 h-3.5" />
              <span>SURVIVOR CREDENTIAL REGISTRATION</span>
            </div>
            <p className="text-xs text-[#A8ADB2] mb-3 leading-relaxed">
              New survivor personnel can claim official digital access passes to VECTORS 26-27 events and security zones.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                to="/entry-registration"
                className="flex-1 text-center px-3 py-2 bg-[#7CFF00] text-[#050606] font-display font-semibold text-xs tracking-wider uppercase border border-[#7CFF00] hover:bg-[#8eff1a] transition-all"
              >
                CLAIM SURVIVAL PASS
              </Link>
              <Link
                to="/events"
                className="flex-1 text-center px-3 py-2 bg-[#050606] text-[#A8ADB2] hover:text-white font-display text-xs tracking-wider uppercase border border-[#1B2123] hover:border-[#A8ADB2] transition-all"
              >
                VIEW EVENTS
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Protocol Dossier Detail */}
        <div className="lg:col-span-7 bg-[#101313] border border-[#1B2123] p-5 sm:p-6 flex flex-col justify-between">
          <div>
            {/* Header metadata */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1B2123]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#7CFF00]" />
                <span className="font-mono text-xs font-bold text-[#EDEFF1] tracking-widest">
                  {current.id} // DIRECTIVE DOSSIER
                </span>
              </div>
              <span className="font-mono text-[9px] px-2 py-0.5 border border-[#C9A227]/40 text-[#C9A227] bg-[#C9A227]/10 tracking-widest">
                {current.classification}
              </span>
            </div>

            {/* Protocol Title */}
            <h3 className="font-display font-bold text-base sm:text-lg text-[#EDEFF1] uppercase tracking-wide mb-3">
              {current.title}
            </h3>

            {/* Summary narrative */}
            <p className="text-xs sm:text-sm text-[#A8ADB2] font-sans leading-relaxed mb-5 bg-[#090B0B] p-3.5 border border-[#1B2123]">
              {current.summary}
            </p>

            {/* Mandatory Tactical Directives */}
            <div>
              <div className="font-mono text-[10px] text-[#7CFF00] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>MANDATORY OPERATIONAL DIRECTIVES:</span>
              </div>
              <ul className="space-y-2 font-mono text-xs text-[#EDEFF1]">
                {current.directives.map((dir, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-[#050606] p-2 border border-[#1B2123]">
                    <span className="text-[#7CFF00] font-bold">[{idx + 1}]</span>
                    <span>{dir}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Dossier footer */}
          <div className="mt-6 pt-4 border-t border-[#1B2123] flex items-center justify-between font-mono text-[9px] text-[#A8ADB2]/60">
            <div>CLEARANCE LEVEL: {current.clearance}</div>
            <div>VERIFIED BY: VECTOR COMMAND HIGH COUNCIL</div>
          </div>
        </div>
      </div>
    </section>
  );
}
