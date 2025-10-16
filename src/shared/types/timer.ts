/**
 * High-precision GameTimer class for F1 Reaction Game
 * Requirements: 2.3, 6.1, 6.4
 * Provides 0.1 millisecond precision timing using performance.now()
 */

export class GameTimer {
  private startTime: number = 0;
  private lastFrameTime: number = 0;
  private isRunning: boolean = false;
  private pausedTime: number = 0;
  private totalPausedDuration: number = 0;

  constructor() {
    // Initialize timer state
  }

  /**
   * Start the timer
   * Sets the start time to current high-precision timestamp
   */
  start(): void {
    if (!this.isRunning) {
      const currentTime = performance.now();
      this.startTime = currentTime - this.totalPausedDuration;
      this.lastFrameTime = currentTime;
      this.isRunning = true;
    }
  }

  /**
   * Stop the timer
   * Preserves the current elapsed time
   */
  stop(): void {
    if (this.isRunning) {
      this.pausedTime = performance.now();
      this.isRunning = false;
    }
  }

  /**
   * Reset the timer to zero
   * Clears all timing state
   */
  reset(): void {
    this.startTime = 0;
    this.lastFrameTime = 0;
    this.isRunning = false;
    this.pausedTime = 0;
    this.totalPausedDuration = 0;
  }

  /**
   * Get current elapsed time in milliseconds
   * Returns time with 0.1ms precision
   * @returns Elapsed time in milliseconds, rounded to 0.1ms precision
   */
  getCurrentTime(): number {
    if (!this.isRunning) {
      if (this.pausedTime > 0) {
        // Return time when paused
        return Math.round((this.pausedTime - this.startTime) * 10) / 10;
      }
      return 0;
    }
    
    const currentTime = performance.now();
    const elapsed = currentTime - this.startTime;
    
    // Round to 0.1ms precision (e.g., 1.005 seconds)
    return Math.round(elapsed * 10) / 10;
  }

  /**
   * Get time delta since last frame
   * Useful for animation and physics calculations
   * @returns Delta time in milliseconds
   */
  getDeltaTime(): number {
    if (!this.isRunning) {
      return 0;
    }

    const currentTime = performance.now();
    const delta = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    
    // Cap delta time to prevent huge jumps (max 100ms = 0.1 seconds)
    const cappedDelta = Math.min(delta, 100);
    

    
    return cappedDelta;
  }

  /**
   * Check if timer is currently running
   * @returns True if timer is active
   */
  getIsRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Get the start time timestamp
   * @returns Start time in performance.now() format
   */
  getStartTime(): number {
    return this.startTime;
  }

  /**
   * Get current time formatted for display
   * @returns Formatted time string (e.g., "1.005")
   */
  getFormattedTime(): string {
    const time = this.getCurrentTime();
    return (time / 1000).toFixed(3);
  }
}
