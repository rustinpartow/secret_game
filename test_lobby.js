const io = require('socket.io-client');

// Test lobby functionality with multiple players
async function testLobby() {
  console.log('🧪 Testing lobby functionality...');
  
  // Player 1 (Host)
  const player1 = io('http://localhost:3001');
  
  player1.on('connect', () => {
    console.log('👤 Player 1 connected');
    player1.emit('joinGame', { name: 'Alice', avatar: '👩‍🦰' });
  });
  
  player1.on('playerUpdate', (player) => {
    console.log(`✅ Player 1 updated:`, { 
      name: player.name, 
      isHost: player.isHost,
      hasTarget: !!player.currentTarget,
      hasQuest: !!player.currentQuest
    });
  });
  
  player1.on('gameStateUpdate', (state) => {
    console.log(`📊 Game state:`, {
      gameStarted: state.gameStarted,
      playerCount: state.playerCount,
      hostId: state.hostId?.slice(0, 8)
    });
  });
  
  // Wait a bit, then add Player 2
  setTimeout(() => {
    const player2 = io('http://localhost:3001');
    
    player2.on('connect', () => {
      console.log('👤 Player 2 connected');
      player2.emit('joinGame', { name: 'Bob', avatar: '👨‍🦱' });
    });
    
    player2.on('playerUpdate', (player) => {
      console.log(`✅ Player 2 updated:`, { 
        name: player.name, 
        isHost: player.isHost,
        hasTarget: !!player.currentTarget,
        hasQuest: !!player.currentQuest
      });
    });
    
    // Wait a bit more, then try to start game
    setTimeout(() => {
      console.log('🚀 Host attempting to start game...');
      player1.emit('startGame');
      
      // Listen for target assignments
      player1.on('targetAssigned', (target) => {
        console.log(`🎯 Player 1 target assigned: ${target.name}`);
      });
      
      player2.on('targetAssigned', (target) => {
        console.log(`🎯 Player 2 target assigned: ${target.name}`);
      });
      
      // Clean up after 5 seconds
      setTimeout(() => {
        console.log('🧹 Cleaning up test...');
        player1.disconnect();
        player2.disconnect();
        process.exit(0);
      }, 5000);
      
    }, 2000);
    
  }, 2000);
}

testLobby().catch(console.error); 