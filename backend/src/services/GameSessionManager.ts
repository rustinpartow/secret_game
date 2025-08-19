import { GameService } from './GameService';

export class GameSessionManager {
  private sessions: Map<string, GameService> = new Map();

  // Create a new game session
  createSession(customCode?: string): GameService {
    let sessionCode = customCode;
    
    // Generate unique code if not provided or if it conflicts
    if (!sessionCode || this.sessions.has(sessionCode)) {
      do {
        sessionCode = this.generateCode();
      } while (this.sessions.has(sessionCode));
    }

    const gameService = new GameService(sessionCode);
    this.sessions.set(sessionCode, gameService);
    
    console.log(`Created game session: ${sessionCode}`);
    return gameService;
  }

  // Get existing session by code
  getSession(sessionCode: string): GameService | undefined {
    return this.sessions.get(sessionCode.toUpperCase());
  }

  // Get or create session
  getOrCreateSession(sessionCode?: string): GameService {
    if (sessionCode) {
      const existing = this.getSession(sessionCode);
      if (existing) return existing;
    }
    
    return this.createSession(sessionCode);
  }

  // Remove empty sessions
  cleanupEmptySessions(): string[] {
    const removedSessions: string[] = [];
    
    for (const [code, session] of this.sessions.entries()) {
      const gameState = session.getGameState();
      const playerCount = Object.keys(gameState.players).length;
      
      // Remove sessions with no players that are older than 10 minutes
      if (playerCount === 0 && Date.now() - gameState.createdAt > 10 * 60 * 1000) {
        this.sessions.delete(code);
        removedSessions.push(code);
        console.log(`Cleaned up empty session: ${code}`);
      }
    }
    
    return removedSessions;
  }

  // Get all active sessions (for debugging)
  getAllSessions(): Array<{ code: string; playerCount: number; gameStarted: boolean }> {
    return Array.from(this.sessions.entries()).map(([code, session]) => {
      const state = session.getGameState();
      return {
        code,
        playerCount: Object.keys(state.players).length,
        gameStarted: state.gameStarted
      };
    });
  }

  private generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }
} 