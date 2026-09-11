import React from 'react'
import DoomButton from './DoomButton'

/**
 * SpecularButton — Seamless drop-in proxying to the new high-end DoomButton system.
 * Guarantees zero regressions across existing code while delivering the new tactical aesthetic.
 */
export default function SpecularButton({
  variant = 'doom',
  ...props
}) {
  return <DoomButton variant={variant} {...props} />
}

export { DoomButton }
