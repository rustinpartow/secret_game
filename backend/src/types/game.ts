export interface Player {
  id: string;
  name: string;
  avatar: string;
  kills: number;
  questsCompleted: number;
  currentTarget?: string; // player ID
  currentQuest?: string; // Environmental quest (only when dead)
  currentKillMission?: string; // Kill mission for target (only when alive and has target)
  isAlive: boolean;
  isHost?: boolean; // Track if this player is the game host
  pendingKillConfirmation?: {
    killerId: string;
    killerName: string;
    timestamp: number;
  };
  pendingQuestConfirmation?: {
    questCompleterPlayerId: string;
    questCompleterName: string;
    questDescription: string;
    timestamp: number;
  };
  lastSeen: number; // timestamp
}

export interface GameState {
  players: Record<string, Player>;
  targetChain: string[]; // circular array of player IDs
  availableQuests: string[];
  gameStarted: boolean;
  gameId: string;
  createdAt: number;
  hostId?: string; // Track the host player ID
  sessionCode: string; // Short code for joining this specific game session
}

export interface KillConfirmation {
  killerId: string;
  victimId: string;
  timestamp: number;
  confirmed: boolean;
}

export interface GameAction {
  type: 'JOIN_GAME' | 'DECLARE_KILL' | 'CONFIRM_DEATH' | 'COMPLETE_QUEST' | 'LEAVE_GAME';
  playerId: string;
  payload?: any;
}

export interface SocketEvents {
  // Client to Server
  joinGame: (playerData: { name: string; avatar: string }) => void;
  declareKill: (targetId: string) => void;
  confirmDeath: (killerId: string) => void;
  completeQuest: () => void;
  getGameState: () => void;

  // Server to Client
  gameStateUpdate: (gameState: GameState) => void;
  playerUpdate: (player: Player) => void;
  killConfirmationRequest: (data: { killerId: string; killerName: string }) => void;
  error: (message: string) => void;
  targetAssigned: (target: Player) => void;
} 