import { F1Game } from './components/F1Game';
import { ErrorBoundary } from './components/ErrorBoundary';

export const App = () => {
  return (
    <ErrorBoundary>
      <F1Game />
    </ErrorBoundary>
  );
};
