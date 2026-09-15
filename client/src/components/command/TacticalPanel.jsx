import React from 'react';
import { cn } from '../../lib/utils';
import StatusLed from './StatusLed';

export default function TacticalPanel({
  title,
  subtitle,
  tag,
  status,
  statusLabel,
  action,
  children,
  className = '',
  chamfer = false,
  variant = 'default', // 'default' | 'active' | 'gold' | 'danger'
  headerClassName = '',
}) {
  const variantBorder = {
    default: 'border-[#1B2123] hover:border-[#2C353A]',
    active: 'border-[#7CFF00]/40 shadow-[0_0_15px_rgba(124,255,0,0.06)]',
    gold: 'border-[#C9A227]/40 shadow-[0_0_15px_rgba(201,162,39,0.06)]',
    danger: 'border-[#D32F2F]/40 shadow-[0_0_15px_rgba(211,47,47,0.08)]',
  };

  return (
    <div
      className={cn(
        'relative bg-[#101313] border transition-all duration-300',
        variantBorder[variant] || variantBorder.default,
        chamfer ? 'chamfer-tr' : 'rounded-none',
        className
      )}
    >
      {/* Corner crosshairs for technical blueprint feel */}
      <span className="absolute -top-1 -left-1 text-[9px] text-[#A8ADB2]/30 font-mono select-none pointer-events-none">+</span>
      <span className="absolute -top-1 -right-1 text-[9px] text-[#A8ADB2]/30 font-mono select-none pointer-events-none">+</span>
      <span className="absolute -bottom-1 -left-1 text-[9px] text-[#A8ADB2]/30 font-mono select-none pointer-events-none">+</span>
      <span className="absolute -bottom-1 -right-1 text-[9px] text-[#A8ADB2]/30 font-mono select-none pointer-events-none">+</span>

      {/* Internal Machining Line on Top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#A8ADB2]/20 to-transparent pointer-events-none" />

      {/* Header bar if title or tag is provided */}
      {(title || tag || status || action) && (
        <div
          className={cn(
            'flex items-center justify-between px-4 py-2.5 border-b border-[#1B2123] bg-[#090B0B]/80',
            headerClassName
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            {status && (
              <StatusLed status={status} size="sm" label={statusLabel} />
            )}
            <div className="flex items-baseline gap-2 truncate">
              {title && (
                <h3 className="font-display uppercase tracking-widest text-xs font-semibold text-[#EDEFF1] truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <span className="font-mono text-[10px] text-[#A8ADB2]/60 tracking-wider hidden sm:inline">
                  {subtitle}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            {tag && (
              <span className="font-mono text-[9px] tracking-widest uppercase px-1.5 py-0.5 border border-[#1B2123] text-[#A8ADB2] bg-[#050606]">
                {tag}
              </span>
            )}
            {action}
          </div>
        </div>
      )}

      {/* Panel Body */}
      <div className="p-4 sm:p-5 relative z-10">{children}</div>
    </div>
  );
}
