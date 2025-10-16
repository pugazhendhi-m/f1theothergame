# F1 Reaction Game 🏎️

A high-precision reaction time racing game built for Reddit using Devvit. Test your reflexes and racing skills as you navigate a 1km track with strategic brake and acceleration zones that require split-second timing to master.

## What is F1 Reaction Game?

F1 Reaction Game is an innovative skill-based racing experience where players control a Formula 1 car not through traditional steering, but through perfectly timed reactions to visual cues. As your car speeds along a predetermined track, you must react to brake points and acceleration zones that appear at specific distances, pressing the correct controls at precisely the right moment to optimize your speed and achieve the fastest possible race time.

The game combines the thrill of Formula 1 racing with the precision of reaction time challenges, creating a unique gaming experience that rewards both quick reflexes and strategic timing. Your car automatically moves forward at a base speed of 50 m/s, but strategic use of brake and acceleration controls at the right moments can significantly improve your lap time.

### How It Works

Your Formula 1 car (🏎️) automatically races along a 1000-meter track at a base speed of 50 m/s. The track features 8 strategic checkpoints:

- **4 Brake Points** at 200m, 400m, 700m, and 900m - activate the left control (🛑)
- **4 Acceleration Points** at 100m, 350m, 600m, and 850m - activate the right control (⚡)

When your car reaches these checkpoints, the corresponding control button turns from red (inactive) to green (active) for exactly 2 seconds. During this green window, pressing the correct control gives you a speed boost. Press it during the red state, and you'll get a speed penalty instead!

## What Makes This Game Unique?

### ⚡ **Ultra-High Precision Timing**
- **0.1 millisecond accuracy**: Built with `performance.now()` for sub-millisecond precision timing
- **Competitive racing**: Races can be won or lost by fractions of a second
- **Real-time physics**: Car movement calculated with precise delta time using `requestAnimationFrame` for smooth, accurate motion at 60fps
- **Advanced timing system**: Custom GameTimer class provides consistent timing across all devices
- **Performance monitoring**: Built-in GamePerformanceMonitor tracks frame rates and timing accuracy during gameplay

### 🎯 **Skill-Based Reaction Mechanics**
- **Dynamic control states**: Brake and acceleration controls switch between red (penalty) and green (boost) states with visual pulsing
- **Perfect timing rewards**: Hit controls during green windows for speed boosts up to +22.5 m/s based on reaction speed
- **Smart penalty system**: Mistimed inputs result in -10 m/s speed penalties for 1 second, with anti-spam protection
- **Reaction bonuses**: Faster reactions within green windows provide bigger speed multipliers (1.5x for sub-200ms, 1.2x for sub-500ms)
- **Input cooldown**: 100ms cooldown prevents accidental spam clicking while maintaining responsiveness
- **Speed modifier stacking**: Multiple active boosts can stack for maximum velocity advantage

### 🏁 **Strategic Checkpoint System**
- **Brake points**: Located at 200m, 400m, 700m, and 900m - strategic braking zones for speed optimization
- **Acceleration zones**: Located at 100m, 350m, 600m, and 850m - straight sections for maximum speed gains
- **2-second timing windows**: Each checkpoint provides exactly 2 seconds of green window for optimal input
- **Risk/reward gameplay**: Miss a window and lose valuable time, hit it perfectly for maximum advantage
- **Intelligent checkpoint detection**: Advanced TrackManager system handles precise car position tracking

### 📱 **Cross-Platform Controls**
- **Desktop**: Keyboard controls (A/← for brake, D/→ for acceleration) with full key event handling
- **Mobile**: Touch-optimized buttons with enhanced touch targets (minimum 44px) and responsive design
- **Responsive UI**: Seamless experience across all device types with mobile-first design
- **Visual feedback**: Clear red/green states with pulsing animations, "PRESS NOW!" indicators, and pressed state feedback
- **Accessibility**: Proper ARIA labels, keyboard navigation support, and context menu prevention

### 🎮 **Reddit Integration**
- **Native Reddit experience**: Plays directly within Reddit posts using Devvit platform
- **Social gaming**: Share your best times with the Reddit community
- **Leaderboard system**: Redis-powered leaderboards with race time storage and ranking
- **One-click play**: Click "Launch App" in any Reddit post to start racing immediately
- **Full-screen gameplay**: Immersive full-screen experience within Reddit's interface

