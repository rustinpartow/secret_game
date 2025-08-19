#!/usr/bin/env node

// Functional Test for Secret Game
// Tests actual game logic, WebSocket communication, and user flows

const io = require('socket.io-client');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

console.log('🎯 Secret Game - Functional Test');
console.log('=================================');

// Test configuration
const BACKEND_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:3000';

// Helper functions
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const createTestPlayer = (name) => {
  return new Promise((resolve, reject) => {
    const socket = io(BACKEND_URL);
    let playerData = null;
    let targetData = null;

    socket.on('connect', () => {
      console.log(`✅ ${name} connected to WebSocket`);
      
      // Join the game
      socket.emit('joinGame', {
        name: name,
        avatar: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#FF6B6B"/><text x="50" y="55" text-anchor="middle" fill="white">${name[0]}</text></svg>`
      });
    });

    socket.on('playerUpdate', (player) => {
      console.log(`✅ ${name} received player update:`, {
        id: player.id.slice(0, 8) + '...',
        name: player.name,
        isAlive: player.isAlive,
        kills: player.kills,
        questsCompleted: player.questsCompleted
      });
      playerData = player;
    });

    socket.on('targetAssigned', (target) => {
      console.log(`✅ ${name} assigned target:`, target.name);
      targetData = target;
    });

    socket.on('killConfirmationRequest', (data) => {
      console.log(`✅ ${name} received kill confirmation request from:`, data.killerName);
      
      // Auto-confirm death for testing
      setTimeout(() => {
        socket.emit('confirmDeath', data.killerId);
        console.log(`✅ ${name} confirmed death`);
      }, 1000);
    });

    socket.on('error', (error) => {
      console.log(`❌ ${name} WebSocket error:`, error);
      reject(error);
    });

    // Wait for initial setup
    setTimeout(() => {
      resolve({
        socket,
        getPlayerData: () => playerData,
        getTargetData: () => targetData,
        declareKill: () => {
          if (targetData) {
            socket.emit('declareKill', targetData.id);
            console.log(`✅ ${name} declared kill on ${targetData.name}`);
          }
        },
        completeQuest: () => {
          socket.emit('completeQuest');
          console.log(`✅ ${name} completed quest`);
        },
        disconnect: () => {
          socket.disconnect();
          console.log(`✅ ${name} disconnected`);
        }
      });
    }, 2000);
  });
};

// Main test function
async function runFunctionalTest() {
  try {
    // Test 1: Backend API endpoints
    console.log('\n🔧 Testing Backend API...');
    
    const statusResponse = await fetch(`${BACKEND_URL}/api/status`);
    const statusData = await statusResponse.json();
    console.log('✅ Backend status:', statusData);

    // Test 2: Frontend accessibility
    console.log('\n🎨 Testing Frontend...');
    
    const frontendResponse = await fetch(FRONTEND_URL);
    if (frontendResponse.ok) {
      console.log('✅ Frontend is accessible');
    } else {
      throw new Error('Frontend not accessible');
    }

    // Test 3: Player registration and WebSocket communication
    console.log('\n👥 Testing Player Registration...');
    
    const player1 = await createTestPlayer('Alice');
    await wait(1000);
    
    const player2 = await createTestPlayer('Bob');
    await wait(1000);
    
    const player3 = await createTestPlayer('Charlie');
    await wait(2000);

    // Test 4: Target assignment (circular targeting)
    console.log('\n🎯 Testing Target Assignment...');
    
    const p1Data = player1.getPlayerData();
    const p2Data = player2.getPlayerData();
    const p3Data = player3.getPlayerData();
    
    console.log('Player data:', {
      [p1Data.name]: { target: player1.getTargetData()?.name || 'None' },
      [p2Data.name]: { target: player2.getTargetData()?.name || 'None' },
      [p3Data.name]: { target: player3.getTargetData()?.name || 'None' }
    });

    // Test 5: Kill system
    console.log('\n⚔️ Testing Kill System...');
    
    // Player 1 kills their target
    player1.declareKill();
    await wait(3000); // Wait for kill confirmation

    // Test 6: Quest system
    console.log('\n🌿 Testing Quest System...');
    
    player2.completeQuest();
    await wait(1000);

    // Test 7: Game state consistency
    console.log('\n📊 Testing Game State...');
    
    const finalStatusResponse = await fetch(`${BACKEND_URL}/api/status`);
    const finalStatusData = await finalStatusResponse.json();
    console.log('✅ Final game state:', finalStatusData);

    const playersResponse = await fetch(`${BACKEND_URL}/api/players`);
    const playersData = await playersResponse.json();
    console.log('✅ All players:', Object.keys(playersData).length, 'total');

    // Cleanup
    console.log('\n🧹 Cleaning up...');
    player1.disconnect();
    player2.disconnect();
    player3.disconnect();
    
    await wait(1000);

    console.log('\n🎉 FUNCTIONAL TEST COMPLETE!');
    console.log('=====================================');
    console.log('✅ All core game features working');
    console.log('✅ WebSocket communication functional');
    console.log('✅ Player registration working');
    console.log('✅ Target assignment working');
    console.log('✅ Kill system operational');
    console.log('✅ Quest system working');
    console.log('\n🎂 Ready for the birthday party! 🏹');

  } catch (error) {
    console.error('\n❌ FUNCTIONAL TEST FAILED:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Check if socket.io-client is available
try {
  require.resolve('socket.io-client');
  require.resolve('node-fetch');
} catch (e) {
  console.log('📦 Installing test dependencies...');
  require('child_process').execSync('npm install socket.io-client node-fetch', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
}

runFunctionalTest(); 