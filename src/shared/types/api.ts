import { GameState, RaceResult } from './game';

// Legacy counter API types (to be replaced)
export type InitResponse = {
  type: 'init';
  postId: string;
  count: number;
  username: string;
};

export type IncrementResponse = {
  type: 'increment';
  postId: string;
  count: number;
};

export type DecrementResponse = {
  type: 'decrement';
  postId: string;
  count: number;
};

// F1 Game API types
export type GameInitResponse = {
  type: 'game_init';
  postId: string;
  gameState: GameState;
  username: string;
};

export type GameCompleteRequest = {
  raceResult: RaceResult;
};

export type GameCompleteResponse = {
  type: 'game_complete';
  postId: string;
  raceResult: RaceResult;
  leaderboardPosition: number | undefined;
};
