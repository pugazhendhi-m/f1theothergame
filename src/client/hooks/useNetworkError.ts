/**
 * Network Error Handler Hook
 * Manages network errors and retry logic
 * Requirements: All requirements robustness
 */

import { useState, useCallback } from 'react';

interface NetworkError {
  message: string;
  status?: number;
  retryCount: number;
  timestamp: number;
}

interface UseNetworkErrorReturn {
  networkError: NetworkError | null;
  isRetrying: boolean;
  handleNetworkError: (error: Error, status?: number) => void;
  retryRequest: (retryFn: () => Promise<void>) => Promise<void>;
  clearError: () => void;
}

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;

export const useNetworkError = (): UseNetworkErrorReturn => {
  const [networkError, setNetworkError] = useState<NetworkError | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  /**
   * Handle network errors with automatic classification
   */
  const handleNetworkError = useCallback((error: Error, status?: number) => {
    let message = 'Network connection failed';
    
    // Classify error types
    if (status === 404) {
      message = 'Game service not found';
    } else if (status === 500) {
      message = 'Server error occurred';
    } else if (status === 503) {
      message = 'Game service temporarily unavailable';
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      message = 'Unable to connect to game server';
    } else if (error.message.includes('timeout')) {
      message = 'Request timed out';
    }

    const newError: NetworkError = {
      message,
      status,
      retryCount: networkError?.retryCount || 0,
      timestamp: Date.now()
    };

    setNetworkError(newError);
    console.error('Network error:', error, { status, message });
  }, [networkError?.retryCount]);

  /**
   * Retry failed requests with exponential backoff
   */
  const retryRequest = useCallback(async (retryFn: () => Promise<void>) => {
    if (!networkError || networkError.retryCount >= MAX_RETRY_ATTEMPTS) {
      return;
    }

    setIsRetrying(true);
    
    try {
      // Exponential backoff delay
      const delay = RETRY_DELAY_MS * Math.pow(2, networkError.retryCount);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      await retryFn();
      
      // Success - clear error
      setNetworkError(null);
    } catch (error) {
      // Update retry count
      setNetworkError(prev => prev ? {
        ...prev,
        retryCount: prev.retryCount + 1,
        timestamp: Date.now()
      } : null);
      
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  }, [networkError]);

  /**
   * Clear current error state
   */
  const clearError = useCallback(() => {
    setNetworkError(null);
    setIsRetrying(false);
  }, []);

  return {
    networkError,
    isRetrying,
    handleNetworkError,
    retryRequest,
    clearError
  };
};
