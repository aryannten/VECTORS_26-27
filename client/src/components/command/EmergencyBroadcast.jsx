import React, { useState } from 'react';
import { Radio, Send, AlertTriangle, CheckCircle2, ShieldAlert, Wifi } from 'lucide-react';
import { cn } from '../../lib/utils';
import StatusLed from './StatusLed';
import TacticalPanel from './TacticalPanel';
import TacticalButton from './TacticalButton';
import { tacticalAudio } from './AudioSynthesizer';

export default function EmergencyBroadcast() {
  const [broadcastMessage, setBroadcastMessage] = useState(
    'ATTENTION ALL SECTORS: Protocol 26 automated survival shelters are active. Maintain shelter seals.'
  );
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [lastBroadcastTime, setLastBroadcastTime] = useState('14 MINUTES AGO');
  const [broadcastCount, setBroadcastCount] = useState(142);
  const [broadcastSent, setBroadcastSent] = useState(false);

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (isBroadcasting) return;

    setIsBroadcasting(true);
    tacticalAudio.playAlert();

    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastSent(true);
      setLastBroadcastTime('JUST NOW');
      setBroadcastCount((prev) => prev + 1);
      tacticalAudio.playChirp(1200);

      setTimeout(() => {
        setBroadcastSent(false);
      }, 5000);
    }, 2000);
  };

  return (
    <TacticalPanel
      title="EMERGENCY BROADCAST CONSOLE"
      subtitle="GLOBAL EMERGENCY OVERRIDE CHANNEL"
      tag="CHANNEL: ACTIVE"
      status="operational"
      statusLabel="GLOBAL ACTIVE"
      chamfer={true}
      variant="active"
    >
      <div className="space-y-4">
        {/* Transmission Status Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[10px] pb-3 border-b border-[#1B2123]">
          <div>
            <span className="text-[#A8ADB2]/50 block">STATUS:</span>
            <span className="text-[#7CFF00] font-bold flex items-center gap-1">
              <StatusLed status="operational" size="sm" />
              CARRIER ONLINE
            </span>
          </div>
          <div>
            <span className="text-[#A8ADB2]/50 block">SIGNAL STRENGTH:</span>
            <span className="text-[#EDEFF1] font-bold">94.2% [HIGH]</span>
          </div>
          <div>
            <span className="text-[#A8ADB2]/50 block">LAST DISPATCH:</span>
            <span className="text-[#A8ADB2] font-semibold">{lastBroadcastTime}</span>
          </div>
          <div>
            <span className="text-[#A8ADB2]/50 block">TOTAL PACKETS:</span>
            <span className="text-[#C9A227] font-bold">{broadcastCount} TRANSMITTED</span>
          </div>
        </div>

        {/* Broadcast Message Input Form */}
        <form onSubmit={handleBroadcast} className="space-y-3">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#A8ADB2] mb-1.5 flex items-center justify-between">
              <span>EMERGENCY PACKET PAYLOAD:</span>
              <span className="text-[#C9A227]">CLEARANCE: LVL 5 REQUIRED</span>
            </label>
            <textarea
              rows={3}
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="w-full bg-[#050606] border border-[#2A3337] focus:border-[#7CFF00] p-3 text-xs sm:text-sm font-mono text-[#EDEFF1] placeholder-[#A8ADB2]/40 outline-none transition-colors resize-none"
              placeholder="Enter emergency transmission text..."
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#A8ADB2]/70">
              <Wifi className="w-3.5 h-3.5 text-[#7CFF00]" />
              <span>CARRIER FREQUENCY: 1420.450 MHz // BEACON BAND: VLF</span>
            </div>

            <TacticalButton
              type="submit"
              variant="gold"
              size="md"
              disabled={isBroadcasting || !broadcastMessage.trim()}
              className="w-full sm:w-auto"
            >
              {isBroadcasting ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  TRANSMITTING...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-3.5 h-3.5" />
                  TRANSMIT BROADCAST
                </span>
              )}
            </TacticalButton>
          </div>
        </form>

        {/* Confirmation Banner */}
        {broadcastSent && (
          <div className="p-3 bg-[#7CFF00]/10 border border-[#7CFF00]/50 flex items-center gap-2 text-xs font-mono text-[#7CFF00] animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>GLOBAL BROADCAST DISPATCHED TO ALL SECTORS SUCCESSFULLY</span>
          </div>
        )}
      </div>
    </TacticalPanel>
  );
}
