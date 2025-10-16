# Requirements Document

## Introduction

The F1 Reaction Game is a reaction time-based racing game built for Reddit using Devvit and React. Players control a car on a track by reacting to visual cues at specific distance checkpoints, with the goal of completing the race in the shortest time possible through precise timing of brake and acceleration inputs.

## Glossary

- **F1_Game_System**: The complete F1 reaction time game application
- **Track_Component**: The racing track with defined distance, checkpoints, and timing parameters
- **Car_Component**: The player-controlled vehicle that moves along the track
- **Brake_Point**: A distance checkpoint where players must react to brake controls (bottom left)
- **Straight_Point**: A distance checkpoint where players must react to acceleration controls (bottom right)
- **Point_Duration**: The time window (in seconds) during which speed modifications are active
- **Speed_Increase**: The amount by which car speed increases when correctly timed
- **Speed_Decrease**: The penalty speed reduction applied for incorrect timing
- **Race_Timer**: The elapsed time counter from race start to finish
- **Control_Button**: Interactive UI elements for brake (left) and acceleration (right) inputs
- **Green_State**: The active state when players should press controls for speed boost
- **Red_State**: The inactive state when pressing controls results in penalty

## Requirements

### Requirement 1

**User Story:** As a player, I want to start and restart races, so that I can play multiple rounds and improve my performance

#### Acceptance Criteria

1. THE F1_Game_System SHALL provide a start button at the top right of the interface
2. WHEN the start button is pressed, THE F1_Game_System SHALL initialize a new race with reset timer and car position
3. WHEN a race is in progress, THE F1_Game_System SHALL display the start button as a restart option
4. THE F1_Game_System SHALL reset all game state variables when starting or restarting a race

### Requirement 2

**User Story:** As a player, I want to see real-time race information, so that I can track my progress and performance

#### Acceptance Criteria

1. THE F1_Game_System SHALL display a race timer in the center of the screen showing elapsed time
2. THE F1_Game_System SHALL display distance covered below the timer showing car progress
3. THE F1_Game_System SHALL update the race timer continuously during active races with precision 1/10th of a millisecond (Eg: 1.005 seconds)
4. THE F1_Game_System SHALL display current break points and straight points below distance for debugging purposes
5. WHEN the race ends, THE F1_Game_System SHALL stop the timer and preserve the final race time

### Requirement 3

**User Story:** As a player, I want to control the car using reaction-based inputs, so that I can influence race performance through skill

#### Acceptance Criteria

1. THE F1_Game_System SHALL provide control buttons at bottom left (brake) and bottom right (acceleration)
2. THE F1_Game_System SHALL support keyboard controls with A/← for brake and D/→ for acceleration on PC
3. THE F1_Game_System SHALL support touch controls for mobile devices on the respective button areas
4. WHEN a player activates controls during red state, THE F1_Game_System SHALL apply speed decrease penalty for 1 second
5. WHEN a player activates controls during green state, THE F1_Game_System SHALL apply speed increase for the remaining point duration

### Requirement 4

**User Story:** As a player, I want the track to have challenging checkpoint timing, so that the game requires skill and precision

#### Acceptance Criteria

1. THE Track_Component SHALL define break points as distance checkpoints with red/green state transitions
2. THE Track_Component SHALL define straight points as distance checkpoints with red/green state transitions
3. WHEN the car reaches a break point distance, THE Track_Component SHALL activate the bottom left control for point duration
4. WHEN the car reaches a straight point distance, THE Track_Component SHALL activate the bottom right control for point duration
5. THE Track_Component SHALL calculate speed modifications with precision to 0.1 milliseconds for accurate race timing

### Requirement 5

**User Story:** As a player, I want the car to move realistically along the track, so that the game feels authentic and responsive

#### Acceptance Criteria

1. THE Car_Component SHALL maintain current speed and distance covered attributes
2. THE Car_Component SHALL move at average speed when no speed modifications are active
3. WHEN speed increase is applied, THE Car_Component SHALL increase current speed by the specified amount for the duration
4. WHEN speed decrease penalty is applied, THE Car_Component SHALL reduce current speed for exactly 1 second
5. WHEN the car distance covered equals track distance, THE F1_Game_System SHALL end the race and stop the timer

### Requirement 6

**User Story:** As a player, I want precise timing mechanics, so that races can be competitive and skill-based

#### Acceptance Criteria

1. THE F1_Game_System SHALL calculate all timing with precision to 1/10th of a millisecond (Eg: 1.005 seconds)
2. WHEN a player reacts within the green window, THE F1_Game_System SHALL apply the full speed increase for remaining duration
3. THE F1_Game_System SHALL track the exact moment of player input relative to checkpoint activation
4. THE F1_Game_System SHALL ensure consistent frame rate and timing across different devices
5. THE F1_Game_System SHALL maintain accurate race progression regardless of device performance variations
