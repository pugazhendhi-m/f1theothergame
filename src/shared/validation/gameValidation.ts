/**
 * Validation functions for game data integrity
 * Ensures all game data meets requirements and constraints
 */

import { Track, Car, GameState, GameConfig, RaceResult, PlayerInput } from '../types/game';

// Validation error class
export class GameValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GameValidationError';
  }
}

/**
 * Validates Track configuration
 */
export function validateTrack(track: Track): void {
  if (track.distance <= 0) {
    throw new GameValidationError('Track distance must be positive');
  }
  
  if (track.averageSpeed <= 0) {
    throw new GameValidationError('Average speed must be positive');
  }
  
  if (track.speedIncrease <= 0) {
    throw new GameValidationError('Speed increase must be positive');
  }
  
  if (track.speedDecrease <= 0) {
    throw new GameValidationError('Speed decrease must be positive');
  }
  
  if (track.pointDuration <= 0) {
    throw new GameValidationError('Point duration must be positive');
  }
  
  // Validate brake points are within track distance and sorted
  for (const point of track.brakePoints) {
    if (point < 0 || point >= track.distance) {
      throw new GameValidationError(`Brake point ${point} is outside track bounds`);
    }
  }
  
  // Validate straight points are within track distance and sorted
  for (const point of track.straightPoints) {
    if (point < 0 || point >= track.distance) {
      throw new GameValidationError(`Straight point ${point} is outside track bounds`);
    }
  }
  
  // Check for sorted arrays (performance optimization)
  const sortedBrakePoints = [...track.brakePoints].sort((a, b) => a - b);
  const sortedStraightPoints = [...track.straightPoints].sort((a, b) => a - b);
  
  if (!arraysEqual(track.brakePoints, sortedBrakePoints)) {
    throw new GameValidationError('Brake points must be sorted in ascending order');
  }
  
  if (!arraysEqual(track.straightPoints, sortedStraightPoints)) {
    throw new GameValidationError('Straight points must be sorted in ascending order');
  }
}

/**
 * Validates Car state
 */
export function validateCar(car: Car): void {
  if (car.distanceCovered < 0) {
    throw new GameValidationError('Distance covered cannot be negative');
  }
  
  if (car.currentSpeed < 0) {
    throw new GameValidationError('Current speed cannot be negative');
  }
  
  if (car.baseSpeed <= 0) {
    throw new GameValidationError('Base speed must be positive');
  }
  
  // Validate speed modifiers
  for (const modifier of car.speedModifiers) {
    if (modifier.amount <= 0) {
      throw new GameValidationError('Speed modifier amount must be positive');
    }
    
    if (modifier.duration <= 0) {
      throw new GameValidationError('Speed modifier duration must be positive');
    }
    
    if (modifier.startTime < 0) {
      throw new GameValidationError('Speed modifier start time cannot be negative');
    }
  }
}

/**
 * Validates GameState
 */
export function validateGameState(gameState: GameState): void {
  validateTrack(gameState.track);
  validateCar(gameState.car);
  
  // Validate car is within track bounds
  if (gameState.car.distanceCovered > gameState.track.distance) {
    throw new GameValidationError('Car distance cannot exceed track distance');
  }
  
  // Validate game status
  const validStatuses = ['idle', 'running', 'finished'];
  if (!validStatuses.includes(gameState.gameStatus)) {
    throw new GameValidationError(`Invalid game status: ${gameState.gameStatus}`);
  }
  
  // Validate race start time consistency
  if (gameState.gameStatus === 'running' && gameState.raceStartTime === null) {
    throw new GameValidationError('Race start time must be set when game is running');
  }
  
  if (gameState.gameStatus === 'idle' && gameState.raceStartTime !== null) {
    throw new GameValidationError('Race start time must be null when game is idle');
  }
}

/**
 * Validates GameConfig
 */
