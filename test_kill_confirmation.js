const io = require('socket.io-client');

// Test configuration
const BACKEND_URL = 'https://rustin-secret-game-production.up.railway.app';
const SESSION_CODE = 'TEST';

class KillConfirmationTest {
  constructor() {
    this.player1Socket = null;
    this.player2Socket = null;
    this.player1Data = null;
    this.player2Data = null;
    this.gameStarted = false;
  }

  async runTest() {
    console.log('🎯 Starting Kill Confirmation Test...');
    console.log('Frontend URL: https://rustin-secret-game-kggryp5t0-rustin-john-partows-projects.vercel.app');
    console.log('Backend URL:', BACKEND_URL);
    
    try {
      // Step 1: Connect both players
      await this.connectPlayers();
      
      // Step 2: Start the game
      await this.startGame();
      
      // Step 3: Test kill declaration and confirmation
      await this.testKillConfirmation();
      
      console.log('✅ ALL TESTS PASSED! Kill confirmation is working correctly!');
      console.log('🎯 Now test in browser:');
      console.log('   1. Open two browser windows to the frontend URL');
      console.log('   2. Join as different players in same session');
      console.log('   3. Start game');
      console.log('   4. Player 1 declares kill');
      console.log('   5. Player 2 should see BIG RED ALERT with debug info!');
      
    } catch (error) {
      console.error('❌ Test failed:', error);
    } finally {
      this.cleanup();
    }
  }

  async connectPlayers() {
    console.log('📡 Connecting players...');
    
    // Connect Player 1
    this.player1Socket = io(BACKEND_URL);
    await this.waitForConnection(this.player1Socket, 'Player 1');
    
    // Connect Player 2  
    this.player2Socket = io(BACKEND_URL);
    await this.waitForConnection(this.player2Socket, 'Player 2');
    
    // Join game as Player 1 (host)
    this.player1Data = await this.joinGame(this.player1Socket, 'TestPlayer1');
    console.log('✅ Player 1 joined as host:', this.player1Data.name);
    
    // Join game as Player 2
    this.player2Data = await this.joinGame(this.player2Socket, 'TestPlayer2');
    console.log('✅ Player 2 joined:', this.player2Data.name);
  }

  async startGame() {
    console.log('🚀 Starting game...');
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Game start timeout')), 5000);
      
      // Listen for target assignment (confirms game started)
      this.player1Socket.on('playerUpdate', (player) => {
        if (player.currentTarget && !this.gameStarted) {
          clearTimeout(timeout);
          this.gameStarted = true;
          console.log(`✅ Game started! Player 1 targets: ${player.currentTarget}`);
          resolve();
        }
      });
      
      this.player1Socket.emit('startGame');
    });
  }

  async testKillConfirmation() {
    console.log('⚔️ Testing kill confirmation...');
    
    // Track what Player 2 receives
    let killConfirmationReceived = false;
    let playerUpdateCount = 0;
    let finalConfirmation = false;
    
    this.player2Socket.on('playerUpdate', (player) => {
      playerUpdateCount++;
      console.log(`🎯 Player 2 received playerUpdate #${playerUpdateCount}:`, {
        name: player.name,
        isAlive: player.isAlive,
        hasPendingKillConfirmation: !!player.pendingKillConfirmation,
        pendingKillConfirmation: player.pendingKillConfirmation
      });
      
      if (player.pendingKillConfirmation && !killConfirmationReceived) {
        killConfirmationReceived = true;
        console.log('✅ KILL CONFIRMATION RECEIVED! Player 2 should see:');
        console.log('   🚨 ELIMINATION ALERT! 🚨');
        console.log(`   ${player.pendingKillConfirmation.killerName} claims to have eliminated you!`);
        console.log('   🔧 DEBUG: pendingKillConfirmation = YES ✅');
        
        // Simulate Player 2 clicking "CONFIRM MY DEATH"
        setTimeout(() => {
          console.log('💀 Player 2 confirming death...');
          this.player2Socket.emit('confirmDeath', player.pendingKillConfirmation.killerId);
        }, 1000);
      }
      
      if (!player.isAlive && !finalConfirmation) {
        finalConfirmation = true;
        console.log('✅ Player 2 confirmed as dead! Should see environmental quest.');
      }
    });

    this.player2Socket.on('disconnect', () => {
      console.log('❌ Player 2 disconnected - this indicates a frontend crash!');
    });

    // Player 1 declares kill on Player 2
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Kill confirmation test failed:
          - playerUpdateCount: ${playerUpdateCount}
          - killConfirmationReceived: ${killConfirmationReceived}
          - finalConfirmation: ${finalConfirmation}`));
      }, 15000);
      
      this.player1Socket.on('playerUpdate', (player) => {
        if (player.kills > 0 && finalConfirmation) {
          clearTimeout(timeout);
          console.log('✅ KILL FULLY PROCESSED! Player 1 got the kill credit.');
          resolve();
        }
      });
      
      console.log('⚔️ Player 1 declaring kill on Player 2...');
      this.player1Socket.emit('declareKill', this.player2Data.id);
    });
  }

  waitForConnection(socket, playerName) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`${playerName} connection timeout`)), 5000);
      
      socket.on('connect', () => {
        clearTimeout(timeout);
        console.log(`✅ ${playerName} connected`);
        resolve();
      });
    });
  }

  joinGame(socket, playerName) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`${playerName} join timeout`)), 5000);
      
      socket.on('playerUpdate', (player) => {
        clearTimeout(timeout);
        resolve(player);
      });
      
      socket.emit('joinGame', {
        name: playerName,
        avatar: 'test-avatar',
        sessionCode: SESSION_CODE
      });
    });
  }

  cleanup() {
    console.log('🧹 Cleaning up...');
    if (this.player1Socket) this.player1Socket.disconnect();
    if (this.player2Socket) this.player2Socket.disconnect();
  }
}

// Run the test
const test = new KillConfirmationTest();
test.runTest(); 