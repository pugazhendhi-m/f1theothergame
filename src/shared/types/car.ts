/**
 * Car class implementation for F1 Reaction Game
 * Handles car physics, movement, and speed modifications
 * Requirements: 5.1, 5.2, 5.3, 5.4
 */

import { Car, SpeedModifier } from './game';

export class CarManager {
  private car: Car;

  constructor(initialCar: Car) {
    this.car = { ...initialCar };
  }

  /**
   * Update car position based on current speed and delta time
   * Requirements: 5.1, 5.2
   */
  updatePosition(deltaTime: number, trackDistance: number): void {
    // Convert delta time from milliseconds to seconds
    const deltaTimeSeconds = deltaTime / 1000;
    
    // Calculate distance increment based on current speed
    const distanceIncrement = this.car.currentSpeed * deltaTimeSeconds;
    
      // Update position, ensuring we don't exceed track distance
    this.car.distanceCovered = Math.min(
      this.car.distanceCovered + distanceIncrement,
      trackDistance
    );
  }

  /**
   * Apply speed modification (boost or penalty)
   * Requirements: 5.3, 5.4
   */
  addSpeedModifier(type: 'increase' | 'decrease', amount: number, duration: number): void {
    const modifier: SpeedModifier = {
      type,
      amount,
      startTime: performance.now(),
      duration
    };

    this.car.speedModifiers.push(modifier);
    this.updateCurrentSpeed();
  }

  /**
   * Update current speed based on base speed and active modifiers
   * Requirements: 5.3, 5.4
   */
  updateCurrentSpeed(): void {
    const currentTime = performance.now();
    
    // Remove expired modifiers
    this.car.speedModifiers = this.car.speedModifiers.filter(modifier => 
      (currentTime - modifier.startTime) < modifier.duration
    );

    // Calculate current speed starting from base speed
    let currentSpeed = this.car.baseSpeed;

    // Apply all active modifiers
    for (const modifier of this.car.speedModifiers) {
      if (modifier.type === 'increase') {
        currentSpeed += modifier.amount;
      } else {
        // Ensure speed doesn't go below 0
        currentSpeed = Math.max(0, currentSpeed - modifier.amount);
      }
    }

    this.car.currentSpeed = currentSpeed;
  }

  /**
   * Check if race is complete (car reached end of track)
   * Requirements: 5.5
   */
  isRaceComplete(trackDistance: number): boolean {
    return this.car.distanceCovered >= trackDistance;
  }

  /**
   * Reset car to starting position and speed
   * Requirements: 5.1
   */
  reset(baseSpeed: number): void {
    this.car = {
      distanceCovered: 0,
      currentSpeed: baseSpeed,
      baseSpeed: baseSpeed,
      speedModifiers: []
    };
  }

  /**
   * Get current car state
   */
  getCar(): Car {
    return { ...this.car };
  }

  /**
   * Get car's current position as percentage of track completion
   */
  getProgressPercentage(trackDistance: number): number {
    return Math.min((this.car.distanceCovered / trackDistance) * 100, 100);
  }

  /**
   * Get remaining duration for active speed modifiers
   */
  getActiveModifiers(): SpeedModifier[] {
    const currentTime = performance.now();
    return this.car.speedModifiers.filter(modifier => 
      (currentTime - modifier.startTime) < modifier.duration
    );
  }

  /**
   * Get debug information about car state
   */
  getDebugInfo(): {
    position: number;
    speed: number;
    baseSpeed: number;
    activeModifiers: number;
    modifierDetails: SpeedModifier[];
  } {
    return {
      position: this.car.distanceCovered,
      speed: this.car.currentSpeed,
      baseSpeed: this.car.baseSpeed,
      activeModifiers: this.car.speedModifiers.length,
      modifierDetails: [...this.car.speedModifiers]
    };
  }

  /**
   * Update car state from external source (for state synchronization)
   */
  updateCar(newCar: Car): void {
    this.car = { ...newCar };
  }
}
