# F1 Reaction Game Design Document

## Overview

The F1 Reaction Game is a skill-based racing game built on the Devvit platform using React and TypeScript. The game challenges players to react precisely to visual cues at specific track checkpoints to optimize their car's speed and achieve the fastest race time. The architecture follows Devvit's client-server pattern with real-time game state management and high-precision timing calculations.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │◄──►│  Express Server │◄──►│  Redis Storage  │
│   (Game UI)     │    │  (Game Logic)   │    │  (Leaderboard)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │
        ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│  Game Engine    │    │  Reddit API     │
│  (Timing/State) │    │  (User Context) │
└─────────────────┘    └─────────────────┘
```

### Component Architecture

The game follows a modular React architecture with clear separation of concerns:

- **Game Container**: Main game orchestrator managing overall state
- **Track Component**: Handles track logic, checkpoints, and timing
- **Car Component**: Manages car movement and speed calculations
- **UI Components**: Controls, timer, and debug information display
- **Game Engine**: Core timing and state management logic

## Components and Interfaces

### Core Game Classes

#### Track Class

```typescript
interface Track {
  distance: number; // Total track distance in meters
  averageSpeed: number; // Base cruise speed (m/s)
  raceTime: number | null; // Elapsed race time (ms)
  brakePoints: number[]; // Distance checkpoints for brake controls
  straightPoints: number[]; // Distance checkpoints for acceleration controls
  speedIncrease: number; // Speed boost amount (m/s)
  pointDuration: number; // Duration of active control window (ms)
  speedDecrease: number; // Penalty speed reduction (m/s)
}
```

#### Car Class

```typescript
interface Car {
  distanceCovered: number; // Current position on track (m)
  currentSpeed: number; // Current speed (m/s)
  baseSpeed: number; // Reference speed for calculations
  speedModifiers: SpeedModifier[]; // Active speed modifications
}

interface SpeedModifier {
  type: 'increase' | 'decrease';
  amount: number;
  startTime: number;
  duration: number;
}
```

### React Components

#### GameContainer Component

- Manages overall game state and lifecycle
- Coordinates between Track, Car, and UI components
- Handles game start/restart functionality
- Manages high-precision timing with `requestAnimationFrame`

#### TrackManager Component

- Monitors car position against checkpoint arrays
- Triggers control activation at break/straight points
- Calculates timing windows for player reactions
- Manages visual state of control buttons (red/green)

#### CarController Component

- Updates car position based on current speed
- Applies speed modifications from player inputs
- Handles collision detection with track boundaries
- Calculates race completion conditions

#### ControlInterface Component

- Renders brake (left) and acceleration (right) buttons
- Handles both touch and keyboard input events
- Provides visual feedback for active/inactive states
- Manages input validation and penalty application

#### GameDisplay Component

- Shows real-time race timer with 0.1ms precision
- Displays current distance covered
- Renders debug information for checkpoint states
- Handles race completion UI states

### Game Engine

#### Timing System

The game uses a high-precision timing system built on `performance.now()` for sub-millisecond accuracy:

```typescript
class GameTimer {
  private startTime: number = 0;
  private lastFrameTime: number = 0;
  private isRunning: boolean = false;

  getCurrentTime(): number {
    return this.isRunning ? performance.now() - this.startTime : 0;
  }

  getDeltaTime(): number {
    const currentTime = performance.now();
    const delta = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    return delta;
  }
}
```

#### State Management

Game state is managed through React hooks with optimized updates:

```typescript
interface GameState {
  track: Track;
  car: Car;
  gameStatus: 'idle' | 'running' | 'finished';
  activeControls: {
    brake: ControlState;
    acceleration: ControlState;
  };
  raceStartTime: number | null;
}

interface ControlState {
  isActive: boolean;
  activatedAt: number;
  duration: number;
}
```

## Data Models

### Game Configuration

```typescript
interface GameConfig {
  track: {
    distance: 1000; // 1km track
    averageSpeed: 50; // 50 m/s base speed
    brakePoints: [200, 400, 700, 900]; // Brake checkpoints
    straightPoints: [100, 350, 600, 850]; // Acceleration checkpoints
    speedIncrease: 15; // +15 m/s boost
    pointDuration: 2000; // 2 second windows
    speedDecrease: 10; // -10 m/s penalty
  };
  controls: {
    keyboard: {
      brake: ['KeyA', 'ArrowLeft'];
      acceleration: ['KeyD', 'ArrowRight'];
    };
    mobile: {
      brake: 'bottom-left-button';
      acceleration: 'bottom-right-button';
    };
  };
}
```

### Race Results

```typescript
interface RaceResult {
  raceTime: number; // Final race time in milliseconds
  perfectInputs: number; // Count of optimal reactions
  penaltyInputs: number; // Count of penalty-inducing inputs
  averageReactionTime: number; // Average reaction time for inputs
  distanceCovered: number; // Should equal track distance
  username: string; // Reddit username
  timestamp: number; // Race completion timestamp
}
```

## Error Handling

### Input Validation

- Validate all user inputs before processing
- Sanitize timing calculations to prevent negative values
- Handle edge cases for simultaneous button presses
- Implement debouncing for rapid input sequences

### Performance Safeguards

- Limit animation frame rate to prevent performance issues
- Implement fallback timing mechanisms for inconsistent performance
- Handle browser tab visibility changes gracefully
- Provide degraded experience for low-performance devices

### Network Error Handling

- Implement retry logic for API calls
- Cache game state locally during network issues
- Provide offline mode for single-player functionality
- Handle server timeouts gracefully

## Testing Strategy

### Unit Testing

- **Track Logic**: Test checkpoint detection and timing calculations
- **Car Physics**: Verify speed modifications and position updates
- **Input Handling**: Test keyboard and touch input processing
- **Timer Accuracy**: Validate high-precision timing calculations

### Integration Testing

- **Game Flow**: Test complete race scenarios from start to finish
- **State Synchronization**: Verify client-server state consistency
- **Performance**: Test game performance under various conditions
- **Cross-Platform**: Validate functionality across desktop and mobile

### Performance Testing

- **Frame Rate**: Ensure consistent 60fps performance
- **Memory Usage**: Monitor for memory leaks during extended play
- **Timing Precision**: Validate sub-millisecond accuracy requirements
- **Network Latency**: Test game responsiveness under various network conditions

### User Experience Testing

- **Mobile Responsiveness**: Test touch controls on various screen sizes
- **Accessibility**: Ensure keyboard navigation and screen reader compatibility
- **Visual Feedback**: Validate clear indication of control states
- **Race Completion**: Test various race completion scenarios

## Implementation Notes

### Precision Requirements

The game requires 0.1 millisecond precision for competitive racing. This is achieved through:

- Using `performance.now()` for all timing calculations
- Implementing custom animation loops with `requestAnimationFrame`
- Avoiding `setTimeout` and `setInterval` for critical timing
- Calculating speed modifications based on exact input timing

### Mobile Optimization

- Touch targets sized appropriately for mobile devices (minimum 44px)
- Responsive layout adapting to various screen orientations
- Optimized rendering to maintain performance on mobile hardware
- Battery-conscious animation and calculation strategies

### Devvit Integration

- Leverage Redis for persistent leaderboard storage
- Use Reddit API for user authentication and context
- Follow Devvit's client-server communication patterns
- Implement proper error handling for Devvit-specific constraints
