import { useState, useEffect } from 'react'
import { Scanner, useDevices } from '@yudiel/react-qr-scanner'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, Shield, Camera, RefreshCw, AlertTriangle, Flashlight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

/**
 * Security Scanner — High-speed QR verification interface.
 * Features auto-fallback camera constraints, camera switching, error recovery,
 * torch toggle, and manual pass verification.
 */
export default function Security() {
  const { getToken, logout, user } = useAuth()
  const navigate = useNavigate()
  const devices = useDevices()

  const [selectedDeviceId, setSelectedDeviceId] = useState('')
  const [manualId, setManualId] = useState('')
  const [scanResult, setScanResult] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [scannerKey, setScannerKey] = useState(0)

  // Auto-select preferred camera if devices change
  useEffect(() => {
    if (devices && devices.length > 0 && !selectedDeviceId) {
      // Prefer back camera if label mentions back / environment
      const backCam = devices.find(d => d.label?.toLowerCase().includes('back') || d.label?.toLowerCase().includes('rear'))
      if (backCam) {
        setSelectedDeviceId(backCam.deviceId)
      }
    }
  }, [devices, selectedDeviceId])

  const verifyPass = async (idToVerify) => {
    if (!idToVerify || isProcessing) return
    setIsProcessing(true)

    try {
      const token = await getToken()
      const res = await fetch(`/api/verify/${idToVerify}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
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

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleScannerError = (err) => {
    console.error('[Scanner Error]', err)
    const msg = err?.message || String(err)
    if (!window.isSecureContext) {
      setCameraError('Camera access requires HTTPS or localhost. If on a phone, access via localhost port forwarding or HTTPS.')
    } else if (msg.includes('Permission') || msg.includes('NotAllowedError') || msg.includes('denied')) {
      setCameraError('Camera permission was denied. Please allow camera permissions in your browser address bar.')
    } else if (msg.includes('OverconstrainedError') || msg.includes('NotFound')) {
      setCameraError('Selected camera is not available. Try switching cameras below.')
    } else if (msg.includes('NotReadableError') || msg.includes('in use')) {
      setCameraError('Camera is currently in use by another application. Please close other apps using the webcam.')
    } else {
      setCameraError(msg || 'Failed to initialize camera.')
    }
  }

  const requestCameraAccess = async () => {
    setCameraError(null)
    try {
      if (navigator?.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach(t => t.stop())
      }
      setScannerKey(prev => prev + 1)
    } catch (err) {
      handleScannerError(err)
    }
  }

  // Result display styles
  let resultBoxClasses = 'border border-brass-dim/20 bg-iron/10 p-6 flex flex-col items-center justify-center gap-4 text-center min-h-[160px]'
  if (scanResult) {
    if (scanResult.status === 'VALID') resultBoxClasses = 'border-2 border-emerald bg-emerald/10 p-6 flex flex-col items-center justify-center gap-2 text-center min-h-[160px]'
    else if (scanResult.status === 'ALREADY_CHECKED_IN') resultBoxClasses = 'border-2 border-brass bg-brass/10 p-6 flex flex-col items-center justify-center gap-2 text-center min-h-[160px]'
    else resultBoxClasses = 'border-2 border-crimson bg-crimson/10 p-6 flex flex-col items-center justify-center gap-2 text-center min-h-[160px]'
  }

  return (
    <div className="min-h-screen bg-charcoal text-bone flex flex-col items-center px-6 py-8 overflow-y-auto">
      <div className="w-full max-w-md space-y-6 pb-12">
        {/* Header with user info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-brass" />
            <div>
              <h1 className="font-display text-xl tracking-widest text-brass uppercase">Gate Security</h1>
              <p className="font-mono text-steel text-[10px] mt-0.5">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-steel hover:text-crimson transition-colors uppercase px-2.5 py-1.5 border border-white/[0.06] bg-iron/20"
          >
            <LogOut size={12} />
            Exit
          </button>
        </div>

        {/* Camera Selector (if multiple cameras detected) */}
        {devices && devices.length > 1 && !scanResult && (
          <div className="flex items-center gap-2 bg-iron/30 border border-white/[0.06] px-3 py-2">
            <Camera size={14} className="text-brass-dim shrink-0" />
            <select
              value={selectedDeviceId}
              onChange={(e) => {
                setSelectedDeviceId(e.target.value)
                setCameraError(null)
                setScannerKey(k => k + 1)
              }}
              className="bg-transparent text-bone font-mono text-xs w-full focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-charcoal">Auto (Prefer Back Camera)</option>
              {devices.map((device, idx) => (
                <option key={device.deviceId} value={device.deviceId} className="bg-charcoal">
                  {device.label || `Camera ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Scanner or Result */}
        {!scanResult ? (
          <div className="space-y-6">
            {/* Live Camera Viewport */}
            <div className="w-full aspect-square border-2 border-brass/40 bg-iron/30 overflow-hidden relative flex items-center justify-center">
              
              {/* Camera Error / Permission Blocked Overlay */}
              {cameraError ? (
                <div className="absolute inset-0 z-20 bg-charcoal/95 p-6 flex flex-col items-center justify-center text-center gap-3">
                  <AlertTriangle size={32} className="text-brass" />
                  <h3 className="font-display text-sm tracking-wider text-bone uppercase">Camera Access Required</h3>
                  <p className="font-mono text-[11px] text-steel/80 leading-relaxed max-w-xs">
                    {cameraError}
                  </p>
                  <button
                    onClick={requestCameraAccess}
                    className="mt-2 px-4 py-2.5 bg-emerald text-charcoal font-mono text-xs tracking-wider uppercase flex items-center gap-2 hover:bg-emerald-dim transition-colors"
                  >
                    <RefreshCw size={13} /> Allow / Retry Camera
                  </button>
                </div>
              ) : (
                <Scanner
                  key={scannerKey}
                  onScan={(detected) => {
                    if (detected && detected.length > 0 && !isProcessing) {
                      const val = detected[0].rawValue
                      if (val) verifyPass(val)
                    }
                  }}
                  onError={handleScannerError}
                  constraints={
                    selectedDeviceId
                      ? { deviceId: { exact: selectedDeviceId } }
                      : { facingMode: { ideal: 'environment' } }
                  }
                  sound={false}
                  components={{
                    finder: false,
                    torch: true,
                  }}
                  styles={{
                    container: { width: '100%', height: '100%' },
                    video: { objectFit: 'cover', width: '100%', height: '100%' }
                  }}
                />
              )}

              {/* Scan Overlay UI */}
              {!cameraError && (
                <div className="absolute inset-0 pointer-events-none border-[1px] border-emerald/50 m-8 flex items-center justify-center">
                  <span className="font-mono text-emerald/80 text-xs tracking-widest uppercase bg-charcoal/80 px-2.5 py-1 border border-emerald/30">
                    Align QR Code
                  </span>
                </div>
              )}
            </div>

            {/* Manual Input Fallback */}
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-[1px] flex-1 bg-brass-dim/20" />
                <span className="font-mono text-xs text-steel uppercase tracking-widest">OR ENTER ID</span>
                <div className="h-[1px] flex-1 bg-brass-dim/20" />
              </div>
              <input
                type="text"
                placeholder="VEC-XXXXXXXX"
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
                    <span className="text-emerald text-2xl font-bold">✓</span>
                  </div>
                  <h2 className="font-display text-2xl tracking-widest text-emerald">APPROVED</h2>
                  <p className="font-mono text-bone text-lg font-bold">{scanResult.name}</p>
                  <p className="font-mono text-steel text-sm">{scanResult.college}</p>
                  <span className="font-mono text-[10px] text-emerald/80 tracking-wider uppercase mt-1">Pass Verified • Entry Granted</span>
                </>
              )}
              
              {scanResult.status === 'ALREADY_CHECKED_IN' && (
                <>
                  <div className="w-12 h-12 rounded-full bg-brass/20 flex items-center justify-center mb-2">
                    <span className="text-brass text-2xl font-bold">!</span>
                  </div>
                  <h2 className="font-display text-xl tracking-widest text-brass text-center leading-relaxed">ALREADY CHECKED IN</h2>
                  <p className="font-mono text-bone mt-2 font-bold">{scanResult.name}</p>
                  <p className="font-mono text-steel text-sm mt-1">
                    Checked in at: {scanResult.checkInTimestamp ? new Date(scanResult.checkInTimestamp).toLocaleTimeString() : 'Earlier today'}
                  </p>
                </>
              )}

              {(scanResult.status === 'INVALID' || scanResult.status === 'ERROR') && (
                <>
                  <div className="w-12 h-12 rounded-full bg-crimson/20 flex items-center justify-center mb-2">
                    <span className="text-crimson text-2xl font-bold">✕</span>
                  </div>
                  <h2 className="font-display text-2xl tracking-widest text-crimson">REJECTED</h2>
                  <p className="font-mono text-steel text-sm mt-2">{scanResult.message || 'Pass ID not found or invalid.'}</p>
                </>
              )}
            </div>

            <button
              onClick={resetScanner}
              className="w-full py-4 font-display tracking-widest uppercase border border-brass text-brass hover:bg-brass hover:text-charcoal transition-colors duration-300"
              id="btn-scan-next"
            >
              Scan Next Pass
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
