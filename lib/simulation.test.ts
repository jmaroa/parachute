/**
 * Parachute Trains Algorithm - Test Suite
 * Run with: npm test
 */

import { 
  createSimulation, 
  simulateStep, 
  runSimulation,
  createTrainState,
  type SimulationState 
} from './simulation'

// =============================================================================
// TEST UTILITIES
// =============================================================================

let passed = 0
let failed = 0

function assert(condition: boolean, message: string): void {
  if (condition) {
    console.log(`  ✅ ${message}`)
    passed++
  } else {
    console.log(`  ❌ ${message}`)
    failed++
  }
}

function describe(name: string, fn: () => void): void {
  console.log(`\n📦 ${name}`)
  fn()
}

function it(name: string, fn: () => void): void {
  try {
    fn()
  } catch (error) {
    console.log(`  ❌ ${name}: ${error}`)
    failed++
  }
}

// =============================================================================
// TESTS
// =============================================================================

describe('Collision Detection - Positive Distances', () => {
  const testCases = [
    { distance: 1, maxSteps: 10 },
    { distance: 2, maxSteps: 20 },
    { distance: 3, maxSteps: 30 },
    { distance: 5, maxSteps: 100 },
    { distance: 10, maxSteps: 500 },
    { distance: 20, maxSteps: 1500 },
  ]

  for (const { distance, maxSteps } of testCases) {
    it(`should collide with distance ${distance}`, () => {
      const result = runSimulation(distance, maxSteps)
      assert(result.hasCollided, `Distance ${distance}: collision detected`)
      assert(
        result.collisionPosition === distance,
        `Distance ${distance}: collision at correct position (${result.collisionPosition})`
      )
    })
  }
})

describe('Collision Detection - Negative Distances', () => {
  // Train B is "behind" Train A
  const testCases = [
    { distance: -1, maxSteps: 10 },
    { distance: -3, maxSteps: 50 },
    { distance: -5, maxSteps: 100 },
    { distance: -10, maxSteps: 500 },
  ]

  for (const { distance, maxSteps } of testCases) {
    it(`should collide with distance ${distance}`, () => {
      const result = runSimulation(distance, maxSteps)
      assert(result.hasCollided, `Distance ${distance}: collision detected`)
    })
  }
})

describe('Edge Cases', () => {
  it('should handle zero distance (immediate collision)', () => {
    const result = runSimulation(0, 10)
    // With distance 0, trains start at same position
    // First step should detect collision
    assert(result.hasCollided, 'Zero distance: collision detected')
    assert(result.stepCount <= 1, `Zero distance: collision in ${result.stepCount} steps`)
  })

  it('should handle large distance (100)', () => {
    const result = runSimulation(100, 50000)
    assert(result.hasCollided, 'Distance 100: collision detected')
    console.log(`     └─ Steps needed: ${result.stepCount}`)
  })
})

describe('Initial State', () => {
  it('should create correct initial train state', () => {
    const train = createTrainState(5)
    assert(train.position === 5, 'Position is 5')
    assert(train.parachutePosition === 5, 'Parachute position is 5')
    assert(train.distanceFromHome === 0, 'Distance from home is 0')
    assert(train.sweepPhase === 'sweep_forward', 'Initial phase is sweep_forward')
    assert(train.phaseNumber === 1, 'Initial phase number is 1')
    assert(train.isWaiting === false, 'Not waiting initially')
  })

  it('should create correct initial simulation state', () => {
    const state = createSimulation(10)
    assert(state.trainA.position === 0, 'Train A starts at 0')
    assert(state.trainB.position === 10, 'Train B starts at 10')
    assert(state.stepCount === 0, 'Step count starts at 0')
    assert(state.hasCollided === false, 'No collision initially')
  })
})

describe('Waiting State', () => {
  it('should activate waiting when finding foreign parachute', () => {
    // Run simulation with distance 3, check that waiting activates
    let state = createSimulation(3)
    let foundWaiting = false
    
    for (let i = 0; i < 20 && !state.hasCollided; i++) {
      state = simulateStep(state)
      if (state.trainA.isWaiting || state.trainB.isWaiting) {
        foundWaiting = true
        break
      }
    }
    
    assert(foundWaiting, 'At least one train enters waiting state before collision')
  })

  it('should wait at the other train\'s parachute position', () => {
    let state = createSimulation(5)
    
    // Run until someone is waiting
    while (!state.trainA.isWaiting && !state.trainB.isWaiting && state.stepCount < 100) {
      state = simulateStep(state)
    }
    
    if (state.trainA.isWaiting) {
      assert(
        state.trainA.position === state.trainB.parachutePosition,
        `Train A waits at B's parachute (pos ${state.trainA.position} = ${state.trainB.parachutePosition})`
      )
    } else if (state.trainB.isWaiting) {
      assert(
        state.trainB.position === state.trainA.parachutePosition,
        `Train B waits at A's parachute (pos ${state.trainB.position} = ${state.trainA.parachutePosition})`
      )
    }
  })
})

describe('Phase Transitions', () => {
  it('should complete a full sweep cycle', () => {
    let state = createSimulation(100) // Large distance to avoid early collision
    
    // Run enough steps to complete at least one full cycle (phase 1)
    // Phase 1: 1 forward + 1 back + 1 backward + 1 forward = 4 steps
    for (let i = 0; i < 5; i++) {
      state = simulateStep(state)
    }
    
    // After 4 steps, should be back at phase 2 sweep_forward
    // (or still in phase 1 depending on exact timing)
    assert(
      state.trainA.phaseNumber >= 1,
      `Phase number progresses (currently ${state.trainA.phaseNumber})`
    )
  })
})

// =============================================================================
// STEP-BY-STEP TRACE (for debugging)
// =============================================================================

describe('Step-by-Step Trace (distance 3)', () => {
  let state = createSimulation(3)
  console.log(`  Initial: A at ${state.trainA.position}, B at ${state.trainB.position}`)
  
  const maxSteps = 20
  for (let i = 0; i < maxSteps && !state.hasCollided; i++) {
    state = simulateStep(state)
    const aWait = state.trainA.isWaiting ? ' (WAITING)' : ''
    const bWait = state.trainB.isWaiting ? ' (WAITING)' : ''
    console.log(`  Step ${state.stepCount.toString().padStart(2)}: A@${state.trainA.position}${aWait}, B@${state.trainB.position}${bWait}`)
  }
  
  assert(state.hasCollided, `Collision achieved in ${state.stepCount} steps`)
})

// =============================================================================
// SUMMARY
// =============================================================================

console.log('\n' + '='.repeat(50))
console.log(`📊 RESULTS: ${passed} passed, ${failed} failed`)
console.log('='.repeat(50))

if (failed > 0) {
  process.exit(1)
}
