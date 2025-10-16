/**
 * Performance Testing Utilities
 * Validates timing precision and game accuracy requirements
 * Requirements: 6.1, 6.4, 6.5
 */

interface PerformanceTestResult {
  timingPrecision: {
    passed: boolean;
    averageError: number;
    maxError: number;
    testCount: number;
  };
  frameRate: {
    passed: boolean;
    averageFps: number;
    minFps: number;
    testDuration: number;
  };
  inputLatency: {
    passed: boolean;
    averageLatency: number;
    maxLatency: number;
    testCount: number;
  };
  overall: {
    passed: boolean;
    score: number; // 0-100
  };
}

/**
 * Test timing precision against 0.1ms requirement
 */
export const testTimingPrecision = async (testDurationMs: number = 5000): Promise<PerformanceTestResult['timingPrecision']> => {
  const results: number[] = [];
  const startTime = performance.now();
  let testCount = 0;

  return new Promise((resolve) => {
    const testInterval = () => {
      const expectedTime = startTime + (testCount * 100); // Every 100ms
      const actualTime = performance.now();
      const error = Math.abs(actualTime - expectedTime);
      
      results.push(error);
      testCount++;

      if (performance.now() - startTime < testDurationMs) {
        setTimeout(testInterval, 100);
      } else {
        const averageError = results.reduce((sum, err) => sum + err, 0) / results.length;
        const maxError = Math.max(...results);
        
        resolve({
          passed: averageError < 0.1 && maxError < 1.0, // 0.1ms average, 1ms max
          averageError,
          maxError,
          testCount: results.length
        });
      }
    };

    testInterval();
  });
};

/**
 * Test frame rate consistency
 */
export const testFrameRate = async (testDurationMs: number = 3000): Promise<PerformanceTestResult['frameRate']> => {
  const frameTimes: number[] = [];
  let lastFrameTime = performance.now();
  let animationId: number;

  return new Promise((resolve) => {
    const startTime = performance.now();

    const frameTest = () => {
      const currentTime = performance.now();
      const frameTime = currentTime - lastFrameTime;
      frameTimes.push(frameTime);
      lastFrameTime = currentTime;

      if (currentTime - startTime < testDurationMs) {
        animationId = requestAnimationFrame(frameTest);
      } else {
        cancelAnimationFrame(animationId);
        
        const fps = frameTimes.map(ft => 1000 / ft);
        const averageFps = fps.reduce((sum, f) => sum + f, 0) / fps.length;
        const minFps = Math.min(...fps);
        
        resolve({
          passed: averageFps >= 55 && minFps >= 30, // Target 60fps, min 30fps
          averageFps,
          minFps,
          testDuration: testDurationMs
        });
      }
    };

    animationId = requestAnimationFrame(frameTest);
  });
};

/**
 * Test input latency
 */
export const testInputLatency = async (testCount: number = 50): Promise<PerformanceTestResult['inputLatency']> => {
  const latencies: number[] = [];

  return new Promise((resolve) => {
    let currentTest = 0;

    const runTest = () => {
      const startTime = performance.now();
      
      // Simulate input processing
      setTimeout(() => {
        const endTime = performance.now();
        const latency = endTime - startTime;
        latencies.push(latency);
        
        currentTest++;
        if (currentTest < testCount) {
          setTimeout(runTest, 50); // 50ms between tests
        } else {
          const averageLatency = latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
          const maxLatency = Math.max(...latencies);
          
          resolve({
            passed: averageLatency < 16 && maxLatency < 50, // <16ms average, <50ms max
            averageLatency,
            maxLatency,
            testCount: latencies.length
          });
        }
      }, 0);
    };

    runTest();
  });
};

/**
 * Run comprehensive performance test
 */
export const runPerformanceTest = async (): Promise<PerformanceTestResult> => {
  console.log('🧪 Starting performance tests...');
  
  const [timingPrecision, frameRate, inputLatency] = await Promise.all([
    testTimingPrecision(3000),
    testFrameRate(3000),
    testInputLatency(30)
  ]);

  // Calculate overall score
  let score = 0;
  if (timingPrecision.passed) score += 40;
  if (frameRate.passed) score += 40;
  if (inputLatency.passed) score += 20;

  const overall = {
    passed: timingPrecision.passed && frameRate.passed && inputLatency.passed,
    score
  };

  const result: PerformanceTestResult = {
    timingPrecision,
    frameRate,
    inputLatency,
    overall
  };

  console.log('🧪 Performance test results:', result);
  return result;
};

/**
 * Validate game timing accuracy during gameplay
 */
export const validateGameTiming = (raceTime: number, expectedMinTime: number): boolean => {
  // Race should take at least the theoretical minimum time
  // (distance / max_speed) accounting for checkpoints and reactions
  const isValid = raceTime >= expectedMinTime && raceTime < expectedMinTime * 3;
  
  if (!isValid) {
    console.warn(`⚠️ Invalid race time: ${raceTime}ms (expected: ${expectedMinTime}ms - ${expectedMinTime * 3}ms)`);
  }
  
  return isValid;
};

/**
 * Monitor performance during gameplay
 */
export class GamePerformanceMonitor {
  private frameCount = 0;
  private startTime = 0;
  private lastFrameTime = 0;
  private frameTimes: number[] = [];
  private isMonitoring = false;

  start(): void {
    this.frameCount = 0;
    this.startTime = performance.now();
    this.lastFrameTime = this.startTime;
    this.frameTimes = [];
    this.isMonitoring = true;
    this.monitor();
  }

  stop(): void {
    this.isMonitoring = false;
  }

  private monitor(): void {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    const frameTime = currentTime - this.lastFrameTime;
    
    this.frameTimes.push(frameTime);
    this.frameCount++;
    this.lastFrameTime = currentTime;

    // Keep only last 60 frames for rolling average
    if (this.frameTimes.length > 60) {
      this.frameTimes.shift();
    }

    requestAnimationFrame(() => this.monitor());
  }

  getMetrics(): { fps: number; averageFrameTime: number; isStable: boolean } {
    if (this.frameTimes.length === 0) {
      return { fps: 0, averageFrameTime: 0, isStable: false };
    }

    const averageFrameTime = this.frameTimes.reduce((sum, time) => sum + time, 0) / this.frameTimes.length;
    const fps = 1000 / averageFrameTime;
    
    // Check stability (frame time variance)
    const variance = this.frameTimes.reduce((sum, time) => sum + Math.pow(time - averageFrameTime, 2), 0) / this.frameTimes.length;
    const isStable = variance < 25; // Low variance indicates stable performance

    return { fps, averageFrameTime, isStable };
  }
}
