'use client'

interface ParachuteProps {
  /** Owner identifier for styling */
  owner: 'A' | 'B'
  /** Position on the railway */
  position: number
  /** Unit size in pixels for positioning */
  unitSize: number
}

/**
 * Visual representation of a parachute marker on the railway.
 * Shows where each train originally landed.
 */
export function Parachute({ owner, position, unitSize }: ParachuteProps) {
  const color = owner === 'A' ? '#3b82f6' : '#ef4444' // Blue for A, Red for B
  
  return (
    <div
      className="parachute"
      style={{
        position: 'absolute',
        left: position * unitSize,
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bottom: '0',
      }}
    >
      {/* Parachute emoji */}
      <span style={{ fontSize: '20px' }}>🪂</span>
      
      {/* Label */}
      <span
        style={{
          fontSize: '10px',
          color: color,
          fontWeight: 'bold',
          opacity: 0.8,
        }}
      >
        {owner}
      </span>
    </div>
  )
}

