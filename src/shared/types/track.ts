/**
 * Track class implementation for F1 Reaction Game
 * Handles checkpoint management and control activation logic
 * Requirements: 4.1, 4.3, 4.4
 */

import { Track, ControlState, CheckpointEvent } from './game';

export class TrackManager {
  private track: Track;
  private activeCheckpoints: Map<string, CheckpointEvent> = new Map();
  private processedCheckpoints: Set<string> = new Set();

  constructor(track: Track) {
    this.track = track;
  }

  /**
   * Check if car position triggers any brake point checkpoints
   * Requirements: 4.1, 4.3
   */
  checkBrakePoints(carDistance: number, currentTime: number): CheckpointEvent | null {
    // Find the closest brake point that the car has reached but hasn't been activated yet
    for (const brakePoint of this.track.brakePoints) {
      const checkpointKey = `brake_${brakePoint}`;
      
      // Check if car has reached this brake point and it's not already processed
      if (carDistance >= brakePoint && !this.activeCheckpoints.has(checkpointKey) && !this.processedCheckpoints.has(checkpointKey)) {
        const event: CheckpointEvent = {
          type: 'brake_point',
          distance: brakePoint,
          activatedAt: currentTime,
          duration: this.track.pointDuration
        };
        
        this.activeCheckpoints.set(checkpointKey, event);
        this.processedCheckpoints.add(checkpointKey);
        return event;
      }
    }
    return null;
  }

  /**
   * Check if car position triggers any straight point checkpoints
   * Requirements: 4.1, 4.3
   */
  checkStraightPoints(carDistance: number, currentTime: number): CheckpointEvent | null {
    // Find the closest straight point that the car has reached but hasn't been activated yet
    for (const straightPoint of this.track.straightPoints) {
      const checkpointKey = `straight_${straightPoint}`;
      
      // Check if car has reached this straight point and it's not already processed
      if (carDistance >= straightPoint && !this.activeCheckpoints.has(checkpointKey) && !this.processedCheckpoints.has(checkpointKey)) {
        const event: CheckpointEvent = {
          type: 'straight_point',
          distance: straightPoint,
          activatedAt: currentTime,
          duration: this.track.pointDuration
        };
        
        this.activeCheckpoints.set(checkpointKey, event);
        this.processedCheckpoints.add(checkpointKey);
        return event;
      }
    }
    return null;
  }

  /**
   * Get current control states based on active checkpoints
   * Requirements: 4.3, 4.4
   */
  getControlStates(currentTime: number): { brake: ControlState; acceleration: ControlState } {
    const brakeState: ControlState = {
      isActive: false,
      activatedAt: 0,
      duration: 0
    };

    const accelerationState: ControlState = {
      isActive: false,
      activatedAt: 0,
      duration: 0
    };

    // Clean up expired checkpoints first
    const expiredKeys: string[] = [];
    for (const [key, checkpoint] of this.activeCheckpoints.entries()) {
      const timeElapsed = currentTime - checkpoint.activatedAt;
      
      if (timeElapsed >= checkpoint.duration) {
        expiredKeys.push(key);
      }
    }
    
    // Remove expired checkpoints
    expiredKeys.forEach(key => this.activeCheckpoints.delete(key));

    // Set control states for remaining active checkpoints
    for (const [, checkpoint] of this.activeCheckpoints.entries()) {
      const timeElapsed = currentTime - checkpoint.activatedAt;
      
      // Double-check that checkpoint is still active (should be after cleanup above)
      if (timeElapsed < checkpoint.duration) {
        if (checkpoint.type === 'brake_point') {
          brakeState.isActive = true;
          brakeState.activatedAt = checkpoint.activatedAt;
          brakeState.duration = checkpoint.duration;
        } else if (checkpoint.type === 'straight_point') {
          accelerationState.isActive = true;
          accelerationState.activatedAt = checkpoint.activatedAt;
          accelerationState.duration = checkpoint.duration;
        }
      }
    }

    return { brake: brakeState, acceleration: accelerationState };
  }

  /**
   * Calculate remaining duration for a control activation
   * Requirements: 4.4
   */
  getRemainingDuration(controlType: 'brake' | 'acceleration', currentTime: number): number {
    const checkpointType = controlType === 'brake' ? 'brake_point' : 'straight_point';
    
    for (const checkpoint of this.activeCheckpoints.values()) {
      if (checkpoint.type === checkpointType) {
        const timeElapsed = currentTime - checkpoint.activatedAt;
        return Math.max(0, checkpoint.duration - timeElapsed);
      }
    }
    
    return 0;
  }

  /**
   * Check if a control is currently in active (green) state
   * Requirements: 4.3, 4.4
   */
  isControlActive(controlType: 'brake' | 'acceleration', currentTime: number): boolean {
    const checkpointType = controlType === 'brake' ? 'brake_point' : 'straight_point';
    
    for (const checkpoint of this.activeCheckpoints.values()) {
      if (checkpoint.type === checkpointType) {
        const timeElapsed = currentTime - checkpoint.activatedAt;
        return timeElapsed < checkpoint.duration;
      }
    }
    
    return false;
  }

  /**
   * Reset all active checkpoints (for race restart)
   * Requirements: 4.1
   */
  reset(): void {
    this.activeCheckpoints.clear();
    this.processedCheckpoints.clear();
  }

  /**
   * Deactivate a specific control type immediately (when player presses during green state)
   * Requirements: 4.3, 4.4
   */
  deactivateControl(controlType: 'brake' | 'acceleration'): void {
    const checkpointType = controlType === 'brake' ? 'brake_point' : 'straight_point';
    
    // Remove all active checkpoints of this type (they remain in processedCheckpoints)
    const keysToDelete: string[] = [];
    for (const [key, checkpoint] of this.activeCheckpoints.entries()) {
      if (checkpoint.type === checkpointType) {
        keysToDelete.push(key);
      }
    }
    
    // Delete the keys
    keysToDelete.forEach(key => this.activeCheckpoints.delete(key));
  }

  /**
   * Get track configuration
   */
  getTrack(): Track {
    return { ...this.track };
  }

  /**
   * Update track configuration
   */
  updateTrack(newTrack: Track): void {
    this.track = newTrack;
    this.reset(); // Clear active checkpoints when track changes
  }

  /**
   * Get debug information about active checkpoints
   */
  getDebugInfo(): { activeCheckpoints: CheckpointEvent[]; checkpointCount: number } {
    return {
      activeCheckpoints: Array.from(this.activeCheckpoints.values()),
      checkpointCount: this.activeCheckpoints.size
    };
  }
}