### 🎨 **Clean Visual Experience**
- **Streamlined three-column layout**: Speed display (left), race timer (center), and distance progress (right)
- **Real-time track visualization**: Animated track with dashed center line and moving car position indicator
- **Interactive track elements**: Hover over checkpoint markers and car position for detailed information tooltips
- **Race completion overlay**: Beautiful finish screen with final time and restart options
- **Responsive design**: Clean interface that adapts perfectly to all screen sizes
- **Focus on essentials**: Streamlined display prioritizes the most important race information

### 🛡️ **Robust Error Handling**
- **Error boundaries**: Comprehensive error catching with fallback UI and recovery options
- **Network error handling**: Automatic retry logic with user-friendly error messages
- **Performance warnings**: Real-time performance monitoring with optimization suggestions
- **Graceful degradation**: Maintains functionality even under adverse conditions

## How to Play 🎮

### Game Objective
Complete the 1000-meter track in the shortest time possible by perfectly timing your reactions to brake and acceleration checkpoints. Your car moves automatically - your job is to hit the speed boosts at exactly the right moments!

### Getting Started

#### **Accessing the Game**
1. Find an F1 Reaction Game post on Reddit
2. Click the **"Launch App"** button in the post
3. The game opens in full-screen mode within Reddit
4. No downloads or installations required!

#### **Starting Your First Race**
1. Click the **"START RACE"** button at the bottom center of the screen
2. Your car (🏎️) immediately begins moving along the track at 50 m/s
3. The race timer starts counting with 0.1 millisecond precision
4. Watch for the first checkpoint at 100 meters!

### Understanding the Game Interface

The game features a clean three-column layout designed for optimal gameplay:

#### **Left Column - Speed Metrics**
- **Speed Display**: Shows your current speed in m/s with color-coded indicators (green when moving, red when stopped)

#### **Center Column - Race Timer**
- **Race Timer**: Shows your current race time with 0.1ms precision (e.g., "12.345s")
- **Track Visualization**: Animated track with dashed center line, checkpoint markers, and your car's position indicator (🏎️)
- **Checkpoint Markers**: 🛑 for brake points and ⚡ for acceleration points positioned along the track

#### **Right Column - Distance Progress**
- **Distance Display**: Shows current position and total distance (e.g., "450m / 1000m")
- **Progress Bar**: Visual progress indicator showing completion percentage
- **Progress Percentage**: Numerical percentage of race completion

#### **Control Interface**
- **Brake Control** (bottom-left): 🛑 Shows "BRAKE" with "PRESS NOW!" or "WAIT..." status and A/← key hints
- **Acceleration Control** (bottom-right): ⚡ Shows "BOOST" with "PRESS NOW!" or "WAIT..." status and D/→ key hints
- **Color States**: Red = inactive (penalty), Green = active (boost opportunity) with bright pulsing animation
- **Visual Feedback**: Buttons show pressed state and success animations when activated
- **Start/Restart Button**: Located at bottom center, changes from "START RACE" to "RESTART RACE" during gameplay

#### **Error Handling & Performance**
- **Network Error Display**: Shows connection issues with retry options at the top of the screen
- **Performance Warning**: Alerts when frame rate drops below optimal levels
- **Error Boundaries**: Graceful error recovery with restart options if something goes wrong

### Step-by-Step Gameplay

#### **1. Watch for Checkpoint Activation**
As your car moves along the track, it will reach specific distances where controls become active:
- **Acceleration Zones**: 100m, 350m, 600m, 850m (right control turns green and pulses with ⚡ icon)
- **Brake Zones**: 200m, 400m, 700m, 900m (left control turns green and pulses with 🛑 icon)

You can see these checkpoints marked along the track visualization as your car approaches them.

#### **2. React During Green Windows**
When a control turns green and shows "PRESS NOW!":
- **Desktop Players**: Press `A` or `←` for brake, `D` or `→` for acceleration
- **Mobile Players**: Tap the glowing green button with pulsing animation
- **Timing Matters**: React as quickly as possible for maximum benefit!
- **Window Duration**: Each green window lasts exactly 2 seconds
- **Visual Feedback**: Buttons show clear pressed state and success animations

