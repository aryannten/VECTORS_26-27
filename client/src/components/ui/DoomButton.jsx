import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

/**
 * DoomButton — High-End Agency Tactical Cyber Button System
 * 
 * Features:
 * - Precision-engineered multi-layer obsidian chassis
 * - Radiant electric perimeter glow on hover (NO tacky sliding/flashing white lines!)
 * - Tactile magnetic elevation lift (-translate-y-1 on hover)
 * - Pulsing status beacon & kinetic trailing icon
 * - Pure 60 FPS GPU-accelerated CSS transitions
 */
export default function DoomButton({
  children,
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  variant = 'doom', // 'doom' | 'titanium' | 'ghost' | 'danger'
  icon: CustomIcon,
  hideIcon = false,
  showBeacon = true,
  to,
  href,
  onClick,
  disabled = false,
  className = '',
  style = {},
  type = 'button',
  ...props
}) {
  const sizeConfig = {
    sm: {
      padding: 'px-4 py-2',
      text: 'text-[11px] tracking-[0.16em]',
      iconWrap: 'w-5 h-5 ml-2',
      iconSize: 12,
      beacon: 'w-1.5 h-1.5 mr-2',
      radius: 'rounded-lg',
    },
    md: {
      padding: 'px-5 py-2.5',
      text: 'text-xs tracking-[0.18em]',
      iconWrap: 'w-6 h-6 ml-2.5',
      iconSize: 13,
      beacon: 'w-1.5 h-1.5 mr-2.5',
      radius: 'rounded-xl',
    },
    lg: {
      padding: 'px-7 py-3.5',
      text: 'text-xs sm:text-sm tracking-[0.22em]',
      iconWrap: 'w-7 h-7 ml-3',
      iconSize: 15,
      beacon: 'w-2 h-2 mr-3',
      radius: 'rounded-xl',
    },
    xl: {
      padding: 'px-9 py-4',
      text: 'text-sm sm:text-base tracking-[0.24em]',
      iconWrap: 'w-8 h-8 ml-3.5',
      iconSize: 16,
      beacon: 'w-2 h-2 mr-3.5',
      radius: 'rounded-2xl',
    },
  }[size] || {
    padding: 'px-5 py-2.5',
    text: 'text-xs tracking-[0.18em]',
    iconWrap: 'w-6 h-6 ml-2.5',
    iconSize: 13,
    beacon: 'w-1.5 h-1.5 mr-2.5',
    radius: 'rounded-xl',
  }

  const variantConfig = {
    doom: {
      container: 'bg-[#090D0F]/90 border border-emerald-500/50 hover:border-emerald-400 hover:bg-[#0C1316] text-emerald-300 hover:text-white',
      glow: 'hover:shadow-[0_0_25px_rgba(30,255,160,0.45),0_10px_25px_rgba(0,0,0,0.6)]',
      beacon: 'bg-emerald-400 shadow-[0_0_8px_#1EFFA0]',
      iconWrap: 'bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 group-hover:bg-emerald-400 group-hover:text-black group-hover:border-emerald-300',
    },
    titanium: {
      container: 'bg-[#12151A]/90 border border-white/20 hover:border-white/60 hover:bg-[#181C24] text-zinc-200 hover:text-white',
      glow: 'hover:shadow-[0_0_25px_rgba(255,255,255,0.22),0_10px_25px_rgba(0,0,0,0.6)]',
      beacon: 'bg-zinc-400 group-hover:bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)]',
      iconWrap: 'bg-white/10 border border-white/25 text-zinc-300 group-hover:bg-white group-hover:text-black group-hover:border-white',
    },
    danger: {
      container: 'bg-[#150B0D]/90 border border-red-500/50 hover:border-red-400 hover:bg-[#1F0E12] text-red-400 hover:text-white',
      glow: 'hover:shadow-[0_0_25px_rgba(239,68,68,0.45),0_10px_25px_rgba(0,0,0,0.6)]',
      beacon: 'bg-red-400 shadow-[0_0_8px_#EF4444]',
      iconWrap: 'bg-red-500/15 border border-red-400/40 text-red-400 group-hover:bg-red-500 group-hover:text-white group-hover:border-red-300',
    },
    ghost: {
      container: 'bg-transparent border border-white/15 hover:border-emerald-500/50 hover:bg-white/[0.04] text-zinc-400 hover:text-emerald-300',
      glow: 'hover:shadow-[0_0_20px_rgba(30,255,160,0.2)]',
      beacon: 'bg-zinc-600 group-hover:bg-emerald-400',
      iconWrap: 'bg-white/5 border border-white/10 text-zinc-400 group-hover:border-emerald-400/50 group-hover:text-emerald-300',
    },
  }[variant] || variantConfig.doom

  const IconComponent = CustomIcon || ArrowUpRight

  const buttonInner = (
    <span
      className={cn(
        'relative inline-flex items-center justify-center font-mono uppercase font-bold select-none cursor-pointer',
        'backdrop-blur-md transition-all duration-200 ease-out group',
        'hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]',
        sizeConfig.radius,
        sizeConfig.padding,
        sizeConfig.text,
        variantConfig.container,
        variantConfig.glow,
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none hover:translate-y-0 hover:shadow-none',
        className
      )}
      style={style}
      {...props}
    >
      {/* Corner brackets (subtle cyber aesthetic) */}
      <span className="absolute top-[2px] left-[2px] w-1.5 h-[1px] bg-white/25 pointer-events-none" />
      <span className="absolute top-[2px] left-[2px] w-[1px] h-1.5 bg-white/25 pointer-events-none" />
      <span className="absolute bottom-[2px] right-[2px] w-1.5 h-[1px] bg-white/25 pointer-events-none" />
      <span className="absolute bottom-[2px] right-[2px] w-[1px] h-1.5 bg-white/25 pointer-events-none" />

      {/* Pulsing Status Beacon */}
      {showBeacon && (
        <span
          className={cn(
            'rounded-full shrink-0 animate-pulse transition-all duration-200',
            sizeConfig.beacon,
            variantConfig.beacon
          )}
          aria-hidden="true"
        />
      )}

      {/* Button Text */}
      <span className="relative z-10 transition-colors duration-200 whitespace-nowrap">
        {children}
      </span>

      {/* Trailing Icon Pill with kinetic drift */}
      {!hideIcon && (
        <span
          className={cn(
            'rounded-full flex items-center justify-center shrink-0',
            'transition-all duration-200 ease-out',
            'group-hover:translate-x-1 group-hover:-translate-y-0.5 group-hover:scale-105',
            sizeConfig.iconWrap,
            variantConfig.iconWrap
          )}
        >
          <IconComponent size={sizeConfig.iconSize} strokeWidth={2.4} />
        </span>
      )}
    </span>
  )

  if (to) {
    return (
      <Link to={to} className="inline-block" onClick={onClick}>
        {buttonInner}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className="inline-block" target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {buttonInner}
      </a>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-block bg-transparent p-0 border-0 outline-none"
    >
      {buttonInner}
    </button>
  )
}
