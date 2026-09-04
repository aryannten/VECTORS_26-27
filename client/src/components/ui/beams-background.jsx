import React, { useRef, useEffect } from "react";
import { cn } from "../../lib/utils";

const HolographicBeams = ({
  className,
  density = 15,
  speed = 1.5,
  aberration = 3,
  opacity = 60,
  style,
  ...props
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = container.offsetWidth;
    let height = container.offsetHeight;
    let time = 0;
    let animationFrameId;

    const noise = (x, t) => {
      return (
        Math.sin(x * 0.01 + t) +
        Math.sin(x * 0.03 + t * 2) * 0.5 +
        Math.sin(x * 0.1 + t * 4) * 0.25
      ) / 1.75; 
    };

    const resize = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const drawBeam = (x, t, color, widthMod) => {
      const n = noise(x, t * 0.5);
      const beamHeight = height * (0.6 + n * 0.4); 
      const beamWidth = (width / density) * widthMod;

      const gradient = ctx.createLinearGradient(x, height, x, height - beamHeight);
      gradient.addColorStop(0, color); 
      gradient.addColorStop(1, "transparent"); 

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(x - beamWidth / 2, height);
      ctx.lineTo(x + beamWidth / 2, height);
      ctx.lineTo(x + beamWidth, height - beamHeight);
      ctx.lineTo(x - beamWidth, height - beamHeight);
      ctx.fill();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "screen"; 

      time += 0.01 * speed;
      const beamWidth = width / density;

      for (let i = 0; i <= density; i++) {
        const x = i * beamWidth;
        
        // Red Channel
        const rAlpha = (opacity / 100) * (0.5 + 0.5 * Math.cos(i * 0.5 + time));
        drawBeam(
            x - aberration, 
            time + i * 0.1, 
            `rgba(0, 255, 102, ${rAlpha * 0.3})`, // Switched to emerald base
            1.5
        );

        // Blue Channel
        const bAlpha = (opacity / 100) * (0.5 + 0.5 * Math.sin(i * 0.6 + time * 1.1));
        drawBeam(
            x + aberration, 
            time + i * 0.12 + 10, 
            `rgba(212, 175, 55, ${bAlpha * 0.3})`, // Switched to brass base
            1.5
        );

        // Core
        const coreAlpha = (opacity / 100) * (0.6 + 0.4 * Math.sin(i * 0.3 - time));
        drawBeam(
            x, 
            time + i * 0.1 + 5, 
            `rgba(255, 255, 255, ${coreAlpha * 0.15})`, 
            0.8 
        );
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density, speed, aberration, opacity]);

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 z-0 overflow-hidden bg-charcoal pointer-events-none", className)}
      style={style}
      {...props}
    >
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full filter blur-[4px]" 
      />
      <div 
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]"
        style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,1) 50%), linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06))",
            backgroundSize: "100% 4px, 3px 100%"
        }}
      />
      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0a_100%)]" />
    </div>
  );
};

export default HolographicBeams;
