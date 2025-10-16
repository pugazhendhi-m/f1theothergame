/**
 * Performance Warning Component
 * Shows performance warnings and suggestions
 * Requirements: All requirements robustness
 */

import React, { useState } from 'react';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

interface PerformanceWarningProps {
  className?: string;
}

export const PerformanceWarning: React.FC<PerformanceWarningProps> = ({ className = '' }) => {
  const { metrics } = usePerformanceMonitor();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!metrics.isLowPerformance || isDismissed) {
    return null;
  }

  return (
    <div className={`performance-warning ${className}`}>
      <div className="performance-warning-title">⚠️ Performance Warning</div>
      <div className="performance-warning-message">{metrics.warningMessage}</div>
      <div className="performance-warning-message">Current FPS: {metrics.fps} (Target: 60)</div>
      <button
        className="retry-button"
        onClick={() => setIsDismissed(true)}
        style={{ marginTop: '8px' }}
      >
        Dismiss
      </button>
    </div>
  );
};
