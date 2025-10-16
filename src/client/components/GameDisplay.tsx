/**
 * Game Display Component for F1 Reaction Game
 * Shows race timer, distance, and debug information
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

import React from 'react';
import { GameState } from '../../shared/types/game';

interface GameDisplayProps {
  gameState: GameState;
  formattedRaceTime: string;
}

export const GameDisplay: React.FC<GameDisplayProps> = ({
  gameState,
  formattedRaceTime
}) => {
  const { track, car, gameStatus, activeControls } = gameState;

  /**
   * Calculate progress percentage
   */
  const progressPercentage = Math.min((car.distanceCovered / track.distance) * 100, 100);

  /**
   * Format distance for display
   */
  const formatDistance = (distance: number): string => {
    return `${Math.round(distance)}m`;
  };

  /**
   * Get next checkpoint information
   */
  const getNextCheckpoint = () => {
    const nextBrakePoint = track.brakePoints.find(point => point > car.distanceCovered);
    const nextStraightPoint = track.straightPoints.find(point => point > car.distanceCovered);
    
    const checkpoints = [];
    if (nextBrakePoint !== undefined) {
      checkpoints.push({ type: 'brake', distance: nextBrakePoint });
    }
    if (nextStraightPoint !== undefined) {
      checkpoints.push({ type: 'straight', distance: nextStraightPoint });
    }
    
    return checkpoints.sort((a, b) => a.distance - b.distance)[0];
  };

  const nextCheckpoint = getNextCheckpoint();

  return (
    <div className="game-display">
      {/* Race Timer - Center Top */}
      <div className="center-column">
        <div className="race-timer">
          <div className="timer-label">Race Time</div>
          <div className="timer-value">
            {gameStatus === 'finished' && track.raceTime !== null
              ? (track.raceTime / 1000).toFixed(3)
              : formattedRaceTime
            }s
          </div>
        </div>
      </div>

      {/* Speed and Distance - Side by side on mobile, separate columns on desktop */}
      <div className="left-column">
        <div className="speed-display">
          <div className="speed-label">Speed</div>
          <div className={`speed-value ${car.currentSpeed > 0 ? 'moving' : 'stopped'}`}>
            {Math.round(car.currentSpeed)} m/s
          </div>
        </div>
      </div>

      <div className="right-column">
        <div className="distance-display">
          <div className="distance-label">Distance</div>
          <div className="distance-value">
            {formatDistance(car.distanceCovered)} / {formatDistance(track.distance)}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="progress-percentage">{progressPercentage.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
};
