import express from 'express';
import { InitResponse, IncrementResponse, DecrementResponse, GameInitResponse, GameCompleteRequest, GameCompleteResponse } from '../shared/types/api';
import { GameState, GameConfig, RaceResult } from '../shared/types/game';
import { redis, reddit, createServer, context, getServerPort } from '@devvit/web/server';
import { createPost } from './core/post';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

router.get<{ postId: string }, InitResponse | { status: string; message: string }>(
  '/api/init',
  async (_req, res): Promise<void> => {
    const { postId } = context;

    if (!postId) {
      console.error('API Init Error: postId not found in devvit context');
      res.status(400).json({
        status: 'error',
        message: 'postId is required but missing from context',
      });
      return;
    }

    try {
      const [count, username] = await Promise.all([
        redis.get('count'),
        reddit.getCurrentUsername(),
      ]);

      res.json({
        type: 'init',
        postId: postId,
        count: count ? parseInt(count) : 0,
        username: username ?? 'anonymous',
      });
    } catch (error) {
      console.error(`API Init Error for post ${postId}:`, error);
      let errorMessage = 'Unknown error during initialization';
      if (error instanceof Error) {
        errorMessage = `Initialization failed: ${error.message}`;
      }
      res.status(400).json({ status: 'error', message: errorMessage });
    }
  }
);

router.post<{ postId: string }, IncrementResponse | { status: string; message: string }, unknown>(
  '/api/increment',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    res.json({
      count: await redis.incrBy('count', 1),
      postId,
      type: 'increment',
    });
  }
);

router.post<{ postId: string }, DecrementResponse | { status: string; message: string }, unknown>(
  '/api/decrement',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    res.json({
      count: await redis.incrBy('count', -1),
      postId,
      type: 'decrement',
    });
  }
);

router.post('/internal/on-app-install', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      status: 'success',
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

router.post('/internal/menu/post-create', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

// F1 Game API endpoints

router.get<{ postId: string }, GameInitResponse | { status: string; message: string }>(
  '/api/game/init',
  async (_req, res): Promise<void> => {
    const { postId } = context;

    if (!postId) {
      console.error('Game Init Error: postId not found in devvit context');
      res.status(400).json({
        status: 'error',
        message: 'postId is required but missing from context',
      });
      return;
    }

    try {
      const username = await reddit.getCurrentUsername();

      // Default game configuration based on design document
      const gameConfig: GameConfig = {
        track: {
          distance: 1000,        // 1km track
          averageSpeed: 50,      // 50 m/s base speed
          brakePoints: [200, 400, 700, 900],     // Brake checkpoints
          straightPoints: [100, 350, 600, 850], // Acceleration checkpoints
          speedIncrease: 15,     // +15 m/s boost
          pointDuration: 2000,   // 2 second windows
          speedDecrease: 10,     // -10 m/s penalty
        },
        controls: {
          keyboard: {
            brake: ['KeyA', 'ArrowLeft'],
            acceleration: ['KeyD', 'ArrowRight'],
          },
          mobile: {
            brake: 'bottom-left-button',
            acceleration: 'bottom-right-button',
          },
        },
      };

      // Initialize game state
      const initialGameState: GameState = {
        track: {
          distance: gameConfig.track.distance,
          averageSpeed: gameConfig.track.averageSpeed,
          raceTime: null,
          brakePoints: gameConfig.track.brakePoints,
          straightPoints: gameConfig.track.straightPoints,
          speedIncrease: gameConfig.track.speedIncrease,
          pointDuration: gameConfig.track.pointDuration,
          speedDecrease: gameConfig.track.speedDecrease,
        },
        car: {
          distanceCovered: 0,
          currentSpeed: gameConfig.track.averageSpeed,
          baseSpeed: gameConfig.track.averageSpeed,
          speedModifiers: [],
        },
        gameStatus: 'idle',
        activeControls: {
          brake: {
            isActive: false,
            activatedAt: 0,
            duration: 0,
          },
          acceleration: {
            isActive: false,
            activatedAt: 0,
            duration: 0,
          },
        },
        raceStartTime: null,
      };

      res.json({
        type: 'game_init',
        postId: postId,
        gameState: initialGameState,
        username: username ?? 'anonymous',
      });
    } catch (error) {
      console.error(`Game Init Error for post ${postId}:`, error);
      let errorMessage = 'Unknown error during game initialization';
      if (error instanceof Error) {
        errorMessage = `Game initialization failed: ${error.message}`;
      }
      res.status(500).json({ status: 'error', message: errorMessage });
    }
  }
);

router.post<{ postId: string }, GameCompleteResponse | { status: string; message: string }, GameCompleteRequest>(
  '/api/game/complete',
  async (req, res): Promise<void> => {
    const { postId } = context;

    if (!postId) {
      console.error('Game Complete Error: postId not found in devvit context');
      res.status(400).json({
        status: 'error',
        message: 'postId is required but missing from context',
      });
      return;
    }

    try {
      const { raceResult } = req.body;

      // Validate race result data
      if (!raceResult || typeof raceResult.raceTime !== 'number' || raceResult.raceTime <= 0) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid race result: raceTime must be a positive number',
        });
        return;
      }

      if (typeof raceResult.distanceCovered !== 'number' || raceResult.distanceCovered <= 0) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid race result: distanceCovered must be a positive number',
        });
        return;
      }

      if (typeof raceResult.perfectInputs !== 'number' || raceResult.perfectInputs < 0) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid race result: perfectInputs must be a non-negative number',
        });
        return;
      }

      if (typeof raceResult.penaltyInputs !== 'number' || raceResult.penaltyInputs < 0) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid race result: penaltyInputs must be a non-negative number',
        });
        return;
      }

      // Get current username for the race result
      const username = await reddit.getCurrentUsername();
      const finalRaceResult: RaceResult = {
        ...raceResult,
        username: username ?? 'anonymous',
        timestamp: Date.now(),
      };

      // Store race result in Redis with user-specific key
      const userRaceKey = `race:${postId}:${finalRaceResult.username}`;
      const leaderboardKey = `leaderboard:${postId}`;
      
      // Store individual race result
      await redis.set(userRaceKey, JSON.stringify(finalRaceResult));

      // Add to leaderboard (sorted set by race time, lower is better)
      await redis.zAdd(leaderboardKey, {
        member: finalRaceResult.username,
        score: finalRaceResult.raceTime,
      });

      // Get leaderboard position (1-based ranking)
      const leaderboardPosition = await redis.zRank(leaderboardKey, finalRaceResult.username);
      const position: number | undefined = leaderboardPosition !== null && leaderboardPosition !== undefined ? leaderboardPosition + 1 : undefined;

      res.json({
        type: 'game_complete',
        postId: postId,
        raceResult: finalRaceResult,
        leaderboardPosition: position,
      });
    } catch (error) {
      console.error(`Game Complete Error for post ${postId}:`, error);
      let errorMessage = 'Unknown error during race completion';
      if (error instanceof Error) {
        errorMessage = `Race completion failed: ${error.message}`;
      }
      res.status(500).json({ status: 'error', message: errorMessage });
    }
  }
);

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port);
