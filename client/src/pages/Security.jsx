import { useState } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'

/**
 * Security Scanner — High-speed QR verification interface.
 * Phase 8: Camera integration and backend verification implemented.
 */
export default function Security() {
  const [manualId, setManualId] = useState('')
  const [scanResult, setScanResult] = useState(null) // null | { status, name, college, message }
  const [isProcessing, setIsProcessing] = useState(false)

  const verifyPass = async (idToVerify) => {
    if (!idToVerify || isProcessing) return
    setIsProcessing(true)
    
    try {
      const res = await fetch(`/api/verify/${idToVerify}`)
      const data = await res.json()
      setScanResult(data)
    } catch (err) {
      setScanResult({ status: 'ERROR', message: 'Network or server error.' })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    verifyPass(manualId.toUpperCase())
  }

  const resetScanner = () => {
    setScanResult(null)
    setManualId('')
  }

  // Result display logic
  let resultBoxClasses = 'border border-brass-dim/20 bg-iron/10 p-6 flex flex-col items-center justify-center gap-4 text-center min-h-[160px]'
  if (scanResult) {
    if (scanResult.status === 'VALID') resultBoxClasses = 'border-2 border-emerald bg-emerald/10 p-6 flex flex-col items-center justify-center gap-2 text-center min-h-[160px]'
    else if (scanResult.status === 'ALREADY_CHECKED_IN') resultBoxClasses = 'border-2 border-brass bg-brass/10 p-6 flex flex-col items-center justify-center gap-2 text-center min-h-[160px]'
    else resultBoxClasses = 'border-2 border-crimson bg-crimson/10 p-6 flex flex-col items-center justify-center gap-2 text-center min-h-[160px]'
  }

  return (
    <div className="min-h-screen bg-charcoal text-bone flex flex-col items-center px-6 py-12 overflow-y-auto">
      <div className="w-full max-w-md space-y-8 pb-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display text-3xl tracking-widest text-brass">Security</h1>
          <p className="font-mono text-steel text-sm mt-2">VECTORS 2026 Gate Scanner</p>
        </div>

        {/* Scanner or Result */}
        {!scanResult ? (
          <div className="space-y-6">
            {/* Live Camera Viewport */}
            <div className="w-full aspect-square border-2 border-brass/40 bg-iron/30 overflow-hidden relative">
              <Scanner
                onScan={(detected) => {
                  if (detected && detected.length > 0 && !isProcessing) {
                    verifyPass(detected[0].rawValue)
                  }
                }}
                onError={(err) => console.log('Scanner error:', err)}
                components={{
                  audio: false,
                  finder: false, // Cleaner UI
                }}
                styles={{
                  container: { width: '100%', height: '100%' },
                  video: { objectFit: 'cover' }
                }}
              />
              {/* Scan Overlay UI */}
              <div className="absolute inset-0 pointer-events-none border-[1px] border-emerald/50 m-8 flex items-center justify-center">
                <span className="font-mono text-emerald/70 text-xs tracking-widest uppercase bg-charcoal/80 px-2 py-1">Align QR Code</span>
              </div>
            </div>

            {/* Manual Input Fallback */}
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-[1px] flex-1 bg-brass-dim/20" />
                <span className="font-mono text-xs text-steel uppercase tracking-widest">OR</span>
                <div className="h-[1px] flex-1 bg-brass-dim/20" />
              </div>
              <input
                type="text"
                placeholder="Enter VEC-XXXXXXXX"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                className="w-full bg-iron/50 border border-brass-dim/30 text-bone px-4 py-3 font-mono text-sm text-center focus:outline-none focus:border-emerald transition-colors duration-300 uppercase tracking-widest"
                id="input-manual-id"
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={!manualId.trim() || isProcessing}
                className="w-full py-4 font-display tracking-widest uppercase bg-emerald text-charcoal hover:bg-emerald-dim disabled:opacity-50 transition-colors duration-300"
                id="btn-verify"
              >
                {isProcessing ? 'Verifying...' : 'Verify Pass'}
              </button>
            </form>
          </div>
        ) : (
          /* Result Area */
          <div className="space-y-6">
            <div className={resultBoxClasses}>
              {scanResult.status === 'VALID' && (
                <>
                  <div className="w-12 h-12 rounded-full bg-emerald/20 flex items-center justify-center mb-2">
                    <span className="text-emerald text-2xl">✓</span>
                  </div>
                  <h2 className="font-display text-2xl tracking-widest text-emerald">APPROVED</h2>
                  <p className="font-mono text-bone text-lg">{scanResult.name}</p>
                  <p className="font-mono text-steel text-sm">{scanResult.college}</p>
                </>
              )}
              
              {scanResult.status === 'ALREADY_CHECKED_IN' && (
                <>
                  <div className="w-12 h-12 rounded-full bg-brass/20 flex items-center justify-center mb-2">
                    <span className="text-brass text-2xl">!</span>
                  </div>
                  <h2 className="font-display text-xl tracking-widest text-brass text-center leading-relaxed">ALREADY CHECKED IN</h2>
                  <p className="font-mono text-bone mt-2">{scanResult.name}</p>
                  <p className="font-mono text-steel text-sm mt-1">Checked in at: {new Date(scanResult.checkInTimestamp).toLocaleTimeString()}</p>
                </>
              )}

              {(scanResult.status === 'INVALID' || scanResult.status === 'ERROR') && (
                <>
                  <div className="w-12 h-12 rounded-full bg-crimson/20 flex items-center justify-center mb-2">
                    <span className="text-crimson text-2xl">✕</span>
                  </div>
                  <h2 className="font-display text-2xl tracking-widest text-crimson">REJECTED</h2>
                  <p className="font-mono text-steel text-sm mt-2">{scanResult.message}</p>
                </>
              )}
            </div>

            <button
              onClick={resetScanner}
              className="w-full py-4 font-display tracking-widest uppercase border border-brass text-brass hover:bg-brass hover:text-charcoal transition-colors duration-300"
              id="btn-scan-next"
            >
              Scan Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
