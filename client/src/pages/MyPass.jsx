import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'

/**
 * My Pass — Displays the user's digital entry pass with QR code.
 * Phase 8: QR Code generation added.
 */
export default function MyPass() {
  const [pass, setPass] = useState(null)

  useEffect(() => {
    const savedPass = localStorage.getItem('vectorsPass')
    if (savedPass) {
      setPass(JSON.parse(savedPass))
    }
  }, [])

  if (!pass) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h2 className="font-display text-2xl tracking-widest text-steel">No Pass Found</h2>
        <p className="font-mono text-sm text-steel/70 mt-2 mb-6">
          You haven't registered for a VECTORS 2026 pass yet on this device.
        </p>
        <Link
          to="/entry-registration"
          className="py-3 px-8 font-display tracking-widest uppercase bg-emerald text-charcoal hover:bg-emerald-dim transition-colors duration-300"
        >
          Get Your Pass
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-20 pb-12">
      <div className="w-full max-w-sm border border-brass/40 bg-iron/30 p-5 sm:p-8 flex flex-col items-center gap-6">
        {/* Pass Header */}
        <h2 className="font-display text-lg sm:text-xl tracking-widest text-brass uppercase">Entry Pass</h2>

        {/* Generated QR Code */}
        <div className="bg-bone p-3 sm:p-4 border border-brass-dim/20 max-w-full flex items-center justify-center">
          <QRCodeSVG 
            value={pass.registrationId} 
            size={165}
            className="w-36 h-36 sm:w-44 sm:h-44"
            bgColor="#e2dfd8" // bone
            fgColor="#1a1a1a" // charcoal
            level="H"
          />
        </div>

        {/* Pass Details */}
        <div className="w-full space-y-3 font-mono text-xs sm:text-sm">
          <div className="flex justify-between items-center gap-3 border-b border-brass-dim/20 pb-2">
            <span className="text-steel shrink-0">ID</span>
            <span className="text-emerald font-bold truncate max-w-[190px] text-right" title={pass.registrationId}>{pass.registrationId}</span>
          </div>
          <div className="flex justify-between items-center gap-3 border-b border-brass-dim/20 pb-2">
            <span className="text-steel shrink-0">Name</span>
            <span className="text-bone truncate max-w-[190px] text-right" title={pass.name}>{pass.name}</span>
          </div>
          <div className="flex justify-between items-center gap-3 border-b border-brass-dim/20 pb-2">
            <span className="text-steel shrink-0">College</span>
            <span className="text-bone truncate max-w-[190px] text-right" title={pass.college}>{pass.college}</span>
          </div>
        </div>

        {/* Status */}
        <div className="w-full py-2.5 sm:py-3 text-center font-display tracking-widest uppercase text-xs sm:text-sm bg-emerald/10 text-emerald border border-emerald/30">
          {pass.status}
        </div>
      </div>
    </div>
  )
}
