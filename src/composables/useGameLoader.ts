import { ref } from 'vue'
import { type GameInfo } from '@/utils/gameLoader'

export function useGameLoader(game: GameInfo) {
  const loading = ref(true)
  const error = ref('')

  const loadGame = async (gameIframe: HTMLIFrameElement) => {
    loading.value = true
    error.value = ''

    try {
      console.log(`Loading game: ${game.id}`)

      // Fetch the game bundle
      const response = await fetch(game.bundleUrl + '?v=' + Date.now())
      if (!response.ok) {
        throw new Error(`Failed to load game bundle: ${response.statusText}`)
      }

      const bundleCode = await response.text()
      console.log(`Bundle loaded: ${bundleCode.length} bytes`)

      // Create HTML content for the iframe
      const iframeContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${game.title}</title>
          <script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js"><\/script>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { width: 100%; height: 100%; }
            body { overflow: hidden; }
            #game { width: 100%; height: 100%; }
          </style>
        </head>
        <body>
          <div id="game"></div>
          <script>
            (function() {
              ${bundleCode}
              
              // Initialize Phaser game with the registered scene
              if (window.PhaserGames && window.PhaserGames['${game.id}']) {
                const config = {
                  type: Phaser.AUTO,
                  parent: 'game',
                  scale: {
                    mode: Phaser.Scale.FIT,
                    autoCenter: Phaser.Scale.CENTER_BOTH,
                    width: window.innerWidth,
                    height: window.innerHeight
                  },
                  scene: window.PhaserGames['${game.id}']
                };
                const game = new Phaser.Game(config);
                console.log('✅ Phaser game initialized: ${game.id}');
              } else {
                console.error('❌ Scene not found in window.PhaserGames');
              }
            })();
          <\/script>
        </body>
        </html>
      `

      // Write content to iframe
      const iframeDoc = gameIframe.contentDocument
      if (!iframeDoc) {
        throw new Error('Cannot access iframe document')
      }

      iframeDoc.open()
      iframeDoc.write(iframeContent)
      iframeDoc.close()

      console.log(`✅ Game loaded in iframe: ${game.id}`)
      loading.value = false
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error loading game'
      console.error('Error loading game:', err)
      loading.value = false
    }
  }

  const retry = async (gameIframe: HTMLIFrameElement) => {
    loading.value = true
    error.value = ''
    await loadGame(gameIframe)
  }

  return {
    loading,
    error,
    loadGame,
    retry
  }
}
