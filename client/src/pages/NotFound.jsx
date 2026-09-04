import { Link } from 'react-router-dom'
import FaultyTerminal from '../components/ui/FaultyTerminal'

/**
 * 404 — Not Found page with FaultyTerminal background.
 */
export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden bg-[#070707]">
      {/* Background Faulty Terminal */}
      <div className="absolute inset-0 z-0 opacity-40">
        <FaultyTerminal
          scale={1.4}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={0.8}
          pause={false}
          scanlineIntensity={0.6}
          glitchAmount={1.2}
          flickerAmount={0.8}
          noiseAmp={1}
          chromaticAberration={0.4}
          dither={0}
          curvature={0.15}
          tint="#b89c49"
          mouseReact={true}
          mouseStrength={0.4}
          pageLoadAnimation={true}
          brightness={0.85}
        />
      </div>

      {/* Foreground Alert Card */}
      <div className="relative z-10 p-8 sm:p-10 border border-brass-dim/30 bg-charcoal/85 backdrop-blur-md max-w-md w-full shadow-2xl">
        <div className="font-mono text-[10px] tracking-[0.25em] text-brass uppercase mb-2">
          // SYSTEM ANOMALY
        </div>
        <h1 className="font-display text-6xl text-crimson tracking-widest font-bold">404</h1>
        <p className="font-mono text-steel text-sm mt-4 tracking-wider uppercase">
          Sector Not Found // Corrupted Vault Coordinate
        </p>
        <Link
          to="/"
          className="inline-block mt-8 py-3 px-8 font-display text-xs tracking-[0.2em] uppercase border border-brass text-brass hover:bg-brass hover:text-charcoal transition-colors duration-300"
        >
          Return to Monolith
        </Link>
      </div>
    </div>
  )
}