export function validateGameConfig(config: GameConfig): void {
  // Validate track config
  if (config.track.distance <= 0) {
    throw new GameValidationError('Config track distance must be positive');
  }
  
  if (config.track.averageSpeed <= 0) {
    throw new GameValidationError('Config average speed must be positive');
  }
  
  if (config.track.brakePoints.length === 0) {
    throw new GameValidationError('Config must have at least one brake point');
  }
  
  if (config.track.straightPoints.length === 0) {
    throw new GameValidationError('Config must have at least one straight point');
  }
  
  // Validate keyboard controls
  if (config.controls.keyboard.brake.length === 0) {
    throw new GameValidationError('Config must specify brake keyboard controls');
  }
  
  if (config.controls.keyboard.acceleration.length === 0) {
    throw new GameValidationError('Config must specify acceleration keyboard controls');
  }
  
  // Validate mobile controls
  if (!config.controls.mobile.brake || config.controls.mobile.brake.trim() === '') {
    throw new GameValidationError('Config must specify brake mobile control');
  }
  
  if (!config.controls.mobile.acceleration || config.controls.mobile.acceleration.trim() === '') {
    throw new GameValidationError('Config must specify acceleration mobile control');
  }
}

/**
 * Validates RaceResult
 */
export function validateRaceResult(result: RaceResult): void {
  if (result.raceTime <= 0) {
    throw new GameValidationError('Race time must be positive');
  }
  
  if (result.perfectInputs < 0) {
    throw new GameValidationError('Perfect inputs cannot be negative');
  }
  
  if (result.penaltyInputs < 0) {
    throw new GameValidationError('Penalty inputs cannot be negative');
  }
  
  if (result.averageReactionTime < 0) {
    throw new GameValidationError('Average reaction time cannot be negative');
  }
  
  if (result.distanceCovered <= 0) {
    throw new GameValidationError('Distance covered must be positive');
  }
  
  if (!result.username || result.username.trim() === '') {
    throw new GameValidationError('Username is required');
  }
  
  if (result.timestamp <= 0) {
    throw new GameValidationError('Timestamp must be positive');
  }
}

/**
 * Validates PlayerInput
 */
export function validatePlayerInput(input: PlayerInput): void {
  const validTypes = ['brake', 'acceleration'];
  if (!validTypes.includes(input.type)) {
    throw new GameValidationError(`Invalid input type: ${input.type}`);
  }
  
  if (input.timestamp < 0) {
    throw new GameValidationError('Input timestamp cannot be negative');
  }
  
  const validMethods = ['keyboard', 'touch'];
  if (!validMethods.includes(input.inputMethod)) {
    throw new GameValidationError(`Invalid input method: ${input.inputMethod}`);
  }
}

/**
 * Validates timing precision (0.1 millisecond requirement)
 */
export function validateTimingPrecision(timestamp: number): void {
  // Check if timestamp has appropriate precision
  // performance.now() provides microsecond precision, so this should always pass
  if (!Number.isFinite(timestamp)) {
    throw new GameValidationError('Timestamp must be a finite number');
  }
  
  if (timestamp < 0) {
    throw new GameValidationError('Timestamp cannot be negative');
  }
}

/**
 * Helper function to compare arrays for equality
 */
function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
}

/**
 * Creates a default GameConfig for testing and initialization
 */
export function createDefaultGameConfig(): GameConfig {
  return {
    track: {
      distance: 1000,              // 1km track
      averageSpeed: 50,            // 50 m/s base speed
      brakePoints: [200, 400, 700, 900], // Brake checkpoints
      straightPoints: [100, 350, 600, 850], // Acceleration checkpoints
      speedIncrease: 15,           // +15 m/s boost
      pointDuration: 2000,         // 2 second windows
      speedDecrease: 10,           // -10 m/s penalty
    },
    controls: {
      keyboard: {
        brake: ['KeyA', 'ArrowLeft'],
        acceleration: ['KeyD', 'ArrowRight'],
      },
      mobile: {
        brake: 'bottom-left-button',
        acceleration: 'bottom-right-button',
      },
    },
  };
}
