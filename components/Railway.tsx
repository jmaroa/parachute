'use client'

import { useRef, useEffect } from 'react'
import { Train } from './Train'
import { Parachute } from './Parachute'
import type { SimulationState } from '@/lib/simulation'

interface RailwayProps {
  /** Current simulation state */
  state: SimulationState
  /** Unit size in pixels */
  unitSize?: number
}

/**
 * Visual representation of the infinite railway line.
 * Shows trains, parachutes, and track markings.
 */
export function Railway({ state, unitSize = 40 }: RailwayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Calculate viewport bounds based on train positions
  const minPos = Math.min(
    state.trainA.position,
    state.trainB.position,
    state.trainA.parachutePosition,
    state.trainB.parachutePosition
  ) - 3
  
  const maxPos = Math.max(
    state.trainA.position,
    state.trainB.position,
    state.trainA.parachutePosition,
    state.trainB.parachutePosition
  ) + 3
  
  // Calculate the center point for the viewport
  const centerPos = (state.trainA.position + state.trainB.position) / 2
  
  // Auto-scroll to keep trains in view
  useEffect(() => {
    if (containerRef.current) {
      const scrollX = (centerPos - minPos) * unitSize - containerRef.current.clientWidth / 2
      containerRef.current.scrollLeft = Math.max(0, scrollX)
    }
  }, [centerPos, minPos, unitSize])
  
  // Generate track markings
  const trackMarks = []
  for (let i = minPos; i <= maxPos; i++) {
    trackMarks.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          left: (i - minPos) * unitSize,
          bottom: '17px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Track tie */}
        <div
          style={{
            width: '4px',
            height: '12px',
            backgroundColor: '#4a4a4a',
            marginBottom: '8px',
          }}
        />
        {/* Position number */}
        <span
          style={{
            fontSize: '11px',
            color: '#888',
            fontWeight: '500',
          }}
        >
          {i}
        </span>
      </div>
    )
  }
  
  const trackWidth = (maxPos - minPos + 1) * unitSize
  
  return (
    <div
      ref={containerRef}
      className="railway-container"
      style={{
        width: '100%',
        overflowX: 'auto',
        backgroundColor: '#1a1a2e',
        borderRadius: '8px',
        padding: '20px',
        position: 'relative',
      }}
    >
      <div
        className="railway-track"
        style={{
          position: 'relative',
          height: '150px',
          minWidth: `${trackWidth}px`,
        }}
      >
        {/* Railway track line */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: '50px',
            height: '4px',
            backgroundColor: '#666',
            borderRadius: '2px',
          }}
        />
        
        {/* Track markings */}
        {trackMarks}
        
        {/* Parachutes layer (below trains) */}
        <div style={{ position: 'absolute', bottom: '55px', left: 0 }}>
          <Parachute 
            owner="A" 
            position={state.trainA.parachutePosition - minPos} 
            unitSize={unitSize} 
          />
          <Parachute 
            owner="B" 
            position={state.trainB.parachutePosition - minPos} 
            unitSize={unitSize} 
          />
        </div>
        
        {/* Trains layer */}
        <div style={{ position: 'absolute', bottom: '60px', left: 0 }}>
          <Train
            id="A"
            position={state.trainA.position - minPos}
            isWaiting={state.trainA.isWaiting}
            unitSize={unitSize}
          />
          <Train
            id="B"
            position={state.trainB.position - minPos}
            isWaiting={state.trainB.isWaiting}
            unitSize={unitSize}
          />
        </div>
        
        {/* Collision indicator */}
        {state.hasCollided && (
          <div
            style={{
              position: 'absolute',
              left: (state.collisionPosition! - minPos) * unitSize,
              bottom: '100px',
              transform: 'translateX(-50%)',
              fontSize: '24px',
              animation: 'pulse 0.5s infinite',
            }}
          >
            💥
          </div>
        )}
      </div>
    </div>
  )
}

