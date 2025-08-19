import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';
import { GameSessionManager } from './services/GameSessionManager';
import { SocketEvents } from './types/game';

const app = express();
const server = createServer(app);
const sessionManager = new GameSessionManager();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Socket.IO setup
const io = new SocketIOServer(server, {
  cors: corsOptions
});

// Player socket mapping - now includes session info
const playerSockets = new Map<string, { socketId: string; sessionCode: string }>(); // playerId -> {socketId, sessionCode}
const socketPlayers = new Map<string, { playerId: string; sessionCode: string }>(); // socketId -> {playerId, sessionCode}

// Socket.IO event handlers
io.on('connection', (socket: Socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Join Game (now with session support)
  socket.on('joinGame', (playerData: { name: string; avatar: string; sessionCode?: string }) => {
    try {
      const gameService = sessionManager.getOrCreateSession(playerData.sessionCode);
      const player = gameService.addPlayer(playerData.name, playerData.avatar);
      
      // Map socket to player with session info
      playerSockets.set(player.id, { socketId: socket.id, sessionCode: gameService.sessionCode });
      socketPlayers.set(socket.id, { playerId: player.id, sessionCode: gameService.sessionCode });
      
      // Join socket room for this session
      socket.join(gameService.sessionCode);
      
      // Send player their info
      socket.emit('playerUpdate', player);
      
      // Send current target if alive and game started
      if (player.isAlive && gameService.getGameState().gameStarted) {
        const target = gameService.getCurrentTarget(player.id);
        if (target) {
          socket.emit('targetAssigned', target);
        }
      }
      
      // Broadcast updated game state to all players in this session
      io.to(gameService.sessionCode).emit('gameStateUpdate', gameService.getPublicGameState());
      
      console.log(`${player.name} joined session ${gameService.sessionCode}`);
    } catch (error) {
      socket.emit('error', 'Failed to join game');
      console.error('Join game error:', error);
    }
  });

  // Declare Kill
  socket.on('declareKill', (targetId: string) => {
    const playerInfo = socketPlayers.get(socket.id);
    console.log('⚔️ DECLARE KILL RECEIVED');
    console.log('⚔️ Socket ID:', socket.id);
    console.log('⚔️ Target ID:', targetId);
    console.log('⚔️ Player info from socket:', playerInfo);
    
    if (!playerInfo) {
      console.log('❌ Player not found in socketPlayers map');
      socket.emit('error', 'Player not found');
      return;
    }

    try {
      const gameService = sessionManager.getSession(playerInfo.sessionCode);
      if (!gameService) {
        console.log('❌ Game session not found:', playerInfo.sessionCode);
        socket.emit('error', 'Game session not found');
        return;
      }

      console.log('⚔️ Calling gameService.declareKill...');
      const result = gameService.declareKill(playerInfo.playerId, targetId);
      console.log('⚔️ Kill declaration result:', result);
      
      if (result.success) {
        console.log('✅ Kill declaration successful');
        // Notify the killer
        socket.emit('playerUpdate', gameService.getPlayer(playerInfo.playerId));
        
        // Notify the victim about pending kill confirmation
        const victimInfo = playerSockets.get(targetId);
        console.log('🎯 Looking for victim socket info:', victimInfo);
        console.log('🎯 All playerSockets map:', Array.from(playerSockets.entries()));
        console.log('🎯 Target ID we are looking for:', targetId);
        
        if (victimInfo && victimInfo.sessionCode === playerInfo.sessionCode) {
          const victimPlayer = gameService.getPlayer(targetId);
          console.log('🎯 Victim player data before sending:', victimPlayer);
          console.log(`🔥 Sending playerUpdate to victim ${victimPlayer?.name} with pendingKillConfirmation`);
          
          // Find the actual socket object and emit directly
          const victimSocket = io.sockets.sockets.get(victimInfo.socketId);
          if (victimSocket) {
            console.log('🎯 Found victim socket, sending playerUpdate directly');
            victimSocket.emit('playerUpdate', victimPlayer);
            console.log('✅ playerUpdate sent directly to victim socket');
          } else {
            console.log('❌ Victim socket not found in io.sockets.sockets');
            // Fallback to room-based emission
            io.to(victimInfo.socketId).emit('playerUpdate', victimPlayer);
          }
        } else {
          console.log('❌ Victim socket info not found or session mismatch');
          console.log('❌ victimInfo:', victimInfo);
          console.log('❌ playerInfo.sessionCode:', playerInfo.sessionCode);
          console.log('❌ victimInfo.sessionCode:', victimInfo?.sessionCode);
        }
        
        // COPY THE WORKING PATTERN FROM STARTGAME - Send to ALL players
        console.log('🔥 Broadcasting playerUpdate to ALL players in session (like startGame does)');
        Object.values(gameService.getGameState().players).forEach(player => {
          const playerSocketInfo = playerSockets.get(player.id);
          if (playerSocketInfo) {
            console.log(`🔥 Sending playerUpdate to ${player.name} (${playerSocketInfo.socketId})`);
            io.to(playerSocketInfo.socketId).emit('playerUpdate', player);
          }
        });
      } else {
        console.log('❌ Kill declaration failed:', result.message);
        socket.emit('error', result.message);
      }
    } catch (error) {
      console.log('💥 Exception in declareKill:', error);
      socket.emit('error', 'Failed to declare kill');
      console.error('Declare kill error:', error);
    }
  });

  // Confirm Death
  socket.on('confirmDeath', (killerId: string | null) => {
    const playerInfo = socketPlayers.get(socket.id);
    if (!playerInfo) {
      socket.emit('error', 'Player not found');
      return;
    }

    try {
      const gameService = sessionManager.getSession(playerInfo.sessionCode);
      if (!gameService) {
        socket.emit('error', 'Game session not found');
        return;
      }

      const result = gameService.confirmDeath(playerInfo.playerId, killerId || undefined);
      
      if (result.success) {
        // Update both killer and victim
        socket.emit('playerUpdate', gameService.getPlayer(playerInfo.playerId));
        
        if (killerId) {
          // Regular kill confirmation with killer
          const killerInfo = playerSockets.get(killerId);
          if (killerInfo && killerInfo.sessionCode === playerInfo.sessionCode) {
            io.to(killerInfo.socketId).emit('playerUpdate', gameService.getPlayer(killerId));
            
            // Send new target to killer if they have one
            if (result.newTarget) {
              io.to(killerInfo.socketId).emit('targetAssigned', result.newTarget);
            }
          }
        }
        
        // Broadcast updated game state to session
        io.to(playerInfo.sessionCode).emit('gameStateUpdate', gameService.getPublicGameState());
      } else {
        socket.emit('error', result.message);
      }
    } catch (error) {
      socket.emit('error', 'Failed to confirm death');
      console.error('Confirm death error:', error);
    }
  });

  // Request Quest Witness Confirmation
  socket.on('requestQuestConfirmation', (witnessId: string) => {
    const playerInfo = socketPlayers.get(socket.id);
    if (!playerInfo) {
      socket.emit('error', 'Player not found');
      return;
    }

    try {
      const gameService = sessionManager.getSession(playerInfo.sessionCode);
      if (!gameService) {
        socket.emit('error', 'Game session not found');
        return;
      }

      const result = gameService.requestQuestConfirmation(playerInfo.playerId, witnessId);
      
      if (result.success) {
        // Notify the witness about pending quest confirmation
        const witnessInfo = playerSockets.get(witnessId);
        if (witnessInfo && witnessInfo.sessionCode === playerInfo.sessionCode) {
          const questCompleter = gameService.getPlayer(playerInfo.playerId);
          if (questCompleter) {
            io.to(witnessInfo.socketId).emit('questConfirmationRequest', {
              questCompleterPlayerId: playerInfo.playerId,
              questCompleterName: questCompleter.name,
              questDescription: questCompleter.currentQuest
            });
            io.to(witnessInfo.socketId).emit('playerUpdate', gameService.getPlayer(witnessId));
          }
        }
        
        socket.emit('info', result.message);
      } else {
        socket.emit('error', result.message);
      }
    } catch (error) {
      socket.emit('error', 'Failed to request quest confirmation');
      console.error('Request quest confirmation error:', error);
    }
  });

  // Confirm Quest as Witness
  socket.on('confirmQuest', (questCompleterPlayerId: string) => {
    const playerInfo = socketPlayers.get(socket.id);
    if (!playerInfo) {
      socket.emit('error', 'Player not found');
      return;
    }

    try {
      const gameService = sessionManager.getSession(playerInfo.sessionCode);
      if (!gameService) {
        socket.emit('error', 'Game session not found');
        return;
      }

      const result = gameService.confirmQuestCompletion(playerInfo.playerId, questCompleterPlayerId);
      
      if (result.success) {
        // Update both witness and quest completer
        socket.emit('playerUpdate', gameService.getPlayer(playerInfo.playerId));
        
        const questCompleterInfo = playerSockets.get(questCompleterPlayerId);
        if (questCompleterInfo && questCompleterInfo.sessionCode === playerInfo.sessionCode) {
          io.to(questCompleterInfo.socketId).emit('playerUpdate', gameService.getPlayer(questCompleterPlayerId));
        }
      } else {
        socket.emit('error', result.message);
      }
    } catch (error) {
      socket.emit('error', 'Failed to confirm quest');
      console.error('Confirm quest error:', error);
    }
  });

  // Deny Quest as Witness
  socket.on('denyQuest', (questCompleterPlayerId: string) => {
    const playerInfo = socketPlayers.get(socket.id);
    if (!playerInfo) {
      socket.emit('error', 'Player not found');
      return;
    }

    try {
      const gameService = sessionManager.getSession(playerInfo.sessionCode);
      if (!gameService) {
        socket.emit('error', 'Game session not found');
        return;
      }

      const result = gameService.denyQuestCompletion(playerInfo.playerId, questCompleterPlayerId);
      
      if (result.success) {
        // Update witness
        socket.emit('playerUpdate', gameService.getPlayer(playerInfo.playerId));
        
        const questCompleterInfo = playerSockets.get(questCompleterPlayerId);
        if (questCompleterInfo && questCompleterInfo.sessionCode === playerInfo.sessionCode) {
          io.to(questCompleterInfo.socketId).emit('info', 'Witness denied your quest completion');
        }
      } else {
        socket.emit('error', result.message);
      }
    } catch (error) {
      socket.emit('error', 'Failed to deny quest');
      console.error('Deny quest error:', error);
    }
  });

  // Start Game (Host only)
  socket.on('startGame', () => {
    const playerInfo = socketPlayers.get(socket.id);
    if (!playerInfo) {
      socket.emit('error', 'Player not found');
      return;
    }

    try {
      const gameService = sessionManager.getSession(playerInfo.sessionCode);
      if (!gameService) {
        socket.emit('error', 'Game session not found');
        return;
      }

      if (!gameService.canStartGame(playerInfo.playerId)) {
        socket.emit('error', 'Only the host can start the game, and you need at least 2 players');
        return;
      }

      gameService.startGame();
      
      // Notify all players in this session that the game has started
      io.to(playerInfo.sessionCode).emit('gameStateUpdate', gameService.getPublicGameState());
      
      // Send updated player info and targets to all players in session
      Object.values(gameService.getGameState().players).forEach(player => {
        const playerInfo = playerSockets.get(player.id);
        if (playerInfo) {
          io.to(playerInfo.socketId).emit('playerUpdate', player);
          
          // Send target assignment if player is alive
          if (player.isAlive) {
            const target = gameService.getCurrentTarget(player.id);
            if (target) {
              io.to(playerInfo.socketId).emit('targetAssigned', target);
            }
          }
        }
      });
      
      console.log(`Game started in session ${playerInfo.sessionCode} by host!`);
    } catch (error) {
      socket.emit('error', 'Failed to start game');
      console.error('Start game error:', error);
    }
  });

  // Get Game State
  socket.on('getGameState', () => {
    const playerInfo = socketPlayers.get(socket.id);
    if (!playerInfo) {
      socket.emit('error', 'Player not found');
      return;
    }

    const gameService = sessionManager.getSession(playerInfo.sessionCode);
    if (gameService) {
      socket.emit('gameStateUpdate', gameService.getPublicGameState());
    }
  });

  // Get All Active Sessions
  socket.on('getActiveSessions', () => {
    const activeSessions = sessionManager.getAllSessions();
    socket.emit('activeSessions', activeSessions);
  });

  // Keep player connection alive
  socket.on('ping', () => {
    const playerInfo = socketPlayers.get(socket.id);
    if (playerInfo) {
      const gameService = sessionManager.getSession(playerInfo.sessionCode);
      if (gameService) {
        gameService.updatePlayerLastSeen(playerInfo.playerId);
      }
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const playerInfo = socketPlayers.get(socket.id);
    if (playerInfo) {
      console.log(`Player ${playerInfo.playerId} disconnected from session ${playerInfo.sessionCode}`);
      
      const gameService = sessionManager.getSession(playerInfo.sessionCode);
      if (gameService) {
        // Remove player from game state
        gameService.removePlayer(playerInfo.playerId);
        
        // Broadcast updated game state to remaining players in session
        io.to(playerInfo.sessionCode).emit('gameStateUpdate', gameService.getPublicGameState());
      }
      
      // Clean up mappings
      playerSockets.delete(playerInfo.playerId);
      socketPlayers.delete(socket.id);
    }
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// REST API endpoints for debugging/admin
app.get('/api/status', (req, res) => {
  const sessions = sessionManager.getAllSessions();
  res.json({
    status: 'running',
    activeSessions: sessions,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/sessions', (req, res) => {
  res.json(sessionManager.getAllSessions());
});

// TODO: Add session-specific endpoints later
// Having TypeScript issues with parameterized routes

// Cleanup inactive sessions every 5 minutes
setInterval(() => {
  const removedSessions = sessionManager.cleanupEmptySessions();
  if (removedSessions.length > 0) {
    console.log(`Cleaned up ${removedSessions.length} empty sessions`);
  }
}, 5 * 60 * 1000);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Express error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🎯 Secret Game server running on port ${PORT}`);
  console.log(`🌐 Frontend should connect to: http://localhost:${PORT}`);
}); 