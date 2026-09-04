import React, { forwardRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from "../../lib/utils";

export const GlowButton = forwardRef(
  ({ label = "Generate", onClick, className, color = "emerald", ...props }, ref) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = (e) => {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 200);
      onClick?.(e);
    };

    // Theme color variants
    const colorClasses = {
      emerald: "text-emerald border-emerald/40 hover:bg-emerald hover:text-charcoal hover:shadow-[0_0_40px_rgba(0,255,102,0.6)]",
      brass: "text-brass border-brass/40 hover:bg-brass hover:text-charcoal hover:shadow-[0_0_40px_rgba(212,175,55,0.6)]"
    };

    const bgStyles = {
      emerald: 'rgba(0,255,102,0.06)',
      brass: 'rgba(212,175,55,0.06)'
    };

    const shadowStyles = {
      emerald: '0 0 15px rgba(0,255,102,0.08), inset 0 0 15px rgba(0,255,102,0.05)',
      brass: '0 0 15px rgba(212,175,55,0.08), inset 0 0 15px rgba(212,175,55,0.05)'
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        className={cn(
          "relative overflow-hidden font-display tracking-[0.15em] uppercase text-sm py-4 px-8 text-center border transition-all duration-300",
          colorClasses[color] || colorClasses.emerald,
          className
        )}
        style={{ 
          background: bgStyles[color] || bgStyles.emerald, 
          backdropFilter: 'blur(12px)', 
          boxShadow: shadowStyles[color] || shadowStyles.emerald 
        }}
        onClick={handleClick}
        data-state={isClicked ? "clicked" : undefined}
        {...props}
      >
        <span className="flex items-center justify-center gap-2">
          {label}
          <Sparkles size={16} className="ml-1 opacity-80" />
        </span>
      </button>
    );
  }
);

GlowButton.displayName = "GlowButton";