#### **3. Avoid Red-State Penalties**
- **Never press controls when they show "WAIT..."** - this gives you a -10 m/s penalty for 1 second
- **Wait for green**: Controls are only beneficial during their 2-second active windows
- **Visual Cues**: Red controls are solid, green controls pulse with bright animation
- **Spam Protection**: Multiple rapid penalties are prevented by the input cooldown system and penalty stacking protection

#### **4. Optimize Your Speed**
The game features an advanced reaction-based speed system:
- **Perfect Timing** (within 200ms): +22.5 m/s speed boost (1.5x multiplier) for remaining window duration
- **Good Timing** (within 500ms): +18 m/s speed boost (1.2x multiplier) for remaining window duration  
- **Late Timing** (after 500ms): +15 m/s base speed boost for remaining window duration
- **Wrong Timing** (red state): -10 m/s penalty for 1 second (with spam protection)
- **Input Cooldown**: 100ms between inputs prevents accidental double-taps while maintaining responsiveness
- **Speed Stacking**: Multiple active speed modifiers can stack for maximum velocity

#### **5. Monitor Your Performance**
The game provides essential real-time feedback:
- **Race Timer**: Shows elapsed time with 0.1ms precision (e.g., "12.345s") in the center of the screen
- **Distance Progress**: Current position with progress bar and percentage completion on the right
- **Current Speed**: Real-time speed display on the left showing your velocity in m/s
- **Visual Track**: Animated track visualization showing your car's position and checkpoint markers

#### **6. Complete the Race**
- Race automatically ends when you reach 1000 meters
- Final time is displayed in a completion overlay with detailed race statistics
- **Race Complete Screen** shows:
  - Final race time with 0.1ms precision (e.g., "14.567s")
  - Celebratory "🏁 Race Complete!" message
  - Large, prominent final time display
- Click **"Race Again"** to improve your time with a fresh attempt
- Use **"RESTART RACE"** during the race to abandon current attempt and start over
- Race times are recorded with 0.1ms precision for competitive comparison

### Advanced Strategies

#### **Checkpoint Memorization**
Learn the exact sequence to anticipate controls:
1. **100m**: Acceleration (right control) - First boost opportunity
2. **200m**: Brake (left control) - First brake zone
3. **350m**: Acceleration (right control) - Mid-track boost
4. **400m**: Brake (left control) - Mid-track brake zone
5. **600m**: Acceleration (right control) - Late-race boost
6. **700m**: Brake (left control) - Late-race brake zone
7. **850m**: Acceleration (right control) - Final boost opportunity
8. **900m**: Brake (left control) - Final brake zone

#### **Reaction Time Optimization**
- **Watch the track visualization** to see upcoming checkpoint markers
- **Keep fingers ready** on A/D keys or thumbs positioned over buttons
- **React to color change and "PRESS NOW!" text**, not distance numbers
- **Practice the rhythm** - checkpoints follow a predictable alternating pattern
- **Use peripheral vision** to watch for control state changes while monitoring your progress

#### **Speed Management**
- **Hit every checkpoint** - consistency beats perfection in achieving fast times
- **Avoid penalties at all costs** - one red-state press can ruin a good time
- **Layer speed boosts** - multiple active modifiers stack for maximum speed advantage
- **Time your inputs strategically** - wait for the 100ms cooldown between button presses
- **React quickly within green windows** - faster reactions provide bigger multipliers and longer boost durations

### Scoring and Performance

#### **Time Calculation**
- **Base race time**: ~20 seconds at constant 50 m/s (1000m ÷ 50 m/s)
- **Optimized time**: ~15-17 seconds with good checkpoint execution
- **World-class time**: Sub-15 seconds requires near-perfect reactions and timing

#### **Performance Metrics**
- **Final Race Time**: Displayed with 0.1ms precision (e.g., "14.567s")
- **Distance Covered**: Should always equal 1000m for completed races
- **Average Speed**: Overall speed including all speed modifications
- **Active Modifiers**: Real-time display of current speed boosts and penalties

