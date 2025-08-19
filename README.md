# 🎯 Rustin's Secret Game

[![Live Game](https://img.shields.io/badge/PLAY-LIVE-brightgreen.svg)](https://rustin-secret-game-rustinpartow-rustin-john-partows-projects.vercel.app/)
[![GitHub repo](https://img.shields.io/badge/GitHub-Repo-blue.svg)](https://github.com/rustinpartow/secret_game)
[![Deployment Status](https://img.shields.io/badge/Deployment-Production-success.svg)](https://rustin-secret-game-production.up.railway.app/api/status)

Secret Game is a live-action, mobile-first social game designed for large groups in real-world settings. It transforms a physical space, like a park, into a game arena where players are assigned secret targets to "eliminate" through fun, social challenges. The game acts as a powerful social lubricant for large events, encouraging guests to interact with new people and explore their surroundings in a playful, structured way.

![Game Screenshot](https://i.imgur.com/your-screenshot.png) <!-- TODO: Add a real screenshot -->

## Key Features

-   **Live Social Gameplay:** Built for in-person events to turn any party into a dynamic, interactive experience.
-   **Circular Targeting:** Every player is hunting one other player and being hunted by another, creating a balanced circle of suspense.
-   **Dual-Confirmation Kill System:** Eliminations require confirmation from both the assassin and the target via a real-time WebSocket backend, ensuring fair play.
-   **Living & Dead States:** Eliminated players aren't out of the game; they switch to completing environmental and social quests that encourage interaction with the space and other people.
-   **Real-time & Responsive:** Built with a modern React/TypeScript and Node.js stack, the game provides instant updates and is fully optimized for mobile devices.

## How to Play

1.  **Join the Game**: Open the [live game link](https://rustin-secret-game-rustinpartow-rustin-john-partows-projects.vercel.app/), enter your name, and get a unique, Rustin-themed monster avatar.
2.  **Receive Your Target**: You'll be secretly assigned one other player to "eliminate."
3.  **Complete Your Mission**: Your mission is a subtle social challenge (e.g., "get your target to sing a song").
4.  **Confirm the Kill**: Once you complete the mission, declare it in the app. Your target must then confirm your success.
5.  **Become a Quester**: If you are eliminated, you'll receive environmental and creative quests to complete around the event area.

## Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS, Socket.IO Client
-   **Backend**: Node.js, Express, TypeScript, WebSocket (Socket.IO)
-   **Deployment**:
    -   Frontend hosted on **Vercel**
    -   Backend hosted on **Railway**

## Local Development

### Prerequisites
- Node.js (v16 or higher)
- npm

### Running the Game

**🚀 Easy Start (Recommended)**
```bash
git clone https://github.com/rustinpartow/secret_game.git
cd secret_game
./start-game.sh
```
Then open `http://localhost:3000` in your browser.

**🔧 Manual Start**

1.  **Start Backend** (Terminal 1)
    ```bash
    cd backend
    npm install
    npm run dev
    ```

2.  **Start Frontend** (Terminal 2)
    ```bash
    cd frontend
    npm install
    npm start
    ```

3.  **Play the Game**
    - Open `http://localhost:3000` on your phone or computer.

### Running Tests
To ensure all systems are functioning correctly, run the verification script:
```bash
./tests/verify.sh
```

## Project Structure
```
/
├── frontend/          # React TypeScript App
├── backend/           # Node.js Express Server
├── tests/             # End-to-end and verification scripts
└── .github/           # (Future) CI/CD workflows
```

## Contributing
This project was built for a private event, but contributions and ideas are welcome! Feel free to open an issue or submit a pull request.

## License
This project is open-source. (TODO: Add a license file). 