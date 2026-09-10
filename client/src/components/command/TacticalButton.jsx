import React from 'react';
import { cn } from '../../lib/utils';
import { tacticalAudio } from './AudioSynthesizer';

export default function TacticalButton({
  children,
  onClick,
  variant = 'secondary', // 'primary' | 'secondary' | 'gold' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  disabled = false,
  className = '',
  chamfer = true,
  type = 'button',
  ...props
}) {
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 tracking-wider gap-1.5',
    md: 'text-xs sm:text-sm px-5 py-2.5 tracking-widest gap-2',
    lg: 'text-sm sm:text-base px-7 py-3.5 tracking-widest gap-2.5',
  };

  const variantStyles = {
    // Primary: Radioactive green operational CTA
    primary:
      'bg-[#7CFF00] text-[#050606] font-semibold border border-[#7CFF00] hover:bg-[#8eff1a] hover:shadow-[0_0_25px_rgba(124,255,0,0.4)] active:scale-[0.98]',
    // Secondary: Black base, silver metallic border
    secondary:
      'bg-[#050606] text-[#EDEFF1] border border-[#2A3337] hover:border-[#A8ADB2] hover:text-white hover:bg-[#101313] hover:shadow-[0_0_15px_rgba(168,173,178,0.15)] active:scale-[0.98]',
    // Gold: Authority / high priority action
    gold:
      'bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/50 hover:bg-[#C9A227] hover:text-[#050606] hover:shadow-[0_0_20px_rgba(201,162,39,0.35)] active:scale-[0.98]',
    // Danger: Critical red action
    danger:
      'bg-[#8B0000]/20 text-[#FF4C4C] border border-[#8B0000] hover:bg-[#8B0000] hover:text-white hover:shadow-[0_0_20px_rgba(139,0,0,0.4)] active:scale-[0.98]',
  };

  const handleClick = (e) => {
    if (disabled) return;
    if (variant === 'primary') {
      tacticalAudio.playChirp(1100);
    } else if (variant === 'danger') {
      tacticalAudio.playAlert();
    } else {
      tacticalAudio.playClick(900);
    }
    onClick?.(e);
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'relative inline-flex items-center justify-center font-display uppercase transition-all duration-200 cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed',
        sizeStyles[size] || sizeStyles.md,
        variantStyles[variant] || variantStyles.secondary,
        chamfer ? 'chamfer-tr' : '',
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
    </button>
  );
}
