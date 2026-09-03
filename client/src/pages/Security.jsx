/**
 * Security Scanner — High-speed QR verification interface.
 * This page lives outside the main Layout (no Navbar / Footer).
 * Phase 7: Functional scaffold. Camera integration in Phase 8.
 */
export default function Security() {
  return (
    <div className="min-h-screen bg-charcoal text-bone flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl tracking-widest text-brass">Security</h1>
          <p className="font-mono text-steel text-sm mt-2">VECTORS 2026 Gate Scanner</p>
        </div>

        {/* Scanner Viewport Placeholder */}
        <div className="w-full aspect-square border-2 border-brass/40 bg-iron/30 flex items-center justify-center">
          <div className="text-center">
            <span className="font-mono text-steel text-sm">[Camera Feed — Phase 8]</span>
            <p className="font-mono text-xs text-steel/50 mt-2">QR Scanner will appear here</p>
          </div>
        </div>

        {/* Manual Input Fallback */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter VEC-XXXXXXXX"
            className="w-full bg-iron/50 border border-brass-dim/30 text-bone px-4 py-3 font-mono text-sm text-center focus:outline-none focus:border-emerald transition-colors duration-300 uppercase tracking-widest"
            id="input-manual-id"
          />
          <button
            className="w-full py-4 font-display tracking-widest uppercase bg-emerald text-charcoal hover:bg-emerald-dim transition-colors duration-300"
            id="btn-verify"
          >
            Verify
          </button>
        </div>

        {/* Result Area Placeholder */}
        <div className="border border-brass-dim/20 bg-iron/10 p-6 min-h-[120px] flex items-center justify-center">
          <span className="font-mono text-steel/50 text-sm">Scan result will appear here</span>
        </div>
      </div>
    </div>
  )
}
