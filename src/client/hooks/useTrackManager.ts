/**
 * Track Manager Hook for F1 Reaction Game
 * Provides React integration for TrackManager class
 * Requirements: 4.1, 4.3, 4.4
 */

import { useCallback, useRef, useState } from 'react';
import { TrackManager } from '../../shared/types/track';
import { Track, CheckpointEvent, ControlState } from '../../shared/types/game';

export const useTrackManager = (initialTrack: Track) => {
  const trackManagerRef = useRef<TrackManager>(new TrackManager(initialTrack));
  const [, forceUpdate] = useState({});

  // Force component re-render
  const triggerUpdate = useCallback(() => {
    forceUpdate({});
  }, []);

  /**
   * Check brake points and return any triggered events
   */
  const checkBrakePoints = useCallback((carDistance: number, currentTime: number): CheckpointEvent | null => {
    return trackManagerRef.current.checkBrakePoints(carDistance, currentTime);
  }, []);

  /**
   * Check straight points and return any triggered events
   */
  const checkStraightPoints = useCallback((carDistance: number, currentTime: number): CheckpointEvent | null => {
    return trackManagerRef.current.checkStraightPoints(carDistance, currentTime);
  }, []);

  /**
   * Get current control states
   */
  const getControlStates = useCallback((currentTime: number): { brake: ControlState; acceleration: ControlState } => {
    return trackManagerRef.current.getControlStates(currentTime);
  }, []);

  /**
   * Get remaining duration for a control
   */
  const getRemainingDuration = useCallback((controlType: 'brake' | 'acceleration', currentTime: number): number => {
    return trackManagerRef.current.getRemainingDuration(controlType, currentTime);
  }, []);

  /**
   * Check if a control is currently active
   */
  const isControlActive = useCallback((controlType: 'brake' | 'acceleration', currentTime: number): boolean => {
    return trackManagerRef.current.isControlActive(controlType, currentTime);
  }, []);

  /**
   * Reset track manager
   */
  const reset = useCallback(() => {
    trackManagerRef.current.reset();
    triggerUpdate();
  }, [triggerUpdate]);

  /**
   * Update track configuration
   */
  const updateTrack = useCallback((newTrack: Track) => {
    trackManagerRef.current.updateTrack(newTrack);
    triggerUpdate();
  }, [triggerUpdate]);

  /**
   * Get current track configuration
   */
  const getTrack = useCallback((): Track => {
    return trackManagerRef.current.getTrack();
  }, []);

  /**
   * Get debug information
   */
  const getDebugInfo = useCallback(() => {
    return trackManagerRef.current.getDebugInfo();
  }, []);

  return {
    checkBrakePoints,
    checkStraightPoints,
    getControlStates,
    getRemainingDuration,
    isControlActive,
    reset,
    updateTrack,
    getTrack,
    getDebugInfo,
  } as const;
};
