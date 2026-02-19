# MiniGames - Vue 3 + Phaser.js + Capacitor

A mini games distribution platform for Android built with Vue 3, Phaser.js, and Capacitor.

## Project Structure

```
├── src/
│   ├── games/                 # Vue components for individual games
│   │   ├── BouncyBall.vue    # Example: Physics-based game
│   │   └── ClickCounter.vue  # Example: Click/input game
│   ├── components/
│   │   └── GameContainer.vue # Game loader component
│   ├── App.vue               # Main app (menu + game runner)
│   ├── main.ts               # App entry point
│   └── style.css
├── android/                  # Capacitor Android project (generated)
├── index.html
├── vite.config.ts
├── capacitor.config.ts
└── package.json
```

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Development (Web)
```bash
npm run dev
```
Open http://localhost:5173

### 3. Build for Android

First-time setup:
```bash
npm run cap:add
```

Build and open in Android Studio:
```bash
npm run cap:run
```

Or just build without opening:
```bash
npm run cap:build
```

Then open the Android project:
```bash
npx capacitor open android
```

## Creating New Games

### 1. Create a Vue Component in `src/games/`
Example: `src/games/MyGame.vue`

```vue
<template>
  <div ref="gameDiv" class="game"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import Phaser from 'phaser'

const gameDiv = ref<HTMLDivElement | null>(null)
let game: Phaser.Game | null = null

onMounted(() => {
  if (!gameDiv.value) return

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: gameDiv.value,
    width: gameDiv.value.clientWidth,
    height: gameDiv.value.clientHeight,
    physics: {
      default: 'arcade',
      arcade: { gravity: { y: 300 } }
    },
    scene: {
      create: create
    }
  }

  game = new Phaser.Game(config)

  function create(this: Phaser.Scene) {
    // Your game logic here
  }
})

onBeforeUnmount(() => {
  if (game) {
    game.destroy(true)
    game = null
  }
})
</script>

<style scoped>
.game {
  width: 100%;
  height: 100%;
}
</style>
```

### 2. Register the Game in `src/App.vue`
Add to the `games` array:
```typescript
const games = ref<Game[]>([
  { id: 'bouncy', name: 'Bouncy Ball', component: 'BouncyBall' },
  { id: 'clicker', name: 'Click Counter', component: 'ClickCounter' },
  { id: 'mygame', name: 'My Game', component: 'MyGame' }, // New!
])
```

## Game Template Features

- **Auto-responsive**: Games resize to fill screen
- **Built-in cleanup**: Phaser instance destroyed on unmount
- **Vue integration**: Access Vue reactivity if needed
- **Phaser scenes**: Full Phaser API available (physics, animations, input, etc.)

## Deploying to Android

1. Build optimized version:
   ```bash
   npm run build
   npm run cap:sync android
   ```

2. Open Android Studio:
   ```bash
   npx capacitor open android
   ```

3. Build APK in Android Studio:
   - Build → Build Bundle(s) / APK(s) → Build APK(s)

4. Or build via command line:
   ```bash
   cd android && ./gradlew assembleDebug
   ```

## GitHub Workflow

After adding new games, commit and push:
```bash
git add src/games/YourGame.vue src/App.vue
git commit -m "Add new game: Your Game"
git push origin main
```

Users can then update by pulling the latest code.

## Technology Stack

- **Vue 3**: UI framework
- **Vite**: Fast build tool
- **Phaser 3**: Game engine
- **Capacitor**: Mobile wrapper
- **TypeScript**: Type safety

## Resources

- [Phaser 3 Docs](https://photonstorm.github.io/phaser3-docs/)
- [Vue 3 Docs](https://vuejs.org/)
- [Capacitor Docs](https://capacitorjs.com/)
