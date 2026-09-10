import React from 'react';
import { cn } from '../../lib/utils';

export default function StatusLed({
  status = 'operational',
  size = 'md',
  pulse = true,
  label = '',
  className = '',
}) {
  const sizeMap = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  const statusStyles = {
    operational: {
      dot: 'bg-[#7CFF00] shadow-[0_0_8px_#7CFF00]',
      pulseClass: pulse ? 'led-pulse-green' : '',
      text: 'text-[#7CFF00]',
    },
    warning: {
      dot: 'bg-[#C9A227] shadow-[0_0_8px_#C9A227]',
      pulseClass: pulse ? 'led-pulse-gold' : '',
      text: 'text-[#C9A227]',
    },
    critical: {
      dot: 'bg-[#D32F2F] shadow-[0_0_10px_#D32F2F]',
      pulseClass: pulse ? 'led-pulse-red' : '',
      text: 'text-[#D32F2F]',
    },
    standby: {
      dot: 'bg-[#A8ADB2] shadow-[0_0_4px_#A8ADB2]',
      pulseClass: '',
      text: 'text-[#A8ADB2]',
    },
  };

  const current = statusStyles[status] || statusStyles.operational;

  return (
    <div className={cn('inline-flex items-center gap-2 select-none', className)}>
      <span
        className={cn(
          'rounded-full shrink-0 transition-opacity',
          sizeMap[size] || sizeMap.md,
          current.dot,
          current.pulseClass
        )}
        aria-hidden="true"
      />
      {label && (
        <span className={cn('font-mono text-[10px] tracking-wider uppercase', current.text)}>
          {label}
        </span>
      )}
    </div>
  );
}
