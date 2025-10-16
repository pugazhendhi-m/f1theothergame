/**
 * Performance Monitor Hook
 * Monitors game performance and provides degradation warnings
 * Requirements: All requirements robustness
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  isLowPerformance: boolean;
  warningMessage?: string;
}

interface UsePerformanceMonitorReturn {
  metrics: PerformanceMetrics;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  resetMetrics: () => void;
}

const TARGET_FPS = 60;
const LOW_FPS_THRESHOLD = 30;
const FRAME_SAMPLE_SIZE = 60; // Monitor last 60 frames
const MONITORING_INTERVAL = 1000; // Check every second

export const usePerformanceMonitor = (): UsePerformanceMonitorReturn => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    frameTime: 0,
    isLowPerformance: false
  });

  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();
  const monitoringIntervalRef = useRef<NodeJS.Timeout>();
  const isMonitoringRef = useRef(false);

  /**
   * Measure frame performance
   */
  const measureFrame = useCallback((currentTime: number) => {
    if (lastFrameTimeRef.current > 0) {
      const frameTime = currentTime - lastFrameTimeRef.current;
      frameTimesRef.current.push(frameTime);
      
      // Keep only recent frames
      if (frameTimesRef.current.length > FRAME_SAMPLE_SIZE) {
        frameTimesRef.current.shift();
      }
    }
    
    lastFrameTimeRef.current = currentTime;
    
    if (isMonitoringRef.current) {
      animationFrameRef.current = requestAnimationFrame(measureFrame);
    }
  }, []);

  /**
   * Calculate performance metrics
   */
  const calculateMetrics = useCallback(() => {
    if (frameTimesRef.current.length === 0) {
      return;
    }

    // Calculate average frame time and FPS
    const avgFrameTime = frameTimesRef.current.reduce((sum, time) => sum + time, 0) / frameTimesRef.current.length;
    const fps = Math.round(1000 / avgFrameTime);
    
    // Determine performance status
    const isLowPerformance = fps < LOW_FPS_THRESHOLD;
    let warningMessage: string | undefined;
    
    if (isLowPerformance) {
      if (fps < 15) {
        warningMessage = 'Very low performance detected. Consider closing other apps.';
      } else if (fps < 25) {
        warningMessage = 'Low performance detected. Game may feel sluggish.';
      } else {
        warningMessage = 'Performance below optimal. Timing may be affected.';
      }
    }

    setMetrics({
      fps,
      frameTime: avgFrameTime,
      isLowPerformance,
      warningMessage
    });
  }, []);

  /**
   * Start performance monitoring
   */
  const startMonitoring = useCallback(() => {
    if (isMonitoringRef.current) {
      return;
    }

    isMonitoringRef.current = true;
    frameTimesRef.current = [];
    lastFrameTimeRef.current = 0;
    
    // Start frame measurement
    animationFrameRef.current = requestAnimationFrame(measureFrame);
    
    // Start periodic metric calculation
    monitoringIntervalRef.current = setInterval(calculateMetrics, MONITORING_INTERVAL);
  }, [measureFrame, calculateMetrics]);

  /**
   * Stop performance monitoring
   */
  const stopMonitoring = useCallback(() => {
    isMonitoringRef.current = false;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
    }
  }, []);

  /**
   * Reset performance metrics
   */
  const resetMetrics = useCallback(() => {
    frameTimesRef.current = [];
    lastFrameTimeRef.current = 0;
    setMetrics({
      fps: 0,
      frameTime: 0,
      isLowPerformance: false
    });
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    metrics,
    startMonitoring,
    stopMonitoring,
    resetMetrics
  };
};
