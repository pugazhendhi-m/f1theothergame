/**
 * Error Boundary Component for F1 Reaction Game
 * Provides fallback UI for JavaScript errors
 * Requirements: All requirements robustness
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('F1 Game Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleRestart = () => {
    // Reset error state to retry rendering
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>🏎️ Game Error</h2>
            <p>Something went wrong with the F1 Reaction Game.</p>
            <div className="error-details">
              <p><strong>Error:</strong> {this.state.error?.message}</p>
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details>
                  <summary>Error Details (Development)</summary>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </details>
              )}
            </div>
            <div className="error-actions">
              <button 
                className="restart-button"
                onClick={this.handleRestart}
              >
                Try Again
              </button>
              <button 
                className="reload-button"
                onClick={() => window.location.reload()}
              >
                Reload Game
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
