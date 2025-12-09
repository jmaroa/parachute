'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import { Railway } from './Railway'
import { createSimulation, simulateStep, type SimulationState } from '@/lib/simulation'

interface SimulationProps {
  /** Initial distance between trains */
  initialDistance?: number
}

/**
 * Main simulation component with controls and visualization.
 */
export function Simulation({ initialDistance = 5 }: SimulationProps) {
  const [distance, setDistance] = useState(initialDistance)
  const [state, setState] = useState<SimulationState>(() => createSimulation(distance))
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(500) // ms between steps
  
  // Reset simulation when distance changes
  const handleReset = useCallback(() => {
    setState(createSimulation(distance))
    setIsPlaying(false)
  }, [distance])
  
  // Single step
  const handleStep = useCallback(() => {
    if (!state.hasCollided) {
      setState(prev => simulateStep(prev))
    }
  }, [state.hasCollided])
  
  // Auto-play loop
  useEffect(() => {
    if (!isPlaying || state.hasCollided) return
    
    const interval = setInterval(() => {
      setState(prev => simulateStep(prev))
    }, speed)
    
    return () => clearInterval(interval)
  }, [isPlaying, speed, state.hasCollided])
  
  // Stop playing when collision occurs
  useEffect(() => {
    if (state.hasCollided) {
      setIsPlaying(false)
    }
  }, [state.hasCollided])
  
  return (
    <div className="simulation">
      {/* Header */}
      <div className="simulation-header" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
          🚂 Parachute Trains Puzzle 🪂
        </h2>
        <p style={{ color: '#888', fontSize: '14px' }}>
          Two trains must find each other using the same algorithm
        </p>
      </div>
      
      {/* Railway visualization */}
      <Railway state={state} />
      
      {/* Status bar */}
      <div 
        className="simulation-status"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          margin: '20px 0',
          padding: '12px',
          backgroundColor: '#1a1a2e',
          borderRadius: '8px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#888' }}>Steps</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{state.stepCount}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#888' }}>Train A</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
            {state.trainA.position}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#888' }}>Train B</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
            {state.trainB.position}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#888' }}>Status</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {state.hasCollided ? (
              <span style={{ color: '#22c55e' }}>💥 COLLISION!</span>
            ) : state.trainA.isWaiting || state.trainB.isWaiting ? (
              <span style={{ color: '#fbbf24' }}>⏳ Waiting...</span>
            ) : (
              <span style={{ color: '#888' }}>🔍 Searching</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div 
        className="simulation-controls"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        {/* Playback controls */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={state.hasCollided}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: isPlaying ? '#ef4444' : '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: state.hasCollided ? 'not-allowed' : 'pointer',
              opacity: state.hasCollided ? 0.5 : 1,
            }}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          
          <button
            onClick={handleStep}
            disabled={state.hasCollided || isPlaying}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: (state.hasCollided || isPlaying) ? 'not-allowed' : 'pointer',
              opacity: (state.hasCollided || isPlaying) ? 0.5 : 1,
            }}
          >
            <SkipForward size={20} />
            Step
          </button>
          
          <button
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={20} />
            Reset
          </button>
        </div>
        
        {/* Settings */}
        <div 
          style={{ 
            display: 'flex', 
            gap: '24px', 
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {/* Distance setting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#888' }}>Distance:</label>
            <input
              type="range"
              min="1"
              max="20"
              value={distance}
              onChange={(e) => {
                const newDist = parseInt(e.target.value)
                setDistance(newDist)
                setState(createSimulation(newDist))
                setIsPlaying(false)
              }}
              style={{ width: '100px' }}
            />
            <span style={{ minWidth: '30px', fontWeight: 'bold' }}>{distance}</span>
          </div>
          
          {/* Speed setting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#888' }}>Speed:</label>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={1050 - speed}
              onChange={(e) => setSpeed(1050 - parseInt(e.target.value))}
              style={{ width: '100px' }}
            />
            <span style={{ fontSize: '12px', color: '#888' }}>
              {speed < 200 ? 'Fast' : speed < 500 ? 'Normal' : 'Slow'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Collision celebration */}
      {state.hasCollided && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            marginTop: '24px',
            padding: '20px',
            backgroundColor: '#22c55e20',
            border: '2px solid #22c55e',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎉 Success! 🎉</div>
          <div style={{ color: '#22c55e' }}>
            Trains collided at position <strong>{state.collisionPosition}</strong> after{' '}
            <strong>{state.stepCount}</strong> steps
          </div>
        </motion.div>
      )}
    </div>
  )
}