#### **Competitive Elements**
- **Millisecond Precision**: Times recorded to 0.1ms accuracy for competitive racing
- **Skill-Based Gameplay**: No luck involved - pure reaction time and consistency
- **Replay Value**: Always room to shave off a few more milliseconds
- **Social Sharing**: Post your best times to Reddit for community challenges

### Troubleshooting

#### **Common Issues**
- **Controls not responding**: Ensure game window has focus, or wait for 100ms input cooldown to reset
- **Laggy performance**: Close other browser tabs and applications for better performance
- **Mobile touch issues**: Ensure you're tapping directly on the button areas (enhanced touch targets: minimum 44px)
- **Timing feels off**: Game requires precise timing - practice makes perfect!
- **Button spam not working**: Input cooldown prevents rapid clicking - time your presses strategically
- **Network errors**: Check the error display at the top of the screen for connection issues and retry options
- **Performance warnings**: If you see performance warnings, try closing other applications or refreshing the game

#### **Performance Tips**
- **Use a stable internet connection** for consistent timing and smooth gameplay
- **Close unnecessary browser tabs** to free up system resources
- **Play in full-screen mode** for the best visual experience and focus
- **Ensure good lighting** to clearly see control state changes
- **Practice regularly** to develop muscle memory for the checkpoint sequence
- **Monitor the performance display** - the game tracks FPS and warns if performance drops

#### **Mobile-Specific Tips**
- **Use landscape orientation** for better visibility of the track and controls
- **Ensure proper touch target sizing** - buttons are optimized with minimum 44px touch targets
- **Disable browser zoom** to prevent accidental zooming during gameplay
- **Close background apps** to free up device resources for smooth 60fps performance

The F1 Reaction Game rewards dedication and practice. Start by focusing on hitting every checkpoint consistently, then work on improving your reaction times within the green windows. Every millisecond counts in the pursuit of the perfect lap!

## Current Game Status 🎮

The F1 Reaction Game is **fully implemented and playable** with all core features operational:

✅ **Complete Game Implementation**
- Full React-based game engine with TypeScript
- High-precision timing system using `performance.now()`
- Real-time physics with 60fps animation loops
- Complete checkpoint system with brake and acceleration zones
- Cross-platform input handling (keyboard + touch)
- Three-column responsive UI layout
- Race completion detection and statistics

✅ **All Game Mechanics Working**
- 8 strategic checkpoints (4 brake, 4 acceleration) at precise distances
- 2-second timing windows with red/green visual states
- Speed modification system with reaction-based bonuses
- Anti-spam protection and input cooldown systems
- Real-time speed and distance tracking
- Race timer with 0.1ms precision

✅ **User Interface Complete**
- Animated track visualization with car position indicator and interactive tooltips
- Control buttons with clear visual feedback and status indicators
- Real-time performance metrics and debug information
- Race completion overlay with detailed statistics
- Mobile-optimized touch controls with enhanced touch targets (44px minimum)
- Enhanced visual feedback with hover states and detailed position information

✅ **Error Handling & Performance**
- Comprehensive error boundaries with fallback UI and recovery options
- Network error handling with automatic retry logic and user-friendly messages
- Performance monitoring with real-time FPS tracking and optimization warnings
- Graceful degradation under adverse conditions

## Latest Improvements 🚀

### Enhanced Mobile Experience
- **Improved Touch Targets**: Enhanced touch target sizing with minimum 44px for accessibility across all screen sizes
- **Responsive Breakpoints**: Optimized layouts for 1024px, 768px, 480px, and 360px screen widths
- **Mobile-First Design**: Progressive enhancement from mobile to desktop with proper touch handling
- **Key Hint Management**: Smart hiding of keyboard hints on mobile devices to reduce visual clutter

### Enhanced Interactive Experience
- **Interactive Tooltips**: Hover over car position and checkpoint markers for detailed information
- **Real-time Position Tracking**: Car position tooltip shows exact distance, percentage completion, and progress
- **Checkpoint Information**: Hover over track markers to see checkpoint types and distances
- **Enhanced Visual Feedback**: Improved user interaction with informative hover states

