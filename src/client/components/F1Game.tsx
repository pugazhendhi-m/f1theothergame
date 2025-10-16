/**
 * Main F1 Reaction Game Component
 * Orchestrates all game components and manages game flow
 * Requirements: All requirements integration
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
import { useNetworkError } from '../hooks/useNetworkError';
import { ControlInterface } from './ControlInterface';
import { GameDisplay } from './GameDisplay';
import { ErrorBoundary } from './ErrorBoundary';
import { NetworkErrorDisplay } from './NetworkErrorDisplay';
import { PerformanceWarning } from './PerformanceWarning';
import { createDefaultGameConfig } from '../../shared/validation/gameValidation';
import { GamePerformanceMonitor } from '../utils/performanceTest';

export const F1Game: React.FC = () => {
  const gameConfig = createDefaultGameConfig();
  const { gameState, actions, getters } = useGameState(gameConfig);
  const { startMonitoring, stopMonitoring, resetMetrics } = usePerformanceMonitor();
  const { handleNetworkError } = useNetworkError();
  const [hasInitialized, setHasInitialized] = useState(false);
  const [gamePerformanceMonitor] = useState(() => new GamePerformanceMonitor());

  /**
   * Initialize game and start monitoring
   */
  useEffect(() => {
    try {
      // Start performance monitoring
      startMonitoring();
      setHasInitialized(true);
    } catch (error) {
      console.error('Failed to initialize game:', error);
      handleNetworkError(error as Error);
    }

    return () => {
      stopMonitoring();
    };
  }, [startMonitoring, stopMonitoring, handleNetworkError]);

  /**
   * Handle game state changes for performance monitoring
   */
  useEffect(() => {
    if (gameState.gameStatus === 'running') {
      resetMetrics();
    }
  }, [gameState.gameStatus, resetMetrics]);



  /**
   * Handle brake input from player with error handling
   * Requirements: 3.4, 3.5
   */
  const handleBrakeInput = useCallback(() => {
    try {
      if (gameState.gameStatus !== 'running') return;
      actions.handleControlInput('brake');
    } catch (error) {
      console.error('Error handling brake input:', error);
      handleNetworkError(error as Error);
    }
  }, [gameState.gameStatus, actions, handleNetworkError]);

  /**
   * Handle acceleration input from player with error handling
   * Requirements: 3.4, 3.5
   */
  const handleAccelerationInput = useCallback(() => {
    try {
      if (gameState.gameStatus !== 'running') return;
      actions.handleControlInput('acceleration');
    } catch (error) {
      console.error('Error handling acceleration input:', error);
      handleNetworkError(error as Error);
    }
  }, [gameState.gameStatus, actions, handleNetworkError]);

  /**
   * Handle race start with error handling
   */
  const handleStartRace = useCallback(() => {
    try {
      actions.startRace();
      resetMetrics();
      gamePerformanceMonitor.start();
    } catch (error) {
      console.error('Error starting race:', error);
      handleNetworkError(error as Error);
    }
  }, [actions, resetMetrics, handleNetworkError, gamePerformanceMonitor]);

  /**
   * Handle race restart with error handling
   */
  const handleRestartRace = useCallback(() => {
    try {
      actions.restartRace();
      resetMetrics();
      gamePerformanceMonitor.start();
    } catch (error) {
      console.error('Error restarting race:', error);
      handleNetworkError(error as Error);
    }
  }, [actions, resetMetrics, handleNetworkError, gamePerformanceMonitor]);

  // Show loading state if not initialized
  if (!hasInitialized) {
    return (
      <div className="f1-game">
        <div className="game-background">
          <div style={{ textAlign: 'center', color: 'white' }}>
            <h2>🏎️ Loading F1 Reaction Game...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="f1-game">
        {/* Error and Warning Displays */}
        <div style={{ position: 'fixed', top: '10px', left: '10px', right: '10px', zIndex: 150 }}>
          <NetworkErrorDisplay />
          <PerformanceWarning />
        </div>

        {/* Background */}
        <div className="game-background">
          <div className="track-visualization">
            <div className="track-line" />
            
            {/* Brake Point Markers */}
            {gameState.track.brakePoints.map((point) => (
              <div
                key={`brake-${point}`}
                className="checkpoint-marker brake-marker"
                style={{ left: `${(point / gameState.track.distance) * 100}%` }}
                title={`Brake Point: ${point}m`}
              >
                🛑
              </div>
            ))}
            
            {/* Straight Point Markers */}
            {gameState.track.straightPoints.map((point) => (
              <div
                key={`straight-${point}`}
                className="checkpoint-marker straight-marker"
                style={{ left: `${(point / gameState.track.distance) * 100}%` }}
                title={`Boost Point: ${point}m`}
              >
                ⚡
              </div>
            ))}
            
            <div 
              className="car-position" 
              style={{ 
                left: `${Math.min((gameState.car.distanceCovered / gameState.track.distance) * 100, 100)}%`,
                transition: gameState.gameStatus === 'running' ? 'left 0.1s linear' : 'none'
              }}
              title={`Car Position: ${Math.round(gameState.car.distanceCovered)}m / ${gameState.track.distance}m (${((gameState.car.distanceCovered / gameState.track.distance) * 100).toFixed(1)}%)`}
            >
              🏎️
            </div>
          </div>
        </div>

        {/* Start/Restart Button - Bottom Center */}
        <div className="game-controls">
          <button
            className="start-button"
            onClick={gameState.gameStatus === 'idle' ? handleStartRace : handleRestartRace}
          >
            {gameState.gameStatus === 'idle' ? 'START RACE' : 'RESTART RACE'}
          </button>
        </div>

        {/* Game Display */}
        <ErrorBoundary fallback={
          <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
            Game display temporarily unavailable
          </div>
        }>
          <GameDisplay
            gameState={gameState}
            formattedRaceTime={getters.getFormattedRaceTime()}
          />
        </ErrorBoundary>

        {/* Control Interface */}
        <ErrorBoundary fallback={
          <div style={{ 
            position: 'fixed', 
            bottom: '20px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            color: 'white', 
            textAlign: 'center', 
            padding: '20px',
            background: 'rgba(0,0,0,0.8)',
            borderRadius: '8px'
          }}>
            Controls temporarily unavailable. Please refresh the game.
          </div>
        }>
          <ControlInterface
            brakeState={gameState.activeControls.brake}
            accelerationState={gameState.activeControls.acceleration}
            onBrakeInput={handleBrakeInput}
            onAccelerationInput={handleAccelerationInput}
            disabled={gameState.gameStatus !== 'running'}
          />
        </ErrorBoundary>

        {/* Race Complete Overlay */}
        {gameState.gameStatus === 'finished' && (
          <div className="race-complete-overlay">
            <div className="race-complete-content">
              <h2>🏁 Race Complete!</h2>
              <div className="final-time">
                {gameState.track.raceTime ? (gameState.track.raceTime / 1000).toFixed(3) : '0.000'}s
              </div>
              <button 
                className="restart-button"
                onClick={handleRestartRace}
              >
                Race Again
              </button>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};
