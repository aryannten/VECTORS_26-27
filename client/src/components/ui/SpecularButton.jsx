import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

/**
 * SpecularButton — Avengers: Doomsday Specular Armor Button
 * 
 * Implements physics-based specular highlight that smoothly glints and tracks
 * mouse proximity along the metallic border and surface.
 */
export default function SpecularButton({
  children,
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  radius = 14,
  tint = '#1EFFA0',
  tintOpacity = 0.15,
  blur = 0,
  textColor = '#EDEFF1',
  lineColor = '#1EFFA0',
  baseColor = '#0D1115',
  intensity = 1,
  shineSize = 12,
  shineFade = 45,
  thickness = 1.25,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  to,
  href,
  onClick,
  disabled = false,
  className = '',
  style = {},
  variant = 'doom', // 'doom' | 'emerald' | 'crimson' | 'titanium'
  icon: Icon,
  ...props
}) {
  const btnRef = useRef(null)
  const animFrameRef = useRef(null)

  // Target coordinates and angle
  const targetState = useRef({
    angle: 0,
    x: 50,
    y: 50,
    intensity: 0.25,
    inProximity: false,
  })

  // Current interpolated coordinates for smooth spring/lerp
  const currentState = useRef({
    angle: 0,
    x: 50,
    y: 50,
    intensity: 0.25,
  })

  const [cssVars, setCssVars] = useState({
    '--spec-angle': '0deg',
    '--spec-x': '50%',
    '--spec-y': '50%',
    '--spec-intensity': '0.25',
    '--spec-radius': `${radius}px`,
  })

  // Color theme overrides based on variant
  const themeColors = useMemo(() => {
    switch (variant) {
      case 'crimson':
        return {
          line: '#FF2A4D',
          glow: 'rgba(255, 42, 77, 0.45)',
          base: baseColor || '#140A0C',
          text: textColor || '#FFF',
        }
      case 'titanium':
        return {
          line: '#E2E8F0',
          glow: 'rgba(226, 232, 240, 0.35)',
          base: baseColor || '#101418',
          text: textColor || '#F8FAFC',
        }
      case 'doom':
      case 'emerald':
      default:
        return {
          line: lineColor || '#1EFFA0',
          glow: 'rgba(30, 255, 160, 0.4)',
          base: baseColor || '#0B0F13',
          text: textColor || '#EDEFF1',
        }
    }
  }, [variant, lineColor, baseColor, textColor])

  // Track mouse coordinates & proximity
  const handleMouseMove = useCallback((e) => {
    if (!followMouse || disabled || !btnRef.current) return

    const rect = btnRef.current.getBoundingClientRect()
    const btnCenterX = rect.left + rect.width / 2
    const btnCenterY = rect.top + rect.height / 2

    const dx = e.clientX - btnCenterX
    const dy = e.clientY - btnCenterY
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist <= proximity) {
      // Calculate angle from center in degrees (0 - 360)
      let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90
      if (angle < 0) angle += 360

      // Relative coordinates on button surface (0 - 100%)
      const relX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
      const relY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))

      // Proximity falloff (closer = brighter specular beam)
      const proxFactor = Math.max(0.2, 1 - dist / proximity)

      targetState.current = {
        angle,
        x: relX,
        y: relY,
        intensity: proxFactor * intensity,
        inProximity: true,
      }
    } else {
      targetState.current.inProximity = false
      targetState.current.intensity = 0.2
    }
  }, [followMouse, disabled, proximity, intensity])

  // Mouse leave window or out of proximity
  const handleMouseLeave = useCallback(() => {
    targetState.current.inProximity = false
    targetState.current.intensity = 0.2
  }, [])

  // Animation Loop (Lerp for silky smooth 60fps highlight glide)
  useEffect(() => {
    let lastTime = performance.now()

    const animate = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1)
      lastTime = time

      const target = targetState.current
      const current = currentState.current

      // If autoAnimate is enabled or not in proximity, slowly sweep the angle
      if (autoAnimate || !target.inProximity) {
        target.angle = (target.angle + 40 * dt) % 360
      }

      // Smooth shortest angle interpolation
      let angleDiff = target.angle - current.angle
      while (angleDiff < -180) angleDiff += 360
      while (angleDiff > 180) angleDiff -= 360

      const lerpFactor = Math.min(speed * 20 * dt, 1)
      current.angle = (current.angle + angleDiff * lerpFactor + 360) % 360
      current.x += (target.x - current.x) * lerpFactor
      current.y += (target.y - current.y) * lerpFactor
      current.intensity += (target.intensity - current.intensity) * lerpFactor

      setCssVars({
        '--spec-angle': `${current.angle.toFixed(1)}deg`,
        '--spec-x': `${current.x.toFixed(1)}%`,
        '--spec-y': `${current.y.toFixed(1)}%`,
        '--spec-intensity': current.intensity.toFixed(3),
        '--spec-radius': `${radius}px`,
      })

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave, autoAnimate, speed, radius])

  // Size configurations
  const sizeClasses = {
    sm: 'text-[10px] py-1.5 px-3.5 tracking-wider gap-1.5',
    md: 'text-xs py-2 px-5 tracking-widest gap-2',
    lg: 'text-xs py-3 px-7 tracking-[0.14em] gap-2.5 font-bold',
    xl: 'text-sm py-3.5 px-9 tracking-[0.18em] gap-3 font-bold',
  }

  // Common inner content
  const buttonContent = (
    <>
      {/* 1. Specular Border Glow Aura (Reactive bloom on cursor proximity) */}
      <span
        className="pointer-events-none absolute -inset-[1px] transition-opacity duration-300"
        style={{
          borderRadius: `${radius + 1}px`,
          opacity: `calc(var(--spec-intensity) * 0.9)`,
          boxShadow: `0 0 24px ${themeColors.glow}, 0 0 45px rgba(30, 255, 160, 0.15)`,
        }}
      />

      {/* 2. Outer Specular Edge Glint (Conic highlight that glides around the metallic border) */}
      <span
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          borderRadius: `${radius}px`,
          padding: `${thickness}px`,
          background: `conic-gradient(from var(--spec-angle) at var(--spec-x) var(--spec-y), 
            rgba(255,255,255,0.06) 0deg,
            rgba(255,255,255,0.12) 110deg,
            ${themeColors.line} calc(180deg - ${shineSize}deg),
            #ffffff 180deg,
            ${themeColors.line} calc(180deg + ${shineSize}deg),
            rgba(255,255,255,0.12) 250deg,
            rgba(255,255,255,0.06) 360deg
          )`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: `calc(0.45 + var(--spec-intensity) * 0.55)`,
        }}
      />

      {/* 3. Dark Titanium Armor Base Layer */}
      <span
        className="relative z-10 flex w-full h-full items-center justify-center overflow-hidden transition-all duration-300 group-hover:brightness-110"
        style={{
          borderRadius: `${Math.max(0, radius - thickness)}px`,
          backgroundColor: themeColors.base,
          backgroundImage: `
            linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 40%, rgba(0, 0, 0, 0.55) 100%),
            radial-gradient(circle at var(--spec-x) var(--spec-y), rgba(30, 255, 160, ${tintOpacity}) 0%, transparent 65%)
          `,
          boxShadow: `
            inset 0 1px 1px rgba(255, 255, 255, 0.22),
            inset 0 -1px 2px rgba(0, 0, 0, 0.8),
            0 4px 14px rgba(0, 0, 0, 0.4)
          `,
        }}
      >
        {/* Subtle Latverian Titanium Brushed Rib Lines */}
        <span 
          className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px]" 
        />

        {/* Dynamic Specular Light Sweep Overlay on Hover */}
        <span
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle 80px at var(--spec-x) var(--spec-y), rgba(255, 255, 255, 0.16) 0%, transparent 80%)`,
          }}
        />

        {/* Content Label + Optional Icon */}
        <span 
          className="relative z-20 flex items-center justify-center font-mono uppercase transition-colors duration-200"
          style={{ color: themeColors.text }}
        >
          {Icon && <Icon className="w-3.5 h-3.5 shrink-0 opacity-90 transition-transform duration-300 group-hover:scale-110 group-hover:text-doom-glow" />}
          <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {children}
          </span>
        </span>
      </span>
    </>
  )

  const sharedClasses = cn(
    'group relative inline-flex items-center justify-center font-mono uppercase cursor-pointer select-none no-underline',
    'transition-transform duration-200 active:scale-[0.98]',
    sizeClasses[size] || sizeClasses.md,
    disabled && 'opacity-40 pointer-events-none cursor-not-allowed',
    className
  )

  const combinedStyles = {
    ...cssVars,
    borderRadius: `${radius}px`,
    ...style,
  }

  // Polymorphic rendering: Link vs anchor vs button
  if (to && !disabled) {
    return (
      <Link
        ref={btnRef}
        to={to}
        className={sharedClasses}
        style={combinedStyles}
        onClick={onClick}
        {...props}
      >
        {buttonContent}
      </Link>
    )
  }

  if (href && !disabled) {
    return (
      <a
        ref={btnRef}
        href={href}
        className={sharedClasses}
        style={combinedStyles}
        onClick={onClick}
        {...props}
      >
        {buttonContent}
      </a>
    )
  }

  return (
    <button
      ref={btnRef}
      type="button"
      className={sharedClasses}
      style={combinedStyles}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {buttonContent}
    </button>
  )
}
