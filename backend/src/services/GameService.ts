import { v4 as uuidv4 } from 'uuid';
import { Player, GameState, KillConfirmation } from '../types/game';

const ENVIRONMENTAL_QUESTS = [
  // Social Connection Quests
  "Compliment 3 different dog owners on their dogs and learn each dog's name",
  "Find someone who's never been to Golden Gate Park before and give them one fun fact about it",
  "Start a conversation with someone about their favorite picnic food",
  "Help someone take a photo and ask them to tell you about their day",
  "Find someone wearing the same color as you and discover one thing you have in common",
  "Ask a stranger about their favorite spot in San Francisco and share yours",
  "Find someone reading a book and ask them what it's about",
  "Compliment someone's outfit and ask where they got it",
  "Ask a parent about their favorite childhood game and play it for 2 minutes",
  "Find someone exercising and ask them for their best fitness tip",
  "Ask a couple how they met and share a story about friendship",
  "Find someone with an interesting tattoo and ask about its meaning",
  "Ask an elderly person for their best life advice",
  "Find someone who works nearby and ask about their favorite lunch spot",
  "Ask a jogger about their favorite running route in the city",
  "Find someone who's traveled recently and learn about their trip",
  "Ask a musician (if any) about their favorite song to perform",
  "Find someone with kids and ask about their favorite family activity",
  "Ask a tourist what they're most excited to see in San Francisco",
  "Find someone gardening and learn one plant care tip",
  
  // Nature & Park Exploration
  "Find and touch 5 different types of trees and name at least 2 of them",
  "Locate a piece of litter, dispose of it properly, and find something beautiful in nature to balance it out",
  "Find the highest point you can access in the meadow and do a 30-second meditation",
  "Discover something in the park you've never noticed before and take a mental snapshot",
  "Find evidence of 3 different animals (birds, insects, squirrels, etc.) and observe their behavior for 1 minute each",
  "Collect 7 different natural objects and arrange them in a pattern, then scatter them back where you found them",
  "Find a tree that's over 50 years old and imagine what it has witnessed",
  "Locate 3 different types of flowers and describe their scents",
  "Find a rock formation and create a story about how it was formed",
  "Observe the wind patterns by watching grass, leaves, or trees for 3 minutes",
  "Find the quietest spot in your area and listen to nature sounds for 2 minutes",
  "Locate a water source (fountain, puddle, etc.) and observe reflections in it",
  "Find 5 different shades of green in nature and point them out",
  "Discover an interesting texture in nature and describe it in 3 words",
  "Find a sunny spot and a shady spot, compare how they feel different",
  "Locate evidence of seasonal change (fallen leaves, new growth, etc.)",
  "Find a natural 'frame' (through branches, rocks) and describe the view",
  "Observe cloud movements for 3 minutes and predict the weather",
  "Find a natural pattern (spiral, symmetry, etc.) and appreciate its design",
  "Locate the most colorful natural thing in your vicinity",
  
  // Creative & Mindfulness Challenges
  "Create a 30-second dance inspired by something you see in nature",
  "Build a small, temporary art installation using only natural materials (leave no trace)",
  "Write a haiku about Golden Gate Park and recite it to yourself",
  "Find the most interesting cloud and make up a story about what it looks like",
  "Create a nature symphony by finding 5 different natural sounds",
  "Pretend to be a nature documentary narrator for 2 minutes about your surroundings",
  "Practice gratitude by finding 5 things in nature you're thankful for",
  "Do 10 jumping jacks in the most beautiful spot you can find",
  "Create an imaginary conversation between two trees you can see",
  "Find your 'power pose' spot and hold it for 30 seconds",
  "Practice deep breathing while focusing on one natural element for 2 minutes",
  "Create a mental time capsule of this moment in the park",
  "Find a natural 'stage' and perform a 15-second monologue",
  "Imagine you're a park designer - what would you add or change here?",
  "Create a nature-inspired superhero and describe their powers",
  "Find a natural 'chair' and sit in it while appreciating the view",
  "Practice forest bathing - stand still and absorb nature for 3 minutes",
  "Create a story about the most interesting person who might have sat here before",
  "Find your inner child - what would 8-year-old you do in this spot?",
  "Practice mindful walking for 50 steps, focusing on each footstep",
  
  // Environmental Awareness & Care
  "Count how many different types of recycling bins you can find in the area",
  "Find evidence of how humans and nature coexist in this space",
  "Observe how different people use and enjoy the same natural space",
  "Find something that could be improved for wildlife and imagine the solution",
  "Notice how the park changes from morning to evening (imagine if not visible)",
  "Find an example of human impact on nature (positive or negative) and reflect on it",
  "Observe how weather has affected the landscape around you",
  "Find evidence of the season and imagine how this spot looks in other seasons",
  "Discover how water moves through this area (drainage, irrigation, etc.)",
  "Find a spot where nature is 'winning' over human development",
  "Observe how different ages of people enjoy the park differently",
  "Find evidence of the park's maintenance and appreciate the caretakers",
  "Notice how sound travels differently in natural vs urban areas of the park",
  "Find a micro-ecosystem and observe the interactions within it",
  "Appreciate how the park provides ecosystem services to the city",
  
  // Physical & Sensory Challenges
  "Walk barefoot on grass for 1 minute and describe the sensation",
  "Find the bounciest natural surface and test it gently",
  "Locate the roughest and smoothest natural textures nearby",
  "Find a natural obstacle course and navigate it safely",
  "Practice balance by standing on one foot while appreciating nature",
  "Find the best natural echo spot and test it",
  "Discover the warmest and coolest natural spots in your area",
  "Practice your stealth skills - move silently through nature for 1 minute",
  "Find a natural 'gym' and do a nature-inspired exercise",
  "Test your senses - identify 3 things by smell alone",
  "Find the softest natural thing you can sit or lie on",
  "Practice your observation skills - find 10 details others might miss",
  "Test how far you can see clearly in different directions",
  "Find natural things that represent all 5 senses",
  "Practice moving like different animals for 30 seconds each",
  
  // Artistic & Documentation Challenges
  "Create a nature mandala using found objects (leave no trace when done)",
  "Find natural colors that would make the perfect palette for painting this scene",
  "Discover interesting shadows and imagine how they change throughout the day",
  "Find a natural 'sculpture' and appreciate its artistic qualities",
  "Create a mental photograph of the most Instagram-worthy natural spot",
  "Find natural geometry - circles, triangles, lines in nature",
  "Discover natural textures that would be interesting to draw or photograph",
  "Find the best natural lighting for a portrait and imagine the photo",
  "Create a nature journal entry in your mind about this experience",
  "Find natural inspiration for a creative project you'd like to do someday",
  "Appreciate the 'composition' of a natural scene like an artist would",
  "Find natural examples of contrast - light/dark, rough/smooth, etc.",
  "Discover natural details that would make beautiful close-up photographs",
  "Find natural examples of the golden ratio or other mathematical concepts",
  "Appreciate how natural and human-made elements interact aesthetically",
  
  // Community & Cultural Appreciation
  "Find evidence of different cultures enjoying the park and appreciate the diversity",
  "Observe how the park brings different generations together",
  "Find a spot where you can see the most diverse mix of people",
  "Appreciate how this park serves as a community gathering space",
  "Find evidence of the park's history and imagine its past",
  "Observe how the park connects to the broader city around it",
  "Find a spot that represents what you love about San Francisco",
  "Appreciate how public parks serve as equalizers in urban environments",
  "Find evidence of community care and maintenance of the park",
  "Observe how the park changes with different events and seasons",
  "Find a spot that would be perfect for a community gathering",
  "Appreciate how the park provides respite from urban stress",
  "Find evidence of how the park supports local wildlife in an urban setting",
  "Observe how people from different backgrounds enjoy nature similarly",
  "Find a spot that represents hope and renewal in the urban environment"
];

