import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Radio, Terminal, AlertTriangle, ArrowUp } from 'lucide-react';
import CommandNav from '../components/command/CommandNav';
import CommandHero from '../components/command/CommandHero';
import TelemetryGrid from '../components/command/TelemetryGrid';
import RadarScanner from '../components/command/RadarScanner';
import ThreatMap from '../components/command/ThreatMap';
import SystemLogs from '../components/command/SystemLogs';
import LastTransmission from '../components/command/LastTransmission';
import EmergencyBroadcast from '../components/command/EmergencyBroadcast';
import ResourceStability from '../components/command/ResourceStability';
import SurvivalArchive from '../components/command/SurvivalArchive';
import { tacticalAudio } from '../components/command/AudioSynthesizer';

export default function DoomsdayCommandCenter() {
  const [activeSection, setActiveSection] = useState('system');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Monitor scroll for back to top button and active section tracking
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      // Section intersection detection
      const sections = ['system', 'threat-map', 'resources', 'survival', 'archive'];
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(s);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEnterSystem = () => {
    const systemEl = document.getElementById('system');
    if (systemEl) {
      systemEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewThreatMap = () => {
    const mapEl = document.getElementById('threat-map');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    tacticalAudio.playClick(900);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050606] text-[#EDEFF1] relative overflow-x-hidden selection:bg-[#7CFF00] selection:text-[#050606]">
      {/* Background Blueprint Grid Texture */}
      <div className="fixed inset-0 pointer-events-none tactical-grid opacity-25 z-0" />

      {/* Atmospheric Subtle Radial Green Glow Behind Console */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 50% 10%, rgba(124, 255, 0, 0.035) 0%, transparent 60%)'
        }}
      />

      {/* Persistent Scanlines Overlay */}
      <div className="fixed inset-0 pointer-events-none tactical-scanlines opacity-15 z-0" />

      {/* Top Tactical Command Navigation */}
      <CommandNav
        activeSection={activeSection}
        onSelectSection={setActiveSection}
      />

      {/* Main Command Center Surfaces */}
      <main className="relative z-10">
        {/* 1. Cinematic Hero Section */}
        <CommandHero
          onEnterSystem={handleEnterSystem}
          onViewThreatMap={handleViewThreatMap}
        />

        {/* 2. Command Center Telemetry Cards (Live Threat, Survivors, Temp, Air, Reserves, Power) */}
        <TelemetryGrid />

        {/* 3. Radar Scanner & Tactical Operations Hub */}
        <section className="py-8 sm:py-12 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-[#1B2123] gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] text-[#7CFF00] tracking-widest">
                  [ SENSOR SUITE // ACTIVE SWEEP ]
                </span>
                <span className="w-1.5 h-1.5 bg-[#7CFF00] rounded-full led-pulse-green" />
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#EDEFF1]">
                RADAR RECONNAISSANCE & SENSORS
              </h2>
            </div>
            <div className="font-mono text-[10px] text-[#A8ADB2]/60 tracking-wider">
              FREQUENCY: 3.4 GHz S-BAND // PHASED ARRAY
            </div>
          </div>

          <RadarScanner />
        </section>

        {/* 4. World Threat Map Section */}
        <ThreatMap />

        {/* 5. Comms & Intercepts: Emergency Broadcast & Last Transmission */}
        <section className="py-8 sm:py-12 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-[#1B2123] gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] text-[#C9A227] tracking-widest">
                  [ COMMS ARRAY // UPLINK & INTERCEPT ]
                </span>
                <span className="w-1.5 h-1.5 bg-[#C9A227] rounded-full led-pulse-gold" />
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#EDEFF1]">
                EMERGENCY COMMUNICATIONS & INTERCEPTS
              </h2>
            </div>
            <div className="font-mono text-[10px] text-[#A8ADB2]/60 tracking-wider">
              CARRIER: VLF / UHF DUAL TRANSCEIVER
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
            <EmergencyBroadcast />
            <LastTransmission />
          </div>
        </section>

        {/* 6. Real-Time Machine System Logs */}
        <section className="py-8 sm:py-12 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
          <SystemLogs />
        </section>

        {/* 7. Life Support & Resource Reserves */}
        <ResourceStability />

        {/* 8. Declassified Survival Archives & Protocols */}
        <SurvivalArchive />
      </main>

      {/* Tactical HUD Footer */}
      <footer className="relative z-10 border-t border-[#1B2123] bg-[#090B0B] py-8 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#A8ADB2]/70">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-[#7CFF00] rounded-none led-pulse-green" />
            <span className="text-[#EDEFF1] font-bold">VECTORS 26-27 // DOOMSDAY COMMAND SYSTEM</span>
            <span className="text-[#A8ADB2]/40">|</span>
            <span className="text-[#C9A227]">CLEARANCE: MAXIMUM</span>
          </div>

          <div className="text-center md:text-right">
            <div>TERMINAL ENCRYPTION: MIL-STD-810H // STATION VECTOR-01</div>
            <div className="text-[10px] text-[#A8ADB2]/40 mt-0.5">
              ALL PROTOCOLS OPERATING AUTONOMOUSLY. DO NOT POWER DOWN TERMINAL.
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 bg-[#101313] border border-[#2A3337] text-[#7CFF00] hover:border-[#7CFF00] hover:shadow-[0_0_15px_rgba(124,255,0,0.3)] transition-all cursor-pointer"
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
