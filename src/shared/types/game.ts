/**
 * Core game data models and interfaces for F1 Reaction Game
 * Based on requirements 4.1, 4.2, 5.1, 5.2
 */

// Speed modifier for temporary speed changes
export interface SpeedModifier {
  type: 'increase' | 'decrease';
  amount: number;           // Speed change in m/s
  startTime: number;        // When modifier was applied (ms)
  duration: number;         // How long modifier lasts (ms)
}

// Track configuration and state
export interface Track {
  distance: number;         // Total track distance in meters
  averageSpeed: number;     // Base cruise speed (m/s)
  raceTime: number | null;  // Elapsed race time (ms), null if not finished
  brakePoints: number[];    // Distance checkpoints for brake controls
  straightPoints: number[]; // Distance checkpoints for acceleration controls
  speedIncrease: number;    // Speed boost amount (m/s)
  pointDuration: number;    // Duration of active control window (ms)
  speedDecrease: number;    // Penalty speed reduction (m/s)
}

// Car state and physics
export interface Car {
  distanceCovered: number;     // Current position on track (m)
  currentSpeed: number;        // Current speed (m/s)
  baseSpeed: number;          // Reference speed for calculations
  speedModifiers: SpeedModifier[]; // Active speed modifications
}

// Control button states
export interface ControlState {
  isActive: boolean;        // Whether control is in green (active) state
  activatedAt: number;      // When control became active (ms)
  duration: number;         // How long control stays active (ms)
}

// Overall game state
export interface GameState {
  track: Track;
  car: Car;
  gameStatus: 'idle' | 'running' | 'finished';
  activeControls: {
    brake: ControlState;
    acceleration: ControlState;
  };
  raceStartTime: number | null; // When race started (performance.now())
}

// Game configuration for initialization
export interface GameConfig {
  track: {
    distance: number;
    averageSpeed: number;
    brakePoints: number[];
    straightPoints: number[];
    speedIncrease: number;
    pointDuration: number;
    speedDecrease: number;
  };
  controls: {
    keyboard: {
      brake: string[];        // Key codes for brake input
      acceleration: string[]; // Key codes for acceleration input
    };
    mobile: {
      brake: string;          // CSS selector for brake button
      acceleration: string;   // CSS selector for acceleration button
    };
  };
}

// Race completion result
export interface RaceResult {
  raceTime: number;            // Final race time in milliseconds
  perfectInputs: number;       // Count of optimal reactions
  penaltyInputs: number;       // Count of penalty-inducing inputs
  averageReactionTime: number; // Average reaction time for inputs
  distanceCovered: number;     // Should equal track distance
  username: string;            // Reddit username
  timestamp: number;           // Race completion timestamp
}

// Input event for player actions
export interface PlayerInput {
  type: 'brake' | 'acceleration';
  timestamp: number;           // When input occurred (performance.now())
  inputMethod: 'keyboard' | 'touch';
}

// Checkpoint activation event
export interface CheckpointEvent {
  type: 'brake_point' | 'straight_point';
  distance: number;            // Distance where checkpoint triggered
  activatedAt: number;         // When checkpoint became active
  duration: number;            // How long checkpoint stays active
}
