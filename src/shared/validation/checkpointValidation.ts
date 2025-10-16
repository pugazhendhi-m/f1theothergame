/**
 * Checkpoint validation functions for F1 Reaction Game
 * Validates checkpoint timing and player input accuracy
 * Requirements: 4.3, 4.4, 6.2, 6.3
 */

import { CheckpointEvent, PlayerInput, ControlState } from '../types/game';

// Validation error class for checkpoint-specific errors
export class CheckpointValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CheckpointValidationError';
  }
}

/**
 * Validates checkpoint event data
 */
export function validateCheckpointEvent(event: CheckpointEvent): void {
  if (!event.type || (event.type !== 'brake_point' && event.type !== 'straight_point')) {
    throw new CheckpointValidationError('Invalid checkpoint event type');
  }
  
  if (event.distance < 0) {
    throw new CheckpointValidationError('Checkpoint distance cannot be negative');
  }
  
  if (event.activatedAt < 0) {
    throw new CheckpointValidationError('Checkpoint activation time cannot be negative');
  }
  
  if (event.duration <= 0) {
    throw new CheckpointValidationError('Checkpoint duration must be positive');
  }
}

/**
 * Validates control state data
 */
export function validateControlState(state: ControlState): void {
  if (state.activatedAt < 0) {
    throw new CheckpointValidationError('Control activation time cannot be negative');
  }
  
  if (state.duration < 0) {
    throw new CheckpointValidationError('Control duration cannot be negative');
  }
  
  // If control is active, it must have valid timing data
  if (state.isActive && (state.activatedAt === 0 || state.duration === 0)) {
    throw new CheckpointValidationError('Active control must have valid timing data');
  }
}

/**
 * Validates player input timing against checkpoint activation
 */
export function validateInputTiming(
  input: PlayerInput,
  checkpointEvent: CheckpointEvent | null
): {
  isValid: boolean;
  reactionTime: number;
  timingAccuracy: 'perfect' | 'good' | 'late' | 'penalty';
} {
  if (!checkpointEvent) {
    return {
      isValid: false,
      reactionTime: 0,
      timingAccuracy: 'penalty'
    };
  }

  const reactionTime = input.timestamp - checkpointEvent.activatedAt;
  
  // Input before checkpoint activation is invalid
  if (reactionTime < 0) {
    return {
      isValid: false,
      reactionTime: Math.abs(reactionTime),
      timingAccuracy: 'penalty'
    };
  }
  
  // Input after checkpoint duration is invalid
  if (reactionTime > checkpointEvent.duration) {
    return {
      isValid: false,
      reactionTime,
      timingAccuracy: 'penalty'
    };
  }
  
  // Determine timing accuracy based on reaction time
  let timingAccuracy: 'perfect' | 'good' | 'late' | 'penalty';
  
  if (reactionTime <= 100) { // Within 100ms
    timingAccuracy = 'perfect';
  } else if (reactionTime <= 300) { // Within 300ms
    timingAccuracy = 'good';
  } else {
    timingAccuracy = 'late';
  }
  
  return {
    isValid: true,
    reactionTime,
    timingAccuracy
  };
}

/**
 * Calculate speed modification based on input timing
 */
export function calculateSpeedModification(
  baseSpeedIncrease: number,
  baseSpeedDecrease: number,
  timingAccuracy: 'perfect' | 'good' | 'late' | 'penalty',
  remainingDuration: number
): {
  type: 'increase' | 'decrease';
  amount: number;
  duration: number;
} {
  switch (timingAccuracy) {
    case 'perfect':
      return {
        type: 'increase',
        amount: baseSpeedIncrease * 1.2, // 20% bonus for perfect timing
        duration: remainingDuration
      };
      
    case 'good':
      return {
        type: 'increase',
        amount: baseSpeedIncrease,
        duration: remainingDuration
      };
      
    case 'late':
      return {
        type: 'increase',
        amount: baseSpeedIncrease * 0.8, // 20% reduction for late timing
        duration: remainingDuration
      };
      
    case 'penalty':
      return {
        type: 'decrease',
        amount: baseSpeedDecrease,
        duration: 1000 // 1 second penalty
      };
  }
}

/**
 * Check if input is within valid timing window
 */
export function isInputWithinWindow(
  inputTimestamp: number,
  checkpointActivatedAt: number,
  checkpointDuration: number
): boolean {
  const reactionTime = inputTimestamp - checkpointActivatedAt;
  return reactionTime >= 0 && reactionTime <= checkpointDuration;
}

/**
 * Calculate remaining time in checkpoint window
 */
export function getRemainingWindowTime(
  currentTime: number,
  checkpointActivatedAt: number,
  checkpointDuration: number
): number {
  const elapsed = currentTime - checkpointActivatedAt;
  return Math.max(0, checkpointDuration - elapsed);
}

/**
 * Determine if checkpoint should be activated based on car position
 */
export function shouldActivateCheckpoint(
  carDistance: number,
  checkpointDistance: number,
  tolerance: number = 5 // 5 meter tolerance
): boolean {
  return Math.abs(carDistance - checkpointDistance) <= tolerance;
}

/**
 * Get checkpoint priority when multiple checkpoints are near
 */
export function getCheckpointPriority(
  carDistance: number,
  brakePoints: number[],
  straightPoints: number[]
): {
  type: 'brake_point' | 'straight_point' | null;
  distance: number;
  priority: number;
} | null {
  const nearbyBrakePoints = brakePoints
    .map(distance => ({ type: 'brake_point' as const, distance, priority: Math.abs(carDistance - distance) }))
    .filter(point => point.priority <= 5);
    
  const nearbyStraightPoints = straightPoints
    .map(distance => ({ type: 'straight_point' as const, distance, priority: Math.abs(carDistance - distance) }))
    .filter(point => point.priority <= 5);
    
  const allNearbyPoints = [...nearbyBrakePoints, ...nearbyStraightPoints];
  
  if (allNearbyPoints.length === 0) {
    return null;
  }
  
  // Return the closest checkpoint
  return allNearbyPoints.reduce((closest, current) => 
    current.priority < closest.priority ? current : closest
  );
}

/**
 * Validate checkpoint array configuration
 */
export function validateCheckpointArray(
  checkpoints: number[],
  trackDistance: number,
  checkpointType: 'brake' | 'straight'
): void {
  if (checkpoints.length === 0) {
    throw new CheckpointValidationError(`${checkpointType} points array cannot be empty`);
  }
  
  for (const checkpoint of checkpoints) {
    if (checkpoint < 0 || checkpoint >= trackDistance) {
      throw new CheckpointValidationError(
        `${checkpointType} point ${checkpoint} is outside track bounds (0-${trackDistance})`
      );
    }
  }
  
  // Check for duplicates
  const uniqueCheckpoints = new Set(checkpoints);
  if (uniqueCheckpoints.size !== checkpoints.length) {
    throw new CheckpointValidationError(`${checkpointType} points array contains duplicates`);
  }
  
  // Verify sorted order
  const sortedCheckpoints = [...checkpoints].sort((a, b) => a - b);
  if (!checkpoints.every((point, index) => point === sortedCheckpoints[index])) {
    throw new CheckpointValidationError(`${checkpointType} points must be sorted in ascending order`);
  }
}
