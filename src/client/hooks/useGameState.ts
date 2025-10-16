import { useCallback, useEffect, useRef, useState } from 'react';
import { GameTimer, GameState, GameConfig, Track, Car, ControlState } from '../../shared/types';
import { CarManager } from '../../shared/types/car';
import { TrackManager } from '../../shared/types/track';

/**
 * Game state management hook for F1 Reaction Game
 * Requirements: 1.2, 1.4, 2.5
 * Manages Track, Car, and game status with state transitions
 */

// Default game configuration
const DEFAULT_GAME_CONFIG: GameConfig = {
  track: {
    distance: 1000, // 1km track
    averageSpeed: 50, // 50 m/s base speed
    brakePoints: [200, 400, 700, 900], // Brake checkpoints
    straightPoints: [100, 350, 600, 850], // Acceleration checkpoints
    speedIncrease: 15, // +15 m/s boost
    pointDuration: 2000, // 2 second windows
    speedDecrease: 10, // -10 m/s penalty
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

// Input cooldown tracking
interface InputCooldown {
  brake: number;
  acceleration: number;
}

// Create initial game state
const createInitialGameState = (config: GameConfig): GameState => {
  const track: Track = {
    distance: config.track.distance,
    averageSpeed: config.track.averageSpeed,
    raceTime: null,
    brakePoints: [...config.track.brakePoints],
    straightPoints: [...config.track.straightPoints],
    speedIncrease: config.track.speedIncrease,
    pointDuration: config.track.pointDuration,
    speedDecrease: config.track.speedDecrease,
  };

  const car: Car = {
    distanceCovered: 0,
    currentSpeed: config.track.averageSpeed,
    baseSpeed: config.track.averageSpeed,
    speedModifiers: [],
  };

  const controlState: ControlState = {
    isActive: false,
    activatedAt: 0,
    duration: 0,
  };

  return {
    track,
    car,
    gameStatus: 'idle',
    activeControls: {
      brake: { ...controlState },
      acceleration: { ...controlState },
    },
    raceStartTime: null,
  };
};

export const useGameState = (config: GameConfig = DEFAULT_GAME_CONFIG) => {
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState(config));

  const [timer] = useState(() => new GameTimer());
  const [carManager] = useState(() => new CarManager(createInitialGameState(config).car));
  const [trackManager] = useState(() => new TrackManager(createInitialGameState(config).track));
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Track input cooldowns to prevent spam clicking
  const inputCooldownRef = useRef<InputCooldown>({ brake: 0, acceleration: 0 });

  // Track active penalties to prevent stacking
  const activePenaltiesRef = useRef<Set<'brake' | 'acceleration'>>(new Set());

  // Start a new race
  const startRace = useCallback(() => {
    console.log('🏁 Starting race...');
    
    timer.reset();
    timer.start();

    const initialState = createInitialGameState(config);
    carManager.reset(initialState.car.baseSpeed);
    trackManager.reset();

    // Reset input cooldowns and penalties
    inputCooldownRef.current = { brake: 0, acceleration: 0 };
    activePenaltiesRef.current.clear();

    console.log(`🏎️ Car initialized at speed: ${initialState.car.currentSpeed} m/s`);

    setGameState(() => ({
      ...initialState,
      gameStatus: 'running',
      raceStartTime: performance.now(),
    }));
  }, [config, timer, carManager, trackManager]);

  // Stop the current race
  const stopRace = useCallback(() => {
    timer.stop();

    setGameState((prevState) => ({
      ...prevState,
      gameStatus: 'finished',
      track: {
        ...prevState.track,
        raceTime: timer.getCurrentTime(),
      },
    }));
  }, [timer]);

  // Reset game to idle state
  const resetGame = useCallback(() => {
    timer.reset();

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const initialState = createInitialGameState(config);
    carManager.reset(initialState.car.baseSpeed);
    trackManager.reset();

    // Reset input cooldowns and penalties
    inputCooldownRef.current = { brake: 0, acceleration: 0 };
    activePenaltiesRef.current.clear();

    setGameState(initialState);
  }, [config, timer, carManager, trackManager]);

  // Restart race (reset and start)
  const restartRace = useCallback(() => {
    resetGame();
    // Use setTimeout to ensure state update completes before starting
    setTimeout(() => startRace(), 0);
  }, [resetGame, startRace]);

  // Update car position based on current speed and delta time
  const updateCarPosition = useCallback(
    (deltaTime: number) => {
      setGameState((prevState) => {
        if (prevState.gameStatus !== 'running') {
          return prevState;
        }

        const { track } = prevState;
        const previousDistance = prevState.car.distanceCovered;

        // Update car position using CarManager
        carManager.updatePosition(deltaTime, track.distance);
        carManager.updateCurrentSpeed();

        // Get updated car state
        const updatedCar = carManager.getCar();

        // Log significant position changes
        const distanceChange = updatedCar.distanceCovered - previousDistance;
        if (distanceChange > 0 && Math.floor(updatedCar.distanceCovered / 50) > Math.floor(previousDistance / 50)) {
          console.log(`🏎️ Car position: ${Math.round(updatedCar.distanceCovered)}m, Speed: ${Math.round(updatedCar.currentSpeed)} m/s`);
        }

        // Check if race is complete
        const isRaceComplete = carManager.isRaceComplete(track.distance);

        if (isRaceComplete) {
          // Race finished - stop timer and update state
          timer.stop();
          return {
            ...prevState,
            car: updatedCar,
            gameStatus: 'finished',
            track: {
              ...track,
              raceTime: timer.getCurrentTime(),
            },
          };
        }

        return {
          ...prevState,
          car: updatedCar,
        };
      });
    },
    [carManager, timer]
  );

  // Update speed modifiers (remove expired ones, apply active ones)
  const updateSpeedModifiers = useCallback(() => {
    setGameState((prevState) => {
      if (prevState.gameStatus !== 'running') {
        return prevState;
      }

      // CarManager handles speed modifier updates internally
      carManager.updateCurrentSpeed();
      const updatedCar = carManager.getCar();

      return {
        ...prevState,
        car: updatedCar,
      };
    });
  }, [carManager]);

  // Add a speed modifier to the car
  const addSpeedModifier = useCallback(
    (type: 'increase' | 'decrease', amount: number, duration: number) => {
      setGameState((prevState) => {
        if (prevState.gameStatus !== 'running') {
          return prevState;
        }

        // Use CarManager to add speed modifier
        carManager.addSpeedModifier(type, amount, duration);
        const updatedCar = carManager.getCar();

        return {
          ...prevState,
          car: updatedCar,
        };
      });
    },
    [carManager]
  );

  // Handle control input (brake or acceleration)
  const handleControlInput = useCallback(
    (controlType: 'brake' | 'acceleration') => {
      const currentTime = performance.now();

      // Check input cooldown - prevent spam clicking
      if (currentTime - inputCooldownRef.current[controlType] < 100) {
        // 100ms cooldown
        return;
      }

      setGameState((prevState) => {
        if (prevState.gameStatus !== 'running') {
          return prevState;
        }

        const isControlActive = trackManager.isControlActive(controlType, currentTime);

        if (isControlActive) {
          // Player pressed during green state - apply speed boost and deactivate control
          const remainingDuration = trackManager.getRemainingDuration(controlType, currentTime);

          // Calculate reaction time bonus (faster reaction = bigger bonus)
          const reactionTime = currentTime - prevState.activeControls[controlType].activatedAt;
          let speedBonus = prevState.track.speedIncrease;

          // Bonus for quick reactions (within 200ms = 1.5x, within 500ms = 1.2x)
          if (reactionTime <= 200) {
            speedBonus *= 1.5;
          } else if (reactionTime <= 500) {
            speedBonus *= 1.2;
          }

          // CRITICAL: Use the EXACT remaining duration for speed boost
          // This ensures that even millisecond differences affect the final race time
          const preciseRemainingDuration = Math.max(0, remainingDuration);

          console.log(`✅ ${controlType} pressed during GREEN! Reaction: ${reactionTime.toFixed(1)}ms, Bonus: +${speedBonus.toFixed(1)} m/s for ${preciseRemainingDuration.toFixed(1)}ms`);

          // Add speed modifier with precise remaining duration
          carManager.addSpeedModifier('increase', speedBonus, preciseRemainingDuration);

          // Deactivate the control immediately
          trackManager.deactivateControl(controlType);

          // Set input cooldown
          inputCooldownRef.current[controlType] = currentTime;

          // Get updated states
          const updatedCar = carManager.getCar();
          const updatedControlStates = trackManager.getControlStates(currentTime);

          return {
            ...prevState,
            car: updatedCar,
            activeControls: updatedControlStates,
          };
        } else {
          // Player pressed during red state - apply penalty (only if no active penalty for this control)
          if (!activePenaltiesRef.current.has(controlType)) {
            console.log(`❌ ${controlType} pressed during RED! Penalty: -${prevState.track.speedDecrease} m/s`);
            carManager.addSpeedModifier('decrease', prevState.track.speedDecrease, 1000);

            // Mark penalty as active
            activePenaltiesRef.current.add(controlType);

            // Remove penalty from active set after duration
            setTimeout(() => {
              activePenaltiesRef.current.delete(controlType);
            }, 1000);

            // Set input cooldown
            inputCooldownRef.current[controlType] = currentTime;

            const updatedCar = carManager.getCar();

            return {
              ...prevState,
              car: updatedCar,
            };
          }

          // If penalty is already active, ignore the input
          return prevState;
        }
      });
    },
    [carManager, trackManager]
  );

  // Update control states (activate/deactivate based on car position)
  const updateControlStates = useCallback(() => {
    setGameState((prevState) => {
      if (prevState.gameStatus !== 'running') {
        return prevState;
      }

      const { car } = prevState;
      const currentTime = performance.now();

      // Check for new checkpoint activations
      const brakeEvent = trackManager.checkBrakePoints(car.distanceCovered, currentTime);
      const straightEvent = trackManager.checkStraightPoints(car.distanceCovered, currentTime);

      // Debug logging for checkpoint events
      if (brakeEvent) {
        console.log(`🛑 Brake checkpoint activated at ${brakeEvent.distance}m`);
      }
      if (straightEvent) {
        console.log(`⚡ Straight checkpoint activated at ${straightEvent.distance}m`);
      }

      // Get current control states from TrackManager
      const controlStates = trackManager.getControlStates(currentTime);

      // Check if control states actually changed to avoid unnecessary re-renders
      const brakeChanged = controlStates.brake.isActive !== prevState.activeControls.brake.isActive ||
                          controlStates.brake.activatedAt !== prevState.activeControls.brake.activatedAt;
      const accelerationChanged = controlStates.acceleration.isActive !== prevState.activeControls.acceleration.isActive ||
                                 controlStates.acceleration.activatedAt !== prevState.activeControls.acceleration.activatedAt;

      if (brakeChanged || accelerationChanged || brakeEvent || straightEvent) {
        return {
          ...prevState,
          activeControls: controlStates,
        };
      }

      return prevState;
    });
  }, [trackManager]);

  // Get current race time from timer
  const getCurrentRaceTime = useCallback(() => {
    return timer.getCurrentTime();
  }, [timer]);

  // Get formatted race time for display
  const getFormattedRaceTime = useCallback(() => {
    return timer.getFormattedTime();
  }, [timer]);

  // Performance optimization: Track frame count and timing
  const frameCountRef = useRef(0);
  const lastPerformanceLogRef = useRef(0);

  // Game loop effect - runs during active races
  useEffect(() => {
    if (gameState.gameStatus === 'running') {
      console.log('🎮 Starting game loop...');
      frameCountRef.current = 0;
      lastPerformanceLogRef.current = performance.now();
      
      const gameLoop = () => {
        const deltaTime = timer.getDeltaTime();
        frameCountRef.current++;
        
        // Performance logging every 60 frames (roughly 1 second at 60fps)
        if (frameCountRef.current % 60 === 0) {
          const currentTime = performance.now();
          const elapsed = currentTime - lastPerformanceLogRef.current;
          const fps = Math.round(60000 / elapsed);
          console.log(`🔄 Performance: ${fps} FPS, car=${Math.round(gameState.car.distanceCovered)}m`);
          lastPerformanceLogRef.current = currentTime;
        }

        // Batch updates to reduce re-renders
        const startTime = performance.now();
        
        updateCarPosition(deltaTime);
        updateSpeedModifiers();
        updateControlStates();

        const updateTime = performance.now() - startTime;
        
        // Warn if frame update takes too long (>16ms for 60fps)
        if (updateTime > 16) {
          console.warn(`⚠️ Slow frame: ${updateTime.toFixed(1)}ms (target: <16ms)`);
        }

        animationFrameRef.current = requestAnimationFrame(gameLoop);
      };

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    } else {
      console.log(`🛑 Game loop stopped. Status: ${gameState.gameStatus}`);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.gameStatus, updateCarPosition, updateSpeedModifiers, updateControlStates]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    gameState,
    timer,
    actions: {
      startRace,
      stopRace,
      resetGame,
      restartRace,
      addSpeedModifier,
      handleControlInput,
    },
    getters: {
      getCurrentRaceTime,
      getFormattedRaceTime,
    },
  } as const;
};
