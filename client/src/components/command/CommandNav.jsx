import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Radio, 
  Volume2, 
  VolumeX, 
  Terminal, 
  Layers, 
  MapPin, 
  Archive, 
  Activity,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { cn } from '../../lib/utils';
import StatusLed from './StatusLed';
import { tacticalAudio } from './AudioSynthesizer';

export default function CommandNav({
  activeSection = 'system',
  onSelectSection,
}) {
  const [isMuted, setIsMuted] = useState(tacticalAudio.isMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [utcTime, setUtcTime] = useState('');

  // Clock in UTC format: HH:MM:SSZ
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { id: 'system', label: 'SYSTEM', icon: Activity, index: '01' },
    { id: 'threat-map', label: 'THREAT MAP', icon: MapPin, index: '02' },
    { id: 'resources', label: 'RESOURCES', icon: Layers, index: '03' },
    { id: 'survival', label: 'SURVIVAL', icon: Shield, index: '04' },
    { id: 'archive', label: 'ARCHIVE', icon: Archive, index: '05' },
  ];

  const handleNavClick = (id) => {
    tacticalAudio.playClick(950);
    onSelectSection?.(id);
    setMobileMenuOpen(false);

    // Scroll smoothly to the target section if present
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToggleAudio = () => {
    const newMute = tacticalAudio.toggleMute();
    setIsMuted(newMute);
    if (!newMute) {
      tacticalAudio.playChirp(1000);
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-[#050606]/95 backdrop-blur-md border-b border-[#1B2123]">
      {/* Top Telemetry Header Bar */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1 bg-[#090B0B] border-b border-[#1B2123]/60 text-[10px] font-mono text-[#A8ADB2]/70">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#7CFF00]">
            <StatusLed status="operational" size="sm" pulse={true} />
            GLOBAL SURVIVAL NETWORK // PROTOCOL 26
          </span>
          <span className="text-[#A8ADB2]/40">|</span>
          <span>STATION: VECTOR-01</span>
          <span className="text-[#A8ADB2]/40">|</span>
          <span className="text-[#C9A227]">DEFCON: 2 // HIGH ALERT</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-[#EDEFF1] tracking-widest">{utcTime}</span>
          <span className="text-[#A8ADB2]/40">|</span>
          <span className="text-[#7CFF00]">LATENCY: 14ms</span>
          <span className="text-[#A8ADB2]/40">|</span>
          <button
            type="button"
            onClick={handleToggleAudio}
            className="flex items-center gap-1.5 text-[#A8ADB2] hover:text-[#7CFF00] transition-colors cursor-pointer"
            title={isMuted ? 'Unmute tactical audio' : 'Mute tactical audio'}
          >
            {isMuted ? <VolumeX className="w-3 h-3 text-[#D32F2F]" /> : <Volume2 className="w-3 h-3 text-[#7CFF00]" />}
            <span>{isMuted ? 'AUDIO: MUTED' : 'AUDIO: LIVE'}</span>
          </button>
        </div>
      </div>

      {/* Main Console Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Left Brand / System Seal */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#101313] border border-[#2A3337] flex items-center justify-center relative select-none">
            <span className="absolute -top-0.5 -left-0.5 text-[7px] text-[#7CFF00] font-mono">+</span>
            <span className="absolute -bottom-0.5 -right-0.5 text-[7px] text-[#7CFF00] font-mono">+</span>
            <span className="font-display font-bold text-sm tracking-tighter text-[#7CFF00]">
              V26
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold tracking-widest text-sm sm:text-base text-[#EDEFF1] uppercase">
                COMMAND CENTER
              </span>
              <span className="hidden sm:inline-block font-mono text-[9px] px-1.5 py-0.2 bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/40 tracking-widest">
                LVL 5
              </span>
            </div>
            <div className="hidden sm:block font-mono text-[9px] text-[#A8ADB2]/60 tracking-wider">
              TERMINAL ID: DS-2026-X
            </div>
          </div>
        </div>

        {/* Center: Tactical Console Navigation Items (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  'relative px-3.5 py-2 font-display uppercase tracking-widest text-xs transition-colors duration-200 cursor-pointer flex items-center gap-1.5',
                  isActive
                    ? 'text-[#EDEFF1] font-semibold'
                    : 'text-[#A8ADB2] hover:text-[#EDEFF1] hover:bg-[#101313]/60'
                )}
              >
                <span className="font-mono text-[9px] text-[#A8ADB2]/40">
                  {item.index}
                </span>
                <span>{item.label}</span>

                {/* Active Radioactive Green Underline Seam */}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#7CFF00] shadow-[0_0_8px_#7CFF00]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Quick Portal Link & Audio Control */}
        <div className="flex items-center gap-3">
          {/* Audio toggle on tablet/mobile */}
          <button
            type="button"
            onClick={handleToggleAudio}
            className="lg:hidden p-2 text-[#A8ADB2] hover:text-[#7CFF00] border border-[#1B2123] bg-[#101313] transition-colors cursor-pointer"
            aria-label="Toggle sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#D32F2F]" /> : <Volume2 className="w-4 h-4 text-[#7CFF00]" />}
          </button>

          {/* Festival Portal Link */}
          <Link
            to="/events"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-display uppercase tracking-wider text-[#A8ADB2] hover:text-[#EDEFF1] border border-[#2A3337] hover:border-[#A8ADB2]/60 bg-[#050606] transition-all"
          >
            <span>FESTIVAL PORTAL</span>
            <ExternalLink className="w-3 h-3 text-[#C9A227]" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#A8ADB2] hover:text-[#7CFF00] border border-[#1B2123] bg-[#101313] transition-colors cursor-pointer"
            aria-label="Open command menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Tactical Command Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#090B0B] border-b border-[#1B2123] px-4 py-4 space-y-2">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1B2123] text-[10px] font-mono text-[#A8ADB2]/70">
            <span className="text-[#7CFF00]">SURVIVAL NETWORK ACTIVE</span>
            <span>{utcTime}</span>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 font-display text-xs tracking-widest text-left border transition-all cursor-pointer',
                    isActive
                      ? 'bg-[#101313] border-[#7CFF00]/50 text-[#7CFF00]'
                      : 'bg-[#050606] border-[#1B2123] text-[#A8ADB2] hover:border-[#2A3337]'
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </span>
                  <span className="font-mono text-[9px] text-[#A8ADB2]/50">
                    [{item.index}]
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 mt-2 border-t border-[#1B2123]">
            <Link
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-display tracking-widest text-[#C9A227] border border-[#C9A227]/40 bg-[#C9A227]/5"
            >
              <span>VECTORS 26 FESTIVAL PORTAL</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