### Streamlined Three-Column Layout
- **Clean Interface**: Simplified three-column layout with speed (left), race timer (center), and distance progress (right)
- **Focused Information**: Essential game metrics displayed without clutter for better gameplay focus
- **Responsive Design**: Layout adapts seamlessly across desktop and mobile devices
- **Visual Clarity**: Streamlined display prioritizes the most important race information

### Enhanced Visual Feedback System
- **Active Checkpoint Alerts**: Bright green pulsing indicators with "🛑 BRAKE" and "⚡ BOOST" messages in center column
- **Smart Cooldowns**: 100ms input cooldown prevents accidental spam while maintaining responsiveness
- **Penalty Protection**: Anti-stacking system prevents multiple penalties from rapid button mashing
- **Reaction Multipliers**: Faster reactions now provide bigger speed boosts (up to 1.5x for sub-200ms reactions)
- **Input Validation**: Robust input handling ensures fair gameplay across all devices
- **Visual Feedback**: Clear "PRESS NOW!" and "WAIT..." status indicators with pressed state animations

### Advanced Error Handling & Performance
- **Comprehensive Error Boundaries**: React error boundaries with fallback UI and recovery options
- **Network Error Management**: Automatic retry logic with user-friendly error messages and connection status
- **Performance Monitoring**: Real-time FPS tracking with GamePerformanceMonitor and optimization warnings
- **Graceful Degradation**: Maintains functionality even under adverse network or performance conditions

### Advanced Game Mechanics
- **Precise Timing Windows**: Each checkpoint provides exactly 2-second green windows for optimal input
- **Speed Modifier Stacking**: Multiple active speed boosts can stack for maximum velocity advantage
- **Real-time Physics**: Car movement calculated with precise delta time using `requestAnimationFrame` at 60fps
- **Intelligent Checkpoint Detection**: Advanced TrackManager system with precise car position tracking
- **State Optimization**: Improved re-render prevention to avoid unnecessary state updates
- **Dynamic Speed Display**: Real-time speed indicators showing current velocity and active modifiers

### Performance Optimizations
- **Memory Management**: Efficient cleanup of expired speed modifiers and timing references
- **State Synchronization**: Enhanced game state management with optimized component communication
- **Animation Smoothness**: Optimized rendering pipeline for consistent 60fps performance across devices
- **Mobile Optimization**: Touch-optimized controls with responsive design and proper touch target sizing
- **React Optimization**: Smart use of useCallback, useMemo, and state change detection for minimal re-renders

### User Experience Enhancements
- **Race Complete Overlay**: Beautiful completion screen with detailed statistics and restart options
- **Track Visualization**: Animated track with car position indicator and dashed center line
- **Next Checkpoint Indicator**: Shows upcoming checkpoint type and distance for better preparation
- **Active Checkpoint Pulsing**: Eye-catching green pulsing animation when checkpoints are active
- **Comprehensive Debug Info**: Real-time display of all game mechanics for transparency and learning
- **Speed Modifier Visualization**: Clear indicators showing active boosts (+) and penalties (-) with amounts
- **Interactive Elements**: Enhanced user engagement through informative tooltips and hover states

## Technical Features

