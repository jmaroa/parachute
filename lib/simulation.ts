/**
 * Parachute Trains Puzzle - Simulation Engine
 * 
 * Two trains on an infinite railway must find each other using identical algorithms.
 * Each train uses a "Sweep & Wait" strategy with increasing search range.
 */

// =============================================================================
// TYPES
// =============================================================================

/** Possible actions a train can take */
export type TrainAction = 'forward' | 'backward' | 'wait'

/** Current phase of the sweep algorithm */
export type SweepPhase = 'sweep_forward' | 'return_from_forward' | 'sweep_backward' | 'return_from_backward'

/** State of an individual train */
export interface TrainState {
  /** Current position on the railway (absolute) */
  position: number
  /** Position of this train's parachute (home) */
  parachutePosition: number
  /** Distance from home (used to detect foreign parachutes) */
  distanceFromHome: number
  /** Current phase in the sweep algorithm */
  sweepPhase: SweepPhase
  /** Current sweep range (increases each full cycle) */
  phaseNumber: number
  /** Steps taken in current sweep phase */
  stepsInPhase: number
  /** Whether this train is waiting at a foreign parachute */
  isWaiting: boolean
}

/** Complete simulation state */
export interface SimulationState {
  /** State of train A */
  trainA: TrainState
  /** State of train B */
  trainB: TrainState
  /** Total steps executed */
  stepCount: number
  /** Whether the trains have collided */
  hasCollided: boolean
  /** Position where collision occurred (if any) */
  collisionPosition: number | null
}

// =============================================================================
// TRAIN ALGORITHM
// =============================================================================

/**
 * Determines if the train is at a FOREIGN parachute (not its own).
 * This is detected by checking if distanceFromHome !== 0 when at a parachute.
 */
function isAtForeignParachute(train: TrainState, otherTrainParachutePos: number): boolean {
  return train.position === otherTrainParachutePos && train.distanceFromHome !== 0
}

/**
 * Gets the next action for a train based on the Sweep & Wait algorithm.
 * This is the core algorithm that both trains execute identically.
 */
export function getNextAction(train: TrainState, otherTrainParachutePos: number): TrainAction {
  // If already waiting at foreign parachute, keep waiting
  if (train.isWaiting) {
    return 'wait'
  }

  // Check if we found the other train's parachute
  if (isAtForeignParachute(train, otherTrainParachutePos)) {
    return 'wait' // Will trigger isWaiting = true in applyAction
  }

  // Execute sweep pattern based on current phase
  switch (train.sweepPhase) {
    case 'sweep_forward':
    case 'return_from_backward':
      return 'forward'
    
    case 'return_from_forward':
    case 'sweep_backward':
      return 'backward'
    
    default:
      return 'wait'
  }
}

/**
 * Applies an action to a train and returns the updated state.
 */
export function applyAction(
  train: TrainState, 
  action: TrainAction,
  otherTrainParachutePos: number
): TrainState {
  const newTrain = { ...train }

  // Apply movement
  switch (action) {
    case 'forward':
      newTrain.position += 1
      newTrain.distanceFromHome += 1
      newTrain.stepsInPhase += 1
      break
    
    case 'backward':
      newTrain.position -= 1
      newTrain.distanceFromHome -= 1
      newTrain.stepsInPhase += 1
      break
    
    case 'wait':
      // Check if we should start waiting (found foreign parachute)
      if (isAtForeignParachute(newTrain, otherTrainParachutePos)) {
        newTrain.isWaiting = true
      }
      break
  }

  // Check for phase transitions (only if not waiting)
  if (!newTrain.isWaiting && newTrain.stepsInPhase >= newTrain.phaseNumber) {
    newTrain.stepsInPhase = 0
    
    switch (newTrain.sweepPhase) {
      case 'sweep_forward':
        newTrain.sweepPhase = 'return_from_forward'
        break
      case 'return_from_forward':
        newTrain.sweepPhase = 'sweep_backward'
        break
      case 'sweep_backward':
        newTrain.sweepPhase = 'return_from_backward'
        break
      case 'return_from_backward':
        // Completed full cycle, increase phase number
        newTrain.sweepPhase = 'sweep_forward'
        newTrain.phaseNumber += 1
        break
    }
  }

  return newTrain
}

// =============================================================================
// SIMULATION ENGINE
// =============================================================================

/**
 * Creates the initial state for a train at a given position.
 */
export function createTrainState(position: number): TrainState {
  return {
    position,
    parachutePosition: position,
    distanceFromHome: 0,
    sweepPhase: 'sweep_forward',
    phaseNumber: 1,
    stepsInPhase: 0,
    isWaiting: false,
  }
}

/**
 * Creates the initial simulation state.
 * @param distance - The distance between the two trains (train B position)
 */
export function createSimulation(distance: number): SimulationState {
  return {
    trainA: createTrainState(0),
    trainB: createTrainState(distance),
    stepCount: 0,
    hasCollided: false,
    collisionPosition: null,
  }
}

/**
 * Checks if two trains have collided (same position).
 */
function checkCollision(trainA: TrainState, trainB: TrainState): boolean {
  return trainA.position === trainB.position
}

/**
 * Executes one step of the simulation.
 * Both trains execute their algorithm simultaneously.
 */
export function simulateStep(state: SimulationState): SimulationState {
  // Don't continue if already collided
  if (state.hasCollided) {
    return state
  }

  // Get actions for both trains
  const actionA = getNextAction(state.trainA, state.trainB.parachutePosition)
  const actionB = getNextAction(state.trainB, state.trainA.parachutePosition)

  // Apply actions
  const newTrainA = applyAction(state.trainA, actionA, state.trainB.parachutePosition)
  const newTrainB = applyAction(state.trainB, actionB, state.trainA.parachutePosition)

  // Check for collision
  const hasCollided = checkCollision(newTrainA, newTrainB)

  return {
    trainA: newTrainA,
    trainB: newTrainB,
    stepCount: state.stepCount + 1,
    hasCollided,
    collisionPosition: hasCollided ? newTrainA.position : null,
  }
}

/**
 * Runs the simulation until collision or max steps reached.
 * Useful for testing the algorithm.
 */
export function runSimulation(distance: number, maxSteps: number = 10000): SimulationState {
  let state = createSimulation(distance)

  while (!state.hasCollided && state.stepCount < maxSteps) {
    state = simulateStep(state)
  }

  return state
}

