/**
 * Network Error Display Component
 * Shows network errors and retry options
 * Requirements: All requirements robustness
 */

import React from 'react';
import { useNetworkError } from '../hooks/useNetworkError';

interface NetworkErrorDisplayProps {
  onRetry?: () => Promise<void>;
  className?: string;
}

export const NetworkErrorDisplay: React.FC<NetworkErrorDisplayProps> = ({
  onRetry,
  className = ''
}) => {
  const { networkError, isRetrying, retryRequest, clearError } = useNetworkError();

  if (!networkError) {
    return null;
  }

  const handleRetry = async () => {
    if (onRetry) {
      await retryRequest(onRetry);
    }
  };

  const canRetry = networkError.retryCount < 3 && onRetry;

  return (
    <div className={`network-error ${className}`}>
      <div className="network-error-title">
        🌐 Connection Issue
      </div>
      <div className="network-error-message">
        {networkError.message}
        {networkError.status && ` (${networkError.status})`}
      </div>
      {networkError.retryCount > 0 && (
        <div className="network-error-message">
          Retry attempt {networkError.retryCount}/3
        </div>
      )}
      <div className="error-actions">
        {canRetry && (
          <button
            className="retry-button"
            onClick={handleRetry}
            disabled={isRetrying}
          >
            {isRetrying ? 'Retrying...' : 'Retry'}
          </button>
        )}
        <button
          className="retry-button"
          onClick={clearError}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
