import React, { useState } from 'react';
import { Radio, Volume2, Play, Pause, ShieldCheck, Lock, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import StatusLed from './StatusLed';
import TacticalPanel from './TacticalPanel';
import { tacticalAudio } from './AudioSynthesizer';

export default function LastTransmission() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      tacticalAudio.playChirp(600);
    } else {
      tacticalAudio.playClick(400);
    }
  };

  return (
    <TacticalPanel
      title="LAST TRANSMISSION"
      subtitle="INTERCEPTED EMERGENCY DISTRESS CARRIER"
      tag="DECRYPT: 74.2%"
      status="warning"
      statusLabel="INTERCEPTED"
      chamfer={true}
      variant="gold"
    >
      <div className="space-y-4">
        {/* Transmission Metadata Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px] pb-3 border-b border-[#1B2123]">
          <div>
            <span className="text-[#A8ADB2]/50 block">SOURCE:</span>
            <span className="text-[#EDEFF1] font-semibold">DEEP BUNKER SITE-09</span>
          </div>
          <div>
            <span className="text-[#A8ADB2]/50 block">FREQUENCY:</span>
            <span className="text-[#7CFF00] font-semibold">1420.45 MHz [UHF]</span>
          </div>
          <div>
            <span className="text-[#A8ADB2]/50 block">CARRIER TIME:</span>
            <span className="text-[#EDEFF1] font-semibold">03:42:19 UTC</span>
          </div>
          <div>
            <span className="text-[#A8ADB2]/50 block">SIGNAL INTEGRITY:</span>
            <span className="text-[#C9A227] font-semibold">74.2% DECRYPTED</span>
          </div>
        </div>

        {/* Audio Waveform Spectrum Visualization */}
        <div className="bg-[#050606] border border-[#1B2123] p-4 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Scanlines overlay */}
          <div className="absolute inset-0 pointer-events-none tactical-scanlines opacity-40" />

          {/* Equalizer Spectrum Bars */}
          <div className="flex items-center justify-center gap-1 sm:gap-1.5 h-16 w-full max-w-md my-2">
            {[40, 65, 85, 30, 95, 60, 45, 75, 90, 35, 70, 50, 80, 40, 85, 60, 95, 30, 70, 50].map(
              (baseHeight, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'w-1.5 sm:w-2 bg-[#7CFF00] transition-all duration-200 rounded-none',
                    isPlaying ? 'waveform-bar-active' : 'opacity-40'
                  )}
                  style={{
                    height: isPlaying ? undefined : `${baseHeight}%`,
                    animationDelay: `${idx * 0.06}s`,
                  }}
                />
              )
            )}
          </div>

          {/* Play / Pause audio carrier simulation */}
          <div className="flex items-center gap-3 mt-2 z-10">
            <button
              type="button"
              onClick={handleTogglePlay}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-1.5 font-display uppercase tracking-widest text-xs border transition-all cursor-pointer',
                isPlaying
                  ? 'bg-[#7CFF00] text-[#050606] border-[#7CFF00] font-bold shadow-[0_0_15px_rgba(124,255,0,0.4)]'
                  : 'bg-[#101313] text-[#A8ADB2] border-[#2A3337] hover:border-[#7CFF00] hover:text-[#EDEFF1]'
              )}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'PAUSE CARRIER' : 'PLAY TRANSMISSION'}</span>
            </button>

            <span className="font-mono text-[9px] text-[#A8ADB2]/60">
              {isPlaying ? 'PLAYING INTERCEPTED AUDIO FEED...' : 'AUDIO READY // 0:34'}
            </span>
          </div>
        </div>

        {/* Decrypted Transcript Body */}
        <div className="p-4 bg-[#090B0B] border border-[#2A3337] relative">
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#1B2123] font-mono text-[9px]">
            <span className="text-[#C9A227] flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              DECRYPTED TEXT RECORD
            </span>
            <span className="text-[#A8ADB2]/50">CRYPTOGRAPHIC_HASH: 0x9B4E</span>
          </div>

          <blockquote className="font-sans text-xs sm:text-sm text-[#EDEFF1] leading-relaxed italic border-l-2 border-[#C9A227] pl-3 py-1">
            &ldquo;Surface integrity compromised at sector 4. Atmospheric scrubbers failing under high particulate fallout. Engaging cryogenic seal protocol. If anyone receives this... the seed vault is still secure. Coordinates attached.&rdquo;
          </blockquote>

          <div className="mt-3 pt-2 border-t border-[#1B2123] flex flex-wrap items-center justify-between font-mono text-[9px] text-[#A8ADB2]/60">
            <div>ATTACHED COORDINATES: 78°14'N // 15°29'E</div>
            <div className="text-[#7CFF00]">AUTHENTICATION: SEAL_VERIFIED</div>
          </div>
        </div>
      </div>
    </TacticalPanel>
  );
}