### Built With
- **[Devvit](https://developers.reddit.com/)**: Reddit's developer platform for immersive games
- **[React 18](https://react.dev/)**: Modern React with hooks-based state management and StrictMode
- **[TypeScript](https://www.typescriptlang.org/)**: Full type safety across client and server
- **[Vite](https://vite.dev/)**: Lightning-fast build tool and development server
- **[Express](https://expressjs.com/)**: Backend API for Reddit integration
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for responsive design
- **High-Precision Timing**: Custom GameTimer class using `performance.now()`
- **Custom CSS Animations**: Hand-crafted animations for control states and visual feedback
- **Performance Monitoring**: Built-in GamePerformanceMonitor for real-time performance tracking

### Architecture Highlights
- **Modular Component Design**: Separate React components for F1Game, GameDisplay, ControlInterface, ErrorBoundary, and NetworkErrorDisplay with clear responsibilities
- **Three-Column Layout System**: Organized UI with performance metrics, race timer, and strategic information columns
- **Custom Hook Architecture**: useGameState, useTrackManager, usePerformanceMonitor, and useNetworkError hooks for clean state management
- **Real-time Physics**: 60fps game loop with `requestAnimationFrame` and precise delta time calculations for smooth movement
- **Cross-platform Input**: Unified handling for keyboard (A/D, Arrow keys) and touch events with enhanced touch targets (44px minimum)
- **Type-Safe State Management**: Full TypeScript interfaces for Track, Car, GameState, SpeedModifiers, and all game entities
- **Responsive Design**: Mobile-first approach with desktop enhancements and properly sized touch targets across all screen sizes
- **Performance Optimized**: Efficient re-rendering with React optimization patterns, state change detection, and performance monitoring
- **Anti-Spam Protection**: Input cooldowns and penalty stacking prevention for fair gameplay experience
- **Advanced Timing System**: Custom GameTimer class with 0.1ms precision using `performance.now()` for competitive accuracy
- **Intelligent Checkpoint System**: TrackManager and CarManager classes handle complex game physics and state transitions
- **Visual State Management**: Dynamic control states with pulsing animations, clear status indicators, and visual feedback
- **Error Handling**: Comprehensive error boundaries, network error handling, and performance warnings with recovery options
- **State Synchronization**: Optimized game state updates with change detection to prevent unnecessary re-renders
- **Memory Efficient**: Proper cleanup of expired modifiers, animation frames, and event listeners
- **Enhanced Visual Feedback**: Interactive tooltips, streamlined debug information, and improved checkpoint indicators
- **Immersive Track Visualization**: Animated track with checkpoint markers, car position indicator, and progress tracking

## Development Commands

> **Prerequisites**: Node.js 22+ required

- `npm run dev`: Start development server with live Reddit integration (runs client, server, and devvit in parallel)
- `npm run build`: Build client and server bundles for production
- `npm run deploy`: Upload new version to Reddit
- `npm run launch`: Build, deploy, and publish app for Reddit review
- `npm run login`: Authenticate with Reddit developers
- `npm run check`: Run type checking, linting, and formatting
- `npm run dev:vite`: Start Vite dev server on port 7474 for local development

## Getting Started for Developers

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd f1-reaction-game
   npm install
   ```

2. **Reddit Setup**
   - Create a Reddit account and connect to [Reddit Developers](https://developers.reddit.com/)
   - Run `npm run login` to authenticate your CLI

3. **Development**
   ```bash
   npm run dev
   ```
   - Opens a test subreddit with your game
   - Live reload for instant development feedback
   - Full Reddit integration testing

4. **Testing Your Game**
   - Navigate to the provided playtest URL
   - Click "Launch App" in the Reddit post
   - Game opens in full-screen mode within Reddit

## Project Structure

```
src/
├── client/                 # React frontend
│   ├── components/        # Game UI components
│   │   ├── F1Game.tsx    # Main game container and orchestrator
│   │   ├── GameDisplay.tsx # Timer, distance, and debug UI
│   │   └── ControlInterface.tsx # Brake/acceleration input controls
│   ├── hooks/            # Custom React hooks
│   │   ├── useGameState.ts # Core game state management
│   │   └── useTrackManager.ts # Track checkpoint logic
│   ├── App.tsx          # Root app component
│   ├── main.tsx         # React entry point
│   ├── index.html       # HTML template
│   └── index.css        # Game styling and animations
├── server/               # Express backend
│   ├── core/            # Business logic
│   │   └── post.ts      # Post creation functionality
│   └── index.ts         # API endpoints and Reddit integration
└── shared/              # Shared types and utilities
    ├── types/           # TypeScript interfaces
    │   ├── game.ts      # Core game data models
    │   ├── timer.ts     # High-precision GameTimer class
    │   ├── track.ts     # TrackManager class
    │   ├── car.ts       # CarManager class
    │   └── index.ts     # Type exports
    └── validation/      # Data validation logic
        ├── gameValidation.ts # Game config validation
        └── checkpointValidation.ts # Checkpoint timing validation
```

## Contributing

This game is built for the Reddit community. Contributions welcome for:
- Performance optimizations
- New game modes
- Enhanced mobile experience
- Accessibility improvements
- Leaderboard features

## AI Development Integration

This project includes pre-configured AI development integration with comprehensive specifications and task management in the `.kiro/specs/` directory for enhanced development experience with AI coding assistants.
