import { cn } from '../../lib/utils'

/**
 * Base Skeleton block with emerald-tinted cyberpunk pulse
 */
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded bg-[#171A1E] border border-white/5 relative overflow-hidden',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-linear-to-r before:from-transparent before:via-white/4 before:to-transparent',
        className
      )}
      {...props}
    />
  )
}

/**
 * EventCardSkeleton
 * Placeholder card mirroring the exact geometry of an event card in the discovery grid.
 */
export function EventCardSkeleton() {
  return (
    <div className="flex flex-col justify-between p-6 bg-[#0E1114] border border-white/10 rounded-none relative overflow-hidden h-85">
      {/* Top Meta Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24 bg-doom-glow/10 border-doom-glow/20" />
          <Skeleton className="h-4 w-16" />
        </div>
        {/* Title */}
        <Skeleton className="h-7 w-3/4 mt-2" />
        {/* Description lines */}
        <Skeleton className="h-4 w-full mt-3" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Details & Tags */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        {/* Action button skeleton */}
        <Skeleton className="h-10 w-full rounded-none bg-white/5 border-white/10" />
      </div>
    </div>
  )
}

/**
 * TableSkeleton
 * Skeleton placeholder rows for Admin and Security tables.
 */
export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="w-full space-y-2">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="flex items-center gap-4 p-4 bg-[#121519] border border-white/5">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <Skeleton
              key={cIdx}
              className={cn(
                'h-4',
                cIdx === 0 ? 'w-12' : cIdx === 1 ? 'w-1/3' : 'w-1/6'
              )}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Skeleton
