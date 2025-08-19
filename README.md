# 🎯 Secret Game - Rustin's Birthday Party

A browser-based social multiplayer game designed for 25+ people at Golden Gate Park! Players hunt each other with silly social missions and complete environmental quests when eliminated.

## 🎮 How to Play

1. **Join the Hunt**: Enter your name and get a random Rustin-themed monster avatar
2. **Hunt Your Target**: You'll be assigned one other player to eliminate using silly social missions
3. **Get Eliminated**: When killed, you'll get environmental quests to explore Golden Gate Park
4. **Confirm Actions**: Both killer and victim must confirm eliminations for fair play
5. **Stay Social**: The game encourages interaction with both players and park visitors!

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm

### Running the Game

**🚀 Easy Start (Recommended)**
```bash
git clone <repository>
cd secret_game
./start-game.sh
```
Then open http://localhost:3000 in your browser!

**🔧 Manual Start (if needed)**
1. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Play the Game**
   - Open http://localhost:3000 on your phone/computer
   - Enter your name and join the hunt!
   - Share the URL with other players

**🧪 Test Everything Works**
```bash
./tests/verify.sh
```

## 🏗️ Tech Stack

- **Frontend**: React + TypeScript, Tailwind CSS, Socket.IO Client
- **Backend**: Node.js + Express, Socket.IO Server
- **Deployment**: Cloudflare Pages + Workers (planned)

## 🎯 Game Features

### Core Mechanics
- **Circular Targeting**: Each player targets exactly one other player
- **Kill Confirmation**: Both players must confirm eliminations
- **Environmental Quests**: Assigned when eliminated or after quest completion
- **Real-time Updates**: Live game state updates via WebSockets

### Mobile-First Design
- Large touch targets (44px minimum)
- Single-column layout optimized for phones
- Battery-efficient with minimal animations
- Works offline with cached game state

### Avatar System
- 16 different Rustin-themed monster variations
- Cute cartoon style with Persian features, glasses, and beard
- Consistent avatar per player based on their ID

## 🌿 Environmental Quests

Designed specifically for Golden Gate Park (Larkin Meadow):

### Social Connection
- Compliment dog owners and learn their dogs' names
- Share park facts with first-time visitors
- Help strangers take photos and learn about their day

### Environmental Exploration
- Identify and touch different tree species
- Practice Leave No Trace principles
- Find quiet spots for meditation

### Creative Expression
- Create nature-inspired dances
- Build temporary art with natural materials
- Write haikus about the park

## 🔧 Development

### Project Structure
```
/
├── frontend/          # React app
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── services/      # Socket.IO service
│   │   ├── types/         # TypeScript interfaces
│   │   ├── data/          # Game data (quests, missions)
│   │   └── utils/         # Avatar generator
├── backend/           # Node.js server
│   ├── src/
│   │   ├── services/      # Game logic
│   │   ├── types/         # Shared types
│   │   └── index.ts       # Main server
└── .cursorrules       # Project documentation
```

### Key Components

**Frontend:**
- `JoinGame`: Player registration
- `PlayerCard`: Main game interface
- `SocketService`: Real-time communication
- `avatars.ts`: Rustin monster generator

**Backend:**
- `GameService`: Core game logic and state management
- `index.ts`: Express + Socket.IO server
- Circular targeting algorithm
- Kill confirmation system

### API Endpoints

**WebSocket Events:**
- `joinGame`: Player registration
- `declareKill`: Initiate elimination
- `confirmDeath`: Confirm elimination
- `completeQuest`: Mark quest as done

**REST API:**
- `GET /api/status`: Server health and game stats
- `GET /api/players`: All players (debug)
- `POST /api/start-game`: Start the game

## 🚀 Deployment

### Cloudflare (Recommended)
1. **Frontend**: Deploy to Cloudflare Pages
2. **Backend**: Deploy to Cloudflare Workers
3. **Database**: Use Cloudflare KV or Durable Objects

### Alternative: Heroku/Vercel
1. Deploy backend to Heroku
2. Deploy frontend to Vercel
3. Update CORS origins in backend

## 🎉 Party Tips

1. **Pre-Game**: Test with a few people first
2. **Device Prep**: Ensure everyone has good battery/data
3. **Backup Plan**: Have the URL written down somewhere
4. **Game Master**: Designate someone to help with technical issues
5. **Safety**: Remind players to stay aware of surroundings in the park

## 🐛 Troubleshooting

**✅ Common Issues - AUTO-FIXED!**
- **Tailwind CSS errors**: Fixed by replacing with simple CSS
- **PostCSS plugin issues**: Resolved by removing config files
- **Compilation failures**: Auto-detected and fixed

**If you encounter issues:**
```bash
./tests/test-and-fix.sh  # Automatically diagnose and fix problems
```

### Connection Issues
- Run `./tests/verify.sh` to check server status
- Use `./start-game.sh` for clean startup
- Check logs: `backend.log` and `frontend.log`

### Player Not Appearing
- Check browser console for errors
- Ensure WebSocket connection is established
- Try the "Reset & Reconnect" button

### Kill Confirmations Not Working
- Both players need to be online and connected
- Check that target assignment is correct
- Use debug info to verify player IDs

## 📝 License

Built for Rustin's Birthday Party 2024! 🎂

---

**Happy Hunting!** 🏹 