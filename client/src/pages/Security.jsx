import { useState, useEffect } from 'react'
import { Scanner, useDevices } from '@yudiel/react-qr-scanner'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, Shield, Camera, RefreshCw, AlertTriangle, Flashlight, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

/**
 * Security Scanner — High-speed QR verification interface.
 * Features auto-fallback camera constraints, camera switching, error recovery,
 * torch toggle, and manual pass verification.
 */
export default function Security() {
  const { getToken, logout, user, userRole } = useAuth()
  const navigate = useNavigate()
  const devices = useDevices()

  const [selectedDeviceId, setSelectedDeviceId] = useState('')
  const [manualId, setManualId] = useState('')
  const [scanResult, setScanResult] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [scannerKey, setScannerKey] = useState(0)
  const [selectedDay, setSelectedDay] = useState(1)

  // Auto-detect and prefer back camera
  useEffect(() => {
    if (devices && devices.length > 0 && !selectedDeviceId) {
      const backCam = devices.find(d => 
        d.label?.toLowerCase().includes('back') || 
        d.label?.toLowerCase().includes('rear') ||
        d.label?.toLowerCase().includes('environment')
      )
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
      const res = await fetch(`/api/verify/${idToVerify}?day=${selectedDay}`, {
        method: 'POST',
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

  const handleExit = () => {
    if (userRole === 'admin') {
      navigate('/admin')
    } else {
      navigate('/')
    }
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
    <div className="min-h-screen bg-transparent text-bone flex flex-col items-center px-4 sm:px-6 py-6 sm:py-8 overflow-y-auto">
      <div className="w-full max-w-md space-y-6 pb-12">
        {/* Header with user info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-brass shrink-0" />
            <div className="min-w-0">
              <h1 className="font-display text-lg sm:text-xl tracking-widest text-brass uppercase truncate">Gate Security</h1>
              <p className="font-mono text-steel text-[10px] mt-0.5 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <button
              onClick={handleExit}
              className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-steel hover:text-emerald transition-colors uppercase px-2.5 py-1.5 border border-white/[0.06] bg-iron/20 cursor-pointer"
              title={userRole === 'admin' ? 'Back to Admin Portal' : 'Back to Website'}
            >
              <ArrowLeft size={12} />
              <span>{userRole === 'admin' ? 'Back to Admin' : 'Exit to Site'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-steel hover:text-crimson transition-colors uppercase px-2.5 py-1.5 border border-white/[0.06] bg-iron/20 cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={12} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Festival Day Selector */}
        <div className="grid grid-cols-2 gap-2 bg-iron/40 p-1 border border-white/[0.08]">
          <button
            type="button"
            onClick={() => {
              setSelectedDay(1)
              resetScanner()
            }}
            className={`py-2 text-center font-display text-xs tracking-widest uppercase transition-all duration-200 cursor-pointer ${
              selectedDay === 1
                ? 'bg-emerald text-charcoal font-bold shadow-sm'
                : 'text-steel hover:text-bone hover:bg-white/[0.04]'
            }`}
          >
            DAY 1 SCAN
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedDay(2)
              resetScanner()
            }}
            className={`py-2 text-center font-display text-xs tracking-widest uppercase transition-all duration-200 cursor-pointer ${
              selectedDay === 2
                ? 'bg-emerald text-charcoal font-bold shadow-sm'
                : 'text-steel hover:text-bone hover:bg-white/[0.04]'
            }`}
          >
            DAY 2 SCAN
          </button>
        </div>

        {/* Camera Selector (if multiple cameras detected) */}
        {devices && devices.length > 1 && !scanResult && (
          <div className="flex items-center gap-2 bg-iron/30 border border-white/[0.06] px-3 py-2 min-w-0">
            <Camera size={14} className="text-brass-dim shrink-0" />
            <select
              value={selectedDeviceId}
              onChange={(e) => {
                setSelectedDeviceId(e.target.value)
                setCameraError(null)
                setScannerKey(k => k + 1)
              }}
              className="bg-transparent text-bone font-mono text-xs w-full focus:outline-none cursor-pointer truncate min-w-0"
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
                    video: { width: '100%', height: '100%', objectFit: 'cover' }
                  }}
                />
              )}

              {/* Scanning crosshairs animation overlay */}
              {!cameraError && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-48 border border-brass/30 relative">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald" />
                    <div className="w-full h-0.5 bg-emerald/60 shadow-[0_0_8px_rgba(30,255,160,0.8)] absolute top-0 animate-[scannerLaser_2s_ease-in-out_infinite]" />
                  </div>
                </div>
              )}
            </div>

            {/* Status indicator */}
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-steel">
              <span className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-brass animate-pulse' : 'bg-emerald'}`} />
              <span>{isProcessing ? 'Processing pass...' : `Ready to scan // Day ${selectedDay}`}</span>
            </div>

            {/* Manual ID Input */}
            <form onSubmit={handleManualSubmit} className="space-y-3 pt-2">
              <div className="text-center font-mono text-[10px] text-steel uppercase tracking-wider">
                — Or enter pass ID manually —
              </div>
              <input
                type="text"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                placeholder="VEC-XXXXXXXX"
                className="w-full px-4 py-3 bg-iron/50 border border-white/10 text-bone placeholder-steel/50 font-mono text-center tracking-widest text-sm focus:outline-none focus:border-brass transition-colors duration-300 uppercase"
                id="input-manual-id"
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={!manualId.trim() || isProcessing}
                className="w-full py-4 font-display tracking-widest uppercase bg-emerald text-charcoal hover:bg-emerald-dim disabled:opacity-50 transition-colors duration-300"
                id="btn-verify"
              >
                {isProcessing ? 'Verifying...' : `Verify Pass (Day ${selectedDay})`}
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
                  <h2 className="font-display text-xl sm:text-2xl tracking-widest text-emerald">DAY {selectedDay} APPROVED</h2>
                  <p className="font-mono text-bone text-base sm:text-lg font-bold break-words">{scanResult.name}</p>
                  <p className="font-mono text-steel text-xs sm:text-sm break-words">{scanResult.college}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${
                      scanResult.day1CheckedIn
                        ? 'border-emerald/50 bg-emerald/15 text-emerald'
                        : 'border-white/10 bg-iron/40 text-steel'
                    }`}>
                      Day 1: {scanResult.day1CheckedIn ? 'Checked In' : 'Pending'}
                    </span>
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${
                      scanResult.day2CheckedIn
                        ? 'border-emerald/50 bg-emerald/15 text-emerald'
                        : 'border-white/10 bg-iron/40 text-steel'
                    }`}>
                      Day 2: {scanResult.day2CheckedIn ? 'Checked In' : 'Pending'}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] text-emerald/80 tracking-wider uppercase mt-1">Pass Verified • Entry Granted</span>
                </>
              )}
              
              {scanResult.status === 'ALREADY_CHECKED_IN' && (
                <>
                  <div className="w-12 h-12 rounded-full bg-brass/20 flex items-center justify-center mb-2">
                    <span className="text-brass text-2xl font-bold">!</span>
                  </div>
                  <h2 className="font-display text-lg sm:text-xl tracking-widest text-brass text-center leading-relaxed">ALREADY CHECKED IN (DAY {selectedDay})</h2>
                  <p className="font-mono text-bone mt-2 font-bold text-base sm:text-lg break-words">{scanResult.name}</p>
                  <p className="font-mono text-steel text-xs sm:text-sm mt-1 break-words">
                    {scanResult.message || `Checked in at: ${scanResult.checkInTimestamp ? new Date(scanResult.checkInTimestamp).toLocaleTimeString() : 'Earlier today'}`}
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${
                      scanResult.day1CheckedIn
                        ? 'border-emerald/50 bg-emerald/15 text-emerald'
                        : 'border-white/10 bg-iron/40 text-steel'
                    }`}>
                      Day 1: {scanResult.day1CheckedIn ? 'Checked In' : 'Not Checked In'}
                    </span>
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${
                      scanResult.day2CheckedIn
                        ? 'border-emerald/50 bg-emerald/15 text-emerald'
                        : 'border-white/10 bg-iron/40 text-steel'
                    }`}>
                      Day 2: {scanResult.day2CheckedIn ? 'Checked In' : 'Not Checked In'}
                    </span>
                  </div>
                </>
              )}

              {(scanResult.status === 'INVALID' || scanResult.status === 'ERROR') && (
                <>
                  <div className="w-12 h-12 rounded-full bg-crimson/20 flex items-center justify-center mb-2">
                    <span className="text-crimson text-2xl font-bold">✕</span>
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl tracking-widest text-crimson">REJECTED</h2>
                  <p className="font-mono text-steel text-xs sm:text-sm mt-2 break-words">{scanResult.message || 'Pass ID not found or invalid.'}</p>
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
