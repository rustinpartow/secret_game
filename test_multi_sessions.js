const io = require('socket.io-client');

// Test multiple concurrent game sessions
async function testMultiSessions() {
  console.log('🧪 Testing multiple concurrent sessions...');
  
  // Session 1: GAME (explicit code)
  console.log('\n📋 === SESSION 1: GAME ===');
  const session1Player1 = io('http://localhost:3001');
  
  session1Player1.on('connect', () => {
    console.log('👤 Session 1 - Player 1 connected');
    session1Player1.emit('joinGame', { name: 'Alice', avatar: '👩‍🦰', sessionCode: 'GAME' });
  });
  
  session1Player1.on('playerUpdate', (player) => {
    console.log(`✅ Session 1 - Player updated:`, { 
      name: player.name, 
      isHost: player.isHost,
      hasTarget: !!player.currentTarget
    });
  });
  
  session1Player1.on('gameStateUpdate', (state) => {
    console.log(`📊 Session ${state.gameId}: players=${state.playerCount}, started=${state.gameStarted}`);
  });
  
  // Session 2: PARK (explicit code)
  setTimeout(() => {
    console.log('\n📋 === SESSION 2: PARK ===');
    const session2Player1 = io('http://localhost:3001');
    
    session2Player1.on('connect', () => {
      console.log('👤 Session 2 - Player 1 connected');
      session2Player1.emit('joinGame', { name: 'Bob', avatar: '👨‍🦱', sessionCode: 'PARK' });
    });
    
    session2Player1.on('playerUpdate', (player) => {
      console.log(`✅ Session 2 - Player updated:`, { 
        name: player.name, 
        isHost: player.isHost,
        hasTarget: !!player.currentTarget
      });
    });
    
    session2Player1.on('gameStateUpdate', (state) => {
      console.log(`📊 Session ${state.gameId}: players=${state.playerCount}, started=${state.gameStarted}`);
    });
    
    // Add second player to Session 1
    setTimeout(() => {
      const session1Player2 = io('http://localhost:3001');
      
      session1Player2.on('connect', () => {
        console.log('👤 Session 1 - Player 2 connected');
        session1Player2.emit('joinGame', { name: 'Charlie', avatar: '👨‍🦳', sessionCode: 'GAME' });
      });
      
      session1Player2.on('playerUpdate', (player) => {
        console.log(`✅ Session 1 - Player 2 updated:`, { 
          name: player.name, 
          isHost: player.isHost,
          hasTarget: !!player.currentTarget
        });
      });
      
      // Start Session 1 (should work with 2 players)
      setTimeout(() => {
        console.log('\n🚀 Starting Session 1 (GAME)...');
        session1Player1.emit('startGame');
      }, 1000);
      
      // Try to start Session 2 (should fail with only 1 player)
      setTimeout(() => {
        console.log('\n🚀 Attempting to start Session 2 (PARK) with only 1 player...');
        session2Player1.emit('startGame');
      }, 2000);
      
      // Clean up after 6 seconds
      setTimeout(() => {
        console.log('\n🧹 Cleaning up test...');
        session1Player1.disconnect();
        session1Player2.disconnect();
        session2Player1.disconnect();
        process.exit(0);
      }, 6000);
      
    }, 1000);
  }, 1000);
}

testMultiSessions().catch(console.error); 