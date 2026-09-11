import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TOTAL_FRAMES = 50

/**
 * ScrollCanvas — Scroll-driven image sequence renderer
 * 
 * Renders a 50-frame JPG sequence on a <canvas>, driven by scroll position.
 * Uses GSAP ScrollTrigger for smooth frame interpolation.
 * 
 * Props:
 * - startFrame (number): First frame index to show (1-based, default 1)
 * - endFrame (number): Last frame index (1-based, default 50)
 * - scrubDuration (number): ScrollTrigger scrub smoothing (default 0.5)
 * - className (string): Additional CSS classes for the container
 * - style (object): Additional inline styles
 * - overlay (ReactNode): Content to overlay on top of the canvas
 * - triggerRef (ref): External ref for ScrollTrigger trigger element
 */
export default function ScrollCanvas({
  startFrame = 1,
  endFrame = TOTAL_FRAMES,
  scrubDuration = 0.4,
  className = '',
  style = {},
  overlay,
  triggerRef,
  pin = false,
  pinSpacing = true,
  start = 'top top',
  end = '+=2500',
  onProgress,
  onFrameChange,
  onLoaded,
}) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const imagesRef = useRef([])
  const currentFrameRef = useRef(startFrame - 1)
  const rafIdRef = useRef(null)
  const [loadProgress, setLoadProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  // Build frame URL
  const getFrameUrl = useCallback((index) => {
    const num = String(index).padStart(3, '0')
    return `/doom2/ezgif-frame-${num}.jpg`
  }, [])

  // Draw a specific frame on the canvas
  const drawFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const img = imagesRef.current[frameIndex]
    if (!img || !img.complete || img.naturalWidth === 0) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    const cw = rect.width * dpr
    const ch = rect.height * dpr

    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw
      canvas.height = ch
    }

    ctx.clearRect(0, 0, cw, ch)

    // Cover-fit: maintain aspect ratio, fill canvas
    const imgRatio = img.naturalWidth / img.naturalHeight
    const canvasRatio = cw / ch
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight

    if (imgRatio > canvasRatio) {
      // Image is wider — crop sides
      sw = img.naturalHeight * canvasRatio
      sx = (img.naturalWidth - sw) / 2
    } else {
      // Image is taller — crop top/bottom
      sh = img.naturalWidth / canvasRatio
      sy = (img.naturalHeight - sh) / 2
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch)
  }, [])

  // Preload images
  useEffect(() => {
    const images = new Array(TOTAL_FRAMES)
    let loadedCount = 0

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const onImageLoad = () => {
      loadedCount++
      setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100))
      if (loadedCount >= TOTAL_FRAMES) {
        setIsLoaded(true)
        if (onLoaded) onLoaded(true)
      }
      // Draw first available frame immediately
      if (loadedCount === 1) {
        const initialFrame = prefersReducedMotion
          ? Math.floor((startFrame + endFrame) / 2) - 1
          : startFrame - 1
        drawFrame(initialFrame)
      }
    }

    // Priority load: first frame, middle frame, last frame, then rest
    const priorityIndices = [
      startFrame - 1,
      endFrame - 1,
      Math.floor((startFrame + endFrame) / 2) - 1,
    ]
    const remainingIndices = []
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (!priorityIndices.includes(i)) {
        remainingIndices.push(i)
      }
    }

    const loadOrder = [...priorityIndices, ...remainingIndices]

    loadOrder.forEach((i, loadIndex) => {
      const img = new Image()
      img.decoding = 'async'
      // Stagger non-priority loads slightly to avoid network congestion
      const delay = loadIndex < 3 ? 0 : Math.floor((loadIndex - 3) / 5) * 50
      setTimeout(() => {
        img.onload = onImageLoad
        img.onerror = onImageLoad // Count errors to avoid hanging
        img.src = getFrameUrl(i + 1)
      }, delay)
      images[i] = img
    })

    imagesRef.current = images

    return () => {
      // Cancel any pending loads
      images.forEach((img) => {
        if (img) {
          img.onload = null
          img.onerror = null
        }
      })
    }
  }, [startFrame, endFrame, getFrameUrl, drawFrame])

  // GSAP ScrollTrigger for frame scrubbing
  useEffect(() => {
    if (!isLoaded) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      // Show static middle frame
      const midFrame = Math.floor((startFrame + endFrame) / 2) - 1
      drawFrame(midFrame)
      return
    }

    const targetTrigger = triggerRef?.current || containerRef.current
    if (!targetTrigger) return

    const frameCount = endFrame - startFrame

    const st = ScrollTrigger.create({
      trigger: targetTrigger,
      start: start,
      end: end,
      pin: pin ? targetTrigger : false,
      pinSpacing: pinSpacing,
      scrub: scrubDuration,
      onUpdate: (self) => {
        const newFrame = Math.round(
          (startFrame - 1) + self.progress * frameCount
        )
        const clampedFrame = Math.max(startFrame - 1, Math.min(endFrame - 1, newFrame))
        if (clampedFrame !== currentFrameRef.current) {
          currentFrameRef.current = clampedFrame
          drawFrame(clampedFrame)
        }
        if (onProgress) onProgress(self.progress)
        if (onFrameChange) onFrameChange(clampedFrame + 1)
      },
    })

    return () => {
      st.kill()
    }
  }, [isLoaded, startFrame, endFrame, scrubDuration, drawFrame, triggerRef, pin, pinSpacing, start, end, onProgress, onFrameChange])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = requestAnimationFrame(() => {
        drawFrame(currentFrameRef.current)
      })
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [drawFrame])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      style={style}
    >
      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-doom-bg">
          <div className="w-48 h-[2px] bg-white/10 overflow-hidden">
            <div
              className="h-full bg-doom-glow transition-all duration-300 ease-out"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <span className="mt-3 font-mono text-[10px] tracking-[0.3em] uppercase text-text-muted">
            Loading Sequence — {loadProgress}%
          </span>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
        aria-hidden="true"
      />

      {/* Overlay content */}
      {overlay && (
        <div className="relative z-10 w-full h-full">
          {overlay}
        </div>
      )}
    </div>
  )
}