const KILL_MISSIONS = [
  "Get your target to say 'porridge' 5 times in one conversation",
  "Get your target to use the word 'definitely' 3 times in 2 minutes",
  "Make your target laugh so hard they snort or make a weird sound",
  "Get your target to tell you about their childhood pet (real or imaginary)",
  "Convince your target to high-five you with both hands simultaneously",
  "Get your target to say something nice about someone else in the group",
  "Make your target admit they've never heard of a common movie/song you mention",
  "Get your target to describe their perfect pizza in detail",
  "Make your target unconsciously copy a gesture you do 3 times",
  "Get your target to tell you what they wanted to be when they grew up",
  "Convince your target to make a pun (good or terrible)",
  "Get your target to mention a specific color without you directly asking about colors",
  "Make your target use your name twice in one sentence naturally",
  "Get your target to admit they're bad at something they actually enjoy",
  "Convince your target to give someone else a compliment while you're talking",
  "Get your target to use a word that rhymes with 'game' in conversation",
  "Make your target tell you about the last thing they ate",
  "Get your target to count something in the environment out loud",
  "Convince your target to wave at someone across the area",
  "Get your target to mention what day of the week it is",
  "Make your target laugh at something that isn't actually that funny",
  "Get your target to ask you a question about yourself",
  "Convince your target to stretch or do a small physical movement",
  "Get your target to mention the weather in any context",
  "Make your target remember a song and hum/sing just a tiny bit of it",
  "Get your target to use the phrase 'you know what I mean' or similar",
  "Convince your target to point at something while talking to you",
  "Get your target to mention food they're craving",
  "Make your target adjust their clothing or hair while talking",
  "Get your target to say 'exactly' in agreement with something you say",
  "Convince your target to look at their phone for any reason",
  "Get your target to mention a place they've been recently",
  "Make your target guess something about you that they get wrong",
  "Get your target to use the word 'actually' in conversation",
  "Convince your target to tell you about someone they miss",
  "Get your target to mention a TV show or movie they like",
  "Make your target say 'I don't know' in response to a question",
  "Get your target to gesture with their hands while explaining something",
  "Convince your target to share an opinion about the park/location",
  "Get your target to mention something they're looking forward to",
  "Make your target repeat back something you said in their own words",
  "Get your target to use the word 'interesting' about anything",
  "Convince your target to ask what time it is",
  "Get your target to mention a hobby or interest they have",
  "Make your target pause mid-sentence to think about something",
  "Get your target to mention something they learned recently",
  "Convince your target to notice something in their peripheral vision",
  "Get your target to use the phrase 'that's funny' or 'that's cool'",
  "Make your target mention a family member or friend naturally",
  "Get your target to shift their weight or change position while talking",
  
  // New additions - 50 more subtle missions
  "Get your target to say 'obviously' or 'of course' in conversation",
  "Make your target tell you their favorite ice cream flavor",
  "Convince your target to mention what they had for breakfast",
  "Get your target to use the word 'random' or 'weird' naturally",
  "Make your target admit they've forgotten something important recently",
  "Get your target to mention their biggest fear in a casual way",
  "Convince your target to tell you about their weirdest dream",
  "Get your target to use the phrase 'no way' or 'shut up' in surprise",
  "Make your target mention their favorite season of the year",
  "Get your target to admit they're procrastinating on something",
  "Convince your target to tell you about their ideal vacation",
  "Get your target to mention their favorite childhood game",
  "Make your target use the word 'perfect' about anything",
  "Get your target to tell you about the worst gift they ever received",
  "Convince your target to mention their biggest accomplishment",
  "Get your target to use the phrase 'I wish' in conversation",
  "Make your target tell you about their weirdest habit",
  "Get your target to mention their favorite type of music",
  "Convince your target to admit they've lied about liking something",
  "Get your target to use the word 'hilarious' or 'amazing'",
  "Make your target tell you about their first job",
  "Get your target to mention their favorite holiday",
  "Convince your target to tell you about their most embarrassing moment",
  "Get your target to use the phrase 'I can't believe' about anything",
  "Make your target mention their favorite animal",
  "Get your target to tell you about their worst fashion choice",
  "Convince your target to mention their celebrity crush",
  "Get your target to use the word 'terrible' or 'awful' about anything",
  "Make your target tell you about their strangest talent",
  "Get your target to mention their favorite book or movie genre",
  "Convince your target to tell you about their biggest regret",
  "Get your target to use the phrase 'I remember when' about anything",
  "Make your target mention their favorite restaurant or cuisine",
  "Get your target to tell you about their most irrational fear",
  "Convince your target to mention their dream job",
  "Get your target to use the word 'insane' or 'crazy' naturally",
  "Make your target tell you about their weirdest roommate/neighbor",
  "Get your target to mention their favorite way to relax",
  "Convince your target to tell you about their worst date",
  "Get your target to use the phrase 'I hate it when' about anything",
  "Make your target mention their favorite childhood cartoon",
  "Get your target to tell you about their most expensive purchase",
  "Convince your target to mention their spirit animal",
  "Get your target to use the word 'ridiculous' or 'absurd'",
  "Make your target tell you about their weirdest phobia",
  "Get your target to mention their favorite time of day",
  "Convince your target to tell you about their worst cooking disaster",
  "Get your target to use the phrase 'I love how' about anything",
  "Make your target mention their favorite social media platform",
  "Get your target to tell you about their most spontaneous decision"
];

