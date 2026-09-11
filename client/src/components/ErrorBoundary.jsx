import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

/**
 * ErrorBoundary — Catches render errors anywhere in child components,
 * logs them, and displays a fallback UI instead of crashing the whole tree.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught an error]:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 sm:px-6 py-16 relative z-10 text-center">
          <div className="max-w-md w-full p-8 doom-btn-clipped bg-doom-bg2 border border-doom-crimson-bright/40 space-y-6 shadow-[0_0_30px_rgba(194,24,7,0.2)]">
            <div className="w-14 h-14 mx-auto rounded-full bg-doom-crimson/20 border border-doom-crimson-bright/40 flex items-center justify-center text-doom-crimson-bright">
              <AlertTriangle size={28} />
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[10px] text-doom-crimson-bright tracking-widest uppercase font-bold">
                CRITICAL PROTOCOL INTERRUPT
              </span>
              <h2 className="font-display text-2xl tracking-wider text-text-primary uppercase font-bold">
                SUBROUTINE FAILURE
              </h2>
              <p className="font-mono text-xs text-text-muted leading-relaxed">
                An unexpected execution fault occurred while rendering this interface.
              </p>
              {this.state.error?.message && (
                <div className="p-3 bg-doom-bg border border-white/10 rounded font-mono text-[11px] text-steel break-all text-left">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 doom-btn-clipped bg-doom-glow hover:bg-white text-doom-bg font-mono text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(30,255,160,0.3)]"
              >
                <RefreshCw size={14} />
                <span>RELOAD INTERFACE</span>
              </button>
              <a
                href="/"
                className="py-3 px-4 doom-btn-clipped bg-white/[0.04] border border-white/10 text-text-muted hover:text-white font-mono text-xs uppercase tracking-widest transition-all text-center"
              >
                HOME
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
