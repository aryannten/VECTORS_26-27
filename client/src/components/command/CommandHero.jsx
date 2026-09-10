import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, ArrowDown, Radio, ChevronRight, Activity } from 'lucide-react';
import TacticalButton from './TacticalButton';
import StatusLed from './StatusLed';

export default function CommandHero({ onEnterSystem, onViewThreatMap }) {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[88vh] flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 py-16 overflow-hidden border-b border-[#1B2123]">
      {/* Background Layer: Atmospheric Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 50% 35%, rgba(124, 255, 0, 0.05) 0%, rgba(5, 6, 6, 0.95) 70%, #050606 100%)'
        }}
      />

      {/* Blueprint Topographical Vector Geometry Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-15 tactical-grid" />

      {/* Subtle Horizontal Tactical Scanline Sweep */}
      <div className="absolute inset-0 pointer-events-none z-0 tactical-scanlines opacity-40" />

      {/* Technical Reticle Accents in Corners */}
      <div className="absolute top-6 left-6 font-mono text-[9px] text-[#A8ADB2]/40 tracking-widest hidden md:block select-none">
        <div>SYS: VECTOR-PROTOCOL-26</div>
        <div>GRID: 48°12'N // 16°22'E</div>
        <div>STATUS: HERMETIC_LOCKDOWN</div>
      </div>

      <div className="absolute top-6 right-6 font-mono text-[9px] text-[#A8ADB2]/40 tracking-widest text-right hidden md:block select-none">
        <div>DEFCON: 2 // INTERCEPT_READY</div>
        <div>UPLINK: ACTIVE // 1420.45 MHz</div>
        <div>DECRYPTION: 100% NOMINAL</div>
      </div>

      {/* Hero Central Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Supporting System Line */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 border border-[#2A3337] bg-[#101313]/90 mb-6 sm:mb-8"
        >
          <StatusLed status="operational" size="sm" pulse={true} />
          <span className="font-mono text-xs tracking-widest text-[#7CFF00] uppercase font-medium">
            GLOBAL SURVIVAL NETWORK // STATUS: ACTIVE
          </span>
          <span className="w-1.5 h-1.5 bg-[#C9A227] rounded-full hidden sm:inline-block ml-1" />
        </motion.div>

        {/* Monumental Headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          className="space-y-1 sm:space-y-2 mb-6 sm:mb-8"
        >
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#EDEFF1] uppercase leading-none">
            THE WORLD ENDS.
          </h1>
          <h1 
            className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase leading-none text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #A8ADB2 65%, #646B73 100%)'
            }}
          >
            THE SYSTEM REMAINS.
          </h1>
        </motion.div>

        {/* Subtitle / Military Operational Mission */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="max-w-2xl text-xs sm:text-sm md:text-base text-[#A8ADB2] font-sans leading-relaxed tracking-wide mb-10 px-4"
        >
          Planetary infrastructure has experienced catastrophic failure across all primary sectors.
          Classified emergency life support, automated threat tracking, and seed vaults remain operational under Protocol 26.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-6 sm:px-0"
        >
          {/* Primary CTA: ENTER SYSTEM */}
          <TacticalButton
            variant="primary"
            size="lg"
            onClick={onEnterSystem}
            className="w-full sm:w-auto shadow-[0_0_30px_rgba(124,255,0,0.25)]"
          >
            <span className="flex items-center gap-2">
              ENTER SYSTEM
              <ChevronRight className="w-4 h-4" />
            </span>
          </TacticalButton>

          {/* Secondary CTA: VIEW THREAT MAP */}
          <TacticalButton
            variant="secondary"
            size="lg"
            onClick={onViewThreatMap}
            className="w-full sm:w-auto"
          >
            <span className="flex items-center gap-2">
              VIEW THREAT MAP
              <Activity className="w-4 h-4 text-[#C9A227]" />
            </span>
          </TacticalButton>
        </motion.div>

        {/* Live System Diagnostics Quick Ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-14 sm:mt-16 pt-6 border-t border-[#1B2123]/80 w-full max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-left font-mono"
        >
          <div className="p-2.5 bg-[#101313]/60 border border-[#1B2123]">
            <div className="text-[9px] text-[#A8ADB2]/60 uppercase tracking-widest">THREAT LEVEL</div>
            <div className="text-sm text-[#C9A227] font-bold">87% // CRITICAL</div>
          </div>

          <div className="p-2.5 bg-[#101313]/60 border border-[#1B2123]">
            <div className="text-[9px] text-[#A8ADB2]/60 uppercase tracking-widest">SURVIVOR CENSUS</div>
            <div className="text-sm text-[#EDEFF1] font-bold">08,421,903</div>
          </div>

          <div className="p-2.5 bg-[#101313]/60 border border-[#1B2123]">
            <div className="text-[9px] text-[#A8ADB2]/60 uppercase tracking-widest">GRID INTEGRITY</div>
            <div className="text-sm text-[#7CFF00] font-bold">68% ONLINE</div>
          </div>

          <div className="p-2.5 bg-[#101313]/60 border border-[#1B2123]">
            <div className="text-[9px] text-[#A8ADB2]/60 uppercase tracking-widest">RESERVES</div>
            <div className="text-sm text-[#A8ADB2] font-bold">31 DAYS REMAIN</div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center text-[#A8ADB2]/40 font-mono text-[9px] tracking-widest flex items-center gap-1 select-none pointer-events-none">
        <span>SCROLL FOR TELEMETRY</span>
        <ArrowDown className="w-3 h-3 animate-bounce" />
      </div>
    </section>
  );
}