// Generate a short 4-character session code
function generateSessionCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export class GameService {
  private gameState: GameState;
  private killConfirmations: Map<string, KillConfirmation> = new Map();
  public sessionCode: string;

  constructor(sessionCode?: string) {
    this.sessionCode = sessionCode || generateSessionCode();
    this.gameState = {
      players: {},
      targetChain: [],
      availableQuests: ENVIRONMENTAL_QUESTS,
      gameStarted: false,
      gameId: `rustin-game-${this.sessionCode}`,
      createdAt: Date.now(),
      hostId: undefined,
      sessionCode: this.sessionCode
    };
  }

  // Player Management
  addPlayer(name: string, avatar: string): Player {
    const playerId = uuidv4();
    const isFirstPlayer = Object.keys(this.gameState.players).length === 0;
    
    const player: Player = {
      id: playerId,
      name: name.trim(),
      avatar,
      kills: 0,
      questsCompleted: 0,
      isAlive: true,
      currentQuest: undefined, // Environmental quests only assigned when dead
      currentKillMission: undefined, // Kill missions assigned when target is assigned
      lastSeen: Date.now(),
      isHost: isFirstPlayer
    };

    this.gameState.players[playerId] = player;
    
    // Set first player as host
    if (isFirstPlayer) {
      this.gameState.hostId = playerId;
    }
    
    // Only rebuild target chain if game has started
    if (this.gameState.gameStarted) {
      this.rebuildTargetChain();
    }
    
    console.log(`Player ${name} (${playerId}) joined the game${isFirstPlayer ? ' as host' : ''}`);
    return player;
  }

  removePlayer(playerId: string): boolean {
    if (!this.gameState.players[playerId]) return false;
    
    delete this.gameState.players[playerId];
    
    // If removing the host, reset the game
    if (this.gameState.hostId === playerId) {
      this.resetToLobby();
    }
    
    // If no players left, reset the game
    if (Object.keys(this.gameState.players).length === 0) {
      this.resetToLobby();
    } else {
      // Reassign host if current host left but players remain
      if (this.gameState.hostId === playerId) {
        const remainingPlayers = Object.values(this.gameState.players);
        if (remainingPlayers.length > 0) {
          this.gameState.hostId = remainingPlayers[0].id;
          remainingPlayers[0].isHost = true;
        }
      }
      
      // Only rebuild target chain if game has started
      if (this.gameState.gameStarted) {
        this.rebuildTargetChain();
      }
    }
    
    console.log(`Player ${playerId} left the game`);
    return true;
  }

  getPlayer(playerId: string): Player | undefined {
    return this.gameState.players[playerId];
  }

  updatePlayerLastSeen(playerId: string): void {
    if (this.gameState.players[playerId]) {
      this.gameState.players[playerId].lastSeen = Date.now();
    }
  }

  // Target Management (Circular)
  private rebuildTargetChain(): void {
    const alivePlayers = Object.values(this.gameState.players).filter(p => p.isAlive);
    this.gameState.targetChain = alivePlayers.map(p => p.id);
    
    // Assign targets and kill missions in circular fashion
    alivePlayers.forEach((player, index) => {
      if (alivePlayers.length > 1) {
        const nextIndex = (index + 1) % alivePlayers.length;
        player.currentTarget = alivePlayers[nextIndex].id;
        player.currentKillMission = this.getRandomKillMission(); // Assign kill mission for the target
      } else {
        player.currentTarget = undefined; // Only one player left
        player.currentKillMission = undefined; // No kill mission if no target
      }
    });

    console.log(`Target chain rebuilt: ${this.gameState.targetChain.join(' -> ')}`);
  }

  getCurrentTarget(playerId: string): Player | undefined {
    const player = this.gameState.players[playerId];
    if (!player || !player.isAlive || !player.currentTarget) return undefined;
    
    return this.gameState.players[player.currentTarget];
  }

  // Kill System
  declareKill(killerId: string, victimId: string): { success: boolean; message: string } {
    console.log('🎯 GameService.declareKill called');
    console.log('🎯 Killer ID:', killerId);
    console.log('🎯 Victim ID:', victimId);
    
    const killer = this.gameState.players[killerId];
    const victim = this.gameState.players[victimId];

    console.log('🎯 Killer found:', !!killer, killer?.name);
    console.log('🎯 Victim found:', !!victim, victim?.name);

    if (!killer || !victim) {
      console.log('❌ Player not found');
      return { success: false, message: 'Player not found' };
    }

    if (!killer.isAlive) {
      console.log('❌ Killer is dead');
      return { success: false, message: 'Dead players cannot kill' };
    }

    if (!victim.isAlive) {
      console.log('❌ Victim is already dead');
      return { success: false, message: 'Target is already dead' };
    }

    if (killer.currentTarget !== victimId) {
      console.log('❌ Wrong target. Expected:', killer.currentTarget, 'Got:', victimId);
      return { success: false, message: 'You can only kill your assigned target' };
    }

    console.log('✅ All checks passed. Setting pendingKillConfirmation...');
    
    // Set up pending kill confirmation
    victim.pendingKillConfirmation = {
      killerId,
      killerName: killer.name,
      timestamp: Date.now()
    };
    
    console.log('🎯 pendingKillConfirmation set:', victim.pendingKillConfirmation);

    // Store kill confirmation for tracking
    const confirmationId = `${killerId}-${victimId}`;
    this.killConfirmations.set(confirmationId, {
      killerId,
      victimId,
      timestamp: Date.now(),
      confirmed: false
    });

    console.log(`✅ Kill declared: ${killer.name} -> ${victim.name}`);
    return { success: true, message: 'Kill declared, waiting for victim confirmation' };
  }

  confirmDeath(victimId: string, killerId?: string): { success: boolean; message: string; newTarget?: Player } {
    const victim = this.gameState.players[victimId];

    if (!victim) {
      return { success: false, message: 'Player not found' };
    }

    if (!victim.isAlive) {
      return { success: false, message: 'Player is already dead' };
    }

    // EMERGENCY WORKAROUND: Allow self-elimination without killer confirmation
    if (!killerId) {
      // Self-elimination
      victim.isAlive = false;
      victim.currentTarget = undefined;
      victim.currentKillMission = undefined;
      victim.currentQuest = this.getRandomQuest();
      victim.pendingKillConfirmation = undefined;

      // Rebuild target chain to maintain circular structure
      this.rebuildTargetChain();

      console.log(`Self-elimination: ${victim.name} declared themselves dead`);
      
      return { 
        success: true, 
        message: 'Self-elimination confirmed'
      };
    }

    // Original confirmation logic with killer
    const killer = this.gameState.players[killerId];
    const confirmationId = `${killerId}-${victimId}`;
    const confirmation = this.killConfirmations.get(confirmationId);

    if (!killer || !victim || !confirmation) {
      return { success: false, message: 'Invalid kill confirmation' };
    }

    if (!victim.pendingKillConfirmation || victim.pendingKillConfirmation.killerId !== killerId) {
      return { success: false, message: 'No pending kill confirmation from this killer' };
    }

    // Process the kill
    victim.isAlive = false;
    victim.currentTarget = undefined;
    victim.currentKillMission = undefined; // Clear kill mission since they're dead
    victim.currentQuest = this.getRandomQuest(); // Give environmental quest to dead player
    victim.pendingKillConfirmation = undefined;

    // Killer inherits victim's target and gets a kill point
    const victimTarget = this.getCurrentTarget(victimId);
    killer.kills += 1;
    killer.currentTarget = victim.currentTarget;

    // Mark confirmation as completed
    confirmation.confirmed = true;

    // Rebuild target chain to maintain circular structure
    this.rebuildTargetChain();

    console.log(`Kill confirmed: ${killer.name} eliminated ${victim.name}`);
    
    return { 
      success: true, 
      message: 'Kill confirmed successfully',
      newTarget: victimTarget
    };
  }

  // Quest System - Request witness confirmation
  requestQuestConfirmation(playerId: string, witnessId: string): { success: boolean; message: string } {
    const player = this.gameState.players[playerId];
    const witness = this.gameState.players[witnessId];
    
    if (!player || !witness) {
      return { success: false, message: 'Player or witness not found' };
    }

    if (!player.currentQuest) {
      return { success: false, message: 'No active quest' };
    }

    if (playerId === witnessId) {
      return { success: false, message: 'You cannot witness your own quest completion' };
    }

    // Set up pending quest confirmation for the witness
    witness.pendingQuestConfirmation = {
      questCompleterPlayerId: playerId,
      questCompleterName: player.name,
      questDescription: player.currentQuest,
      timestamp: Date.now()
    };

    console.log(`Quest confirmation requested: ${player.name} -> ${witness.name}`);
    return { success: true, message: 'Quest confirmation requested from witness' };
  }

  // Confirm quest completion as a witness
  confirmQuestCompletion(witnessId: string, questCompleterPlayerId: string): { success: boolean; message: string; newQuest?: string } {
    const witness = this.gameState.players[witnessId];
    const questCompleter = this.gameState.players[questCompleterPlayerId];

    if (!witness || !questCompleter) {
      return { success: false, message: 'Player not found' };
    }

    if (!witness.pendingQuestConfirmation || witness.pendingQuestConfirmation.questCompleterPlayerId !== questCompleterPlayerId) {
      return { success: false, message: 'No pending quest confirmation for this player' };
    }

    // Complete the quest
    questCompleter.questsCompleted += 1;
    const newQuest = this.getRandomQuest();
    questCompleter.currentQuest = newQuest;
    
    // Clear the pending confirmation
    witness.pendingQuestConfirmation = undefined;

    console.log(`Quest confirmed by ${witness.name} for ${questCompleter.name}. New quest: ${newQuest}`);
    
    return { 
      success: true, 
      message: 'Quest confirmed by witness!',
      newQuest
    };
  }

  // Deny quest completion as a witness
  denyQuestCompletion(witnessId: string, questCompleterPlayerId: string): { success: boolean; message: string } {
    const witness = this.gameState.players[witnessId];

    if (!witness) {
      return { success: false, message: 'Witness not found' };
    }

    if (!witness.pendingQuestConfirmation || witness.pendingQuestConfirmation.questCompleterPlayerId !== questCompleterPlayerId) {
      return { success: false, message: 'No pending quest confirmation for this player' };
    }

    // Clear the pending confirmation without completing the quest
    witness.pendingQuestConfirmation = undefined;

    console.log(`Quest denied by ${witness.name} for player ${questCompleterPlayerId}`);
    
    return { 
      success: true, 
      message: 'Quest completion denied'
    };
  }

  private getRandomQuest(): string {
    return ENVIRONMENTAL_QUESTS[Math.floor(Math.random() * ENVIRONMENTAL_QUESTS.length)];
  }

  private getRandomKillMission(): string {
    return KILL_MISSIONS[Math.floor(Math.random() * KILL_MISSIONS.length)];
  }

  // Game State
  getGameState(): GameState {
    return { ...this.gameState };
  }

  getPublicGameState(): any {
    return {
      gameId: this.gameState.gameId,
      gameStarted: this.gameState.gameStarted,
      playerCount: Object.keys(this.gameState.players).length,
      aliveCount: Object.values(this.gameState.players).filter(p => p.isAlive).length,
      hostId: this.gameState.hostId,
      players: Object.values(this.gameState.players).map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        isHost: p.isHost,
        isAlive: p.isAlive,
        kills: p.kills,
        questsCompleted: p.questsCompleted
      }))
    };
  }

  // Cleanup inactive players (call periodically)
  cleanupInactivePlayers(timeoutMs: number = 5 * 60 * 1000): string[] {
    const now = Date.now();
    const removedPlayers: string[] = [];

    Object.entries(this.gameState.players).forEach(([playerId, player]) => {
      if (now - player.lastSeen > timeoutMs) {
        removedPlayers.push(player.name);
        this.removePlayer(playerId);
      }
    });

    if (removedPlayers.length > 0) {
      console.log(`Cleaned up inactive players: ${removedPlayers.join(', ')}`);
    }

    return removedPlayers;
  }

  startGame(): void {
    this.gameState.gameStarted = true;
    
    // Build target chain and assign kill missions for the first time
    this.rebuildTargetChain();
    
    console.log('Game started! Targets and kill missions assigned to all alive players.');
  }

  canStartGame(playerId: string): boolean {
    const player = this.gameState.players[playerId];
    if (!player || !player.isHost) return false;
    if (this.gameState.gameStarted) return false;
    return Object.keys(this.gameState.players).length >= 2; // Need at least 2 players
  }

  // Reset game to lobby phase
  private resetToLobby(): void {
    this.gameState.gameStarted = false;
    this.gameState.hostId = undefined;
    this.gameState.targetChain = [];
    this.killConfirmations.clear();
    console.log('Game reset to lobby phase');
  }
} 