'use client'

import { motion } from 'framer-motion'
import { Train as TrainIcon } from 'lucide-react'

interface TrainProps {
  /** Train identifier for styling */
  id: 'A' | 'B'
  /** Whether the train is waiting at a foreign parachute */
  isWaiting: boolean
  /** Position on the railway (used for animation) */
  position: number
  /** Unit size in pixels for positioning */
  unitSize: number
}

/**
 * Visual representation of a train on the railway.
 * Uses Framer Motion for smooth position animations.
 */
export function Train({ id, isWaiting, position, unitSize }: TrainProps) {
  const color = id === 'A' ? '#3b82f6' : '#ef4444' // Blue for A, Red for B
  
  return (
    <motion.div
      className="train"
      initial={false}
      animate={{ 
        x: position * unitSize,
        scale: isWaiting ? [1, 1.1, 1] : 1,
      }}
      transition={{ 
        x: { type: 'spring', stiffness: 300, damping: 30 },
        scale: { repeat: isWaiting ? Infinity : 0, duration: 0.5 }
      }}
      style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: 'translateX(-50%)',
      }}
    >
      {/* Train label */}
      <span 
        className="train-label"
        style={{ 
          fontSize: '12px', 
          fontWeight: 'bold',
          color: color,
          marginBottom: '4px',
        }}
      >
        {id}
      </span>
      
      {/* Train icon */}
      <div
        style={{
          backgroundColor: color,
          borderRadius: '4px',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isWaiting 
            ? `0 0 20px ${color}` 
            : `0 2px 8px rgba(0,0,0,0.3)`,
        }}
      >
        <TrainIcon size={24} color="white" />
      </div>
      
      {/* Waiting indicator */}
      {isWaiting && (
        <motion.span
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: '10px',
            color: '#fbbf24',
            marginTop: '4px',
            fontWeight: 'bold',
          }}
        >
          WAITING
        </motion.span>
      )}
    </motion.div>
  )
}

