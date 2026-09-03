/**
 * My Pass — Displays the user's digital entry pass with QR code.
 * Phase 7: Functional scaffold. Full arcane visual treatment in Phase 9.
 */
export default function MyPass() {
  // TODO: Fetch user's registration from backend using auth token
  const mockPass = {
    registrationId: 'VEC-849201',
    name: 'John Doe',
    college: 'MIT',
    status: 'VERIFIED',
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
      <div className="w-full max-w-sm border border-brass/40 bg-iron/30 p-8 flex flex-col items-center gap-6">
        {/* Pass Header */}
        <h2 className="font-display text-xl tracking-widest text-brass">Entry Pass</h2>

        {/* QR Code Placeholder */}
        <div className="w-48 h-48 bg-bone flex items-center justify-center">
          <span className="text-charcoal font-mono text-xs">[QR Code — Phase 8]</span>
        </div>

        {/* Pass Details */}
        <div className="w-full space-y-3 font-mono text-sm">
          <div className="flex justify-between border-b border-brass-dim/20 pb-2">
            <span className="text-steel">ID</span>
            <span className="text-emerald">{mockPass.registrationId}</span>
          </div>
          <div className="flex justify-between border-b border-brass-dim/20 pb-2">
            <span className="text-steel">Name</span>
            <span className="text-bone">{mockPass.name}</span>
          </div>
          <div className="flex justify-between border-b border-brass-dim/20 pb-2">
            <span className="text-steel">College</span>
            <span className="text-bone">{mockPass.college}</span>
          </div>
        </div>

        {/* Status */}
        <div className="w-full py-3 text-center font-display tracking-widest uppercase text-sm bg-emerald/10 text-emerald border border-emerald/30">
          {mockPass.status}
        </div>
      </div>
    </div>
  )
}
