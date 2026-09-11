/**
 * PageLoading — Cyberpunk/Terminal style loading indicator for Suspense boundaries
 */
export default function PageLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 py-12">
      <div className="w-8 h-8 rounded-full border-2 border-emerald/20 border-t-emerald animate-spin" />
      <span className="font-mono text-xs uppercase tracking-widest text-steel/60">
        INITIALIZING SUBROUTINE...
      </span>
    </div>
  )
}
