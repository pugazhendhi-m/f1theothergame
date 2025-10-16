/**
 * Control Interface Component for F1 Reaction Game
 * Handles brake and acceleration input controls
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */

import React, { useEffect, useCallback } from 'react';
import { ControlState } from '../../shared/types/game';

interface ControlInterfaceProps {
  brakeState: ControlState;
  accelerationState: ControlState;
  onBrakeInput: () => void;
  onAccelerationInput: () => void;
  disabled?: boolean;
}

export const ControlInterface: React.FC<ControlInterfaceProps> = ({
  brakeState,
  accelerationState,
  onBrakeInput,
  onAccelerationInput,
  disabled = false
}) => {
  const [recentPress, setRecentPress] = React.useState<{
    brake: boolean;
    acceleration: boolean;
  }>({ brake: false, acceleration: false });
  
  /**
   * Handle keyboard input
   * Requirements: 3.2
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (disabled) return;

    // Prevent default behavior for game keys
    const gameKeys = ['KeyA', 'ArrowLeft', 'KeyD', 'ArrowRight'];
    if (gameKeys.includes(event.code)) {
      event.preventDefault();
    }

    // Handle brake controls (A key or Left arrow)
    if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
      onBrakeInput();
      
      // Show visual feedback
      setRecentPress(prev => ({ ...prev, brake: true }));
      setTimeout(() => {
        setRecentPress(prev => ({ ...prev, brake: false }));
      }, 200);
    }
    
    // Handle acceleration controls (D key or Right arrow)
    if (event.code === 'KeyD' || event.code === 'ArrowRight') {
      onAccelerationInput();
      
      // Show visual feedback
      setRecentPress(prev => ({ ...prev, acceleration: true }));
      setTimeout(() => {
        setRecentPress(prev => ({ ...prev, acceleration: false }));
      }, 200);
    }
  }, [disabled, onBrakeInput, onAccelerationInput]);

  /**
   * Set up keyboard event listeners
   * Requirements: 3.2
   */
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  /**
   * Handle touch/click input for brake button
   * Requirements: 3.3
   */
  const handleBrakeClick = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!disabled) {
      onBrakeInput();
      
      // Show visual feedback
      setRecentPress(prev => ({ ...prev, brake: true }));
      setTimeout(() => {
        setRecentPress(prev => ({ ...prev, brake: false }));
      }, 200);
    }
  }, [disabled, onBrakeInput]);

  /**
   * Handle touch/click input for acceleration button
   * Requirements: 3.3
   */
  const handleAccelerationClick = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!disabled) {
      onAccelerationInput();
      
      // Show visual feedback
      setRecentPress(prev => ({ ...prev, acceleration: true }));
      setTimeout(() => {
        setRecentPress(prev => ({ ...prev, acceleration: false }));
      }, 200);
    }
  }, [disabled, onAccelerationInput]);

  /**
   * Prevent context menu on long press (mobile)
   */
  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
  }, []);

  /**
   * Get button class based on control state
   * Requirements: 3.1
   */
  const getButtonClass = (controlState: ControlState, baseClass: string, controlType: 'brake' | 'acceleration'): string => {
    const classes = [baseClass];
    
    if (disabled) {
      classes.push('disabled');
    } else if (controlState.isActive) {
      classes.push('active', 'green');
    } else {
      classes.push('inactive', 'red');
    }
    
    // Add pressed feedback
    if (recentPress[controlType]) {
      classes.push('pressed');
    }
    
    return classes.join(' ');
  };

  /**
   * Get button status text
   */
  const getButtonStatus = (controlState: ControlState): string => {
    if (disabled) return 'DISABLED';
    if (controlState.isActive) return 'PRESS NOW!';
    return 'WAIT...';
  };

  return (
    <div className="control-interface">
      {/* Brake Control - Bottom Left */}
      <button
        className={getButtonClass(brakeState, 'control-button brake-button', 'brake')}
        onMouseDown={handleBrakeClick}
        onTouchStart={handleBrakeClick}
        onContextMenu={handleContextMenu}
        disabled={disabled}
        aria-label="Brake Control (A key or Left arrow)"
        type="button"
      >
        <div className="button-content">
          <div className="button-icon">🛑</div>
          <div className="button-label">BRAKE</div>
          <div className="button-status">{getButtonStatus(brakeState)}</div>
          <div className="button-keys">A / ←</div>
        </div>
      </button>

      {/* Acceleration Control - Bottom Right */}
      <button
        className={getButtonClass(accelerationState, 'control-button acceleration-button', 'acceleration')}
        onMouseDown={handleAccelerationClick}
        onTouchStart={handleAccelerationClick}
        onContextMenu={handleContextMenu}
        disabled={disabled}
        aria-label="Acceleration Control (D key or Right arrow)"
        type="button"
      >
        <div className="button-content">
          <div className="button-icon">⚡</div>
          <div className="button-label">BOOST</div>
          <div className="button-status">{getButtonStatus(accelerationState)}</div>
          <div className="button-keys">D / →</div>
        </div>
      </button>
    </div>
  );
};
