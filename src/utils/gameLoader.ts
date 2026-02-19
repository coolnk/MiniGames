/**
 * Game loader utility for fetching games from mini-games-library
 */

export interface GameInfo {
  id: string
  title: string
  description: string
  bundleUrl: string
  version: string
  author: string
  bundleSize: string
}

export interface GameManifest {
  version: string
  lastUpdated: string
  games: GameInfo[]
}

const GAMES_MANIFEST_URL = 'https://raw.githubusercontent.com/coolnk/mini-games-library/main/manifest.json'

// Fallback manifest for development/when remote is unavailable
const FALLBACK_MANIFEST: GameManifest = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  games: [
    {
      id: 'bouncy-ball',
      title: 'Bouncy Ball',
      description: 'Watch a ball bounce around the screen with realistic physics',
      bundleUrl: 'https://cdn.jsdelivr.net/gh/coolnk/mini-games-library/games/bouncy-ball-bundle.js',
      version: '1.0.0',
      author: 'Mini Games Team',
      bundleSize: '2KB'
    },
    {
      id: 'click-counter',
      title: 'Click Counter',
      description: 'Click the button as many times as you can in 10 seconds!',
      bundleUrl: 'https://cdn.jsdelivr.net/gh/coolnk/mini-games-library/games/click-counter-bundle.js',
      version: '1.0.0',
      author: 'Mini Games Team',
      bundleSize: '2.5KB'
    },
    {
      id: 'memory-tiles',
      title: 'Memory Tiles',
      description: 'Watch the pattern and tap the tiles in the correct order. Test your memory!',
      bundleUrl: 'https://cdn.jsdelivr.net/gh/coolnk/mini-games-library/games/memory-tiles-bundle.js',
      version: '1.0.0',
      author: 'Mini Games Team',
      bundleSize: '3KB'
    },
    {
      id: 'caterpillar',
      title: 'Caterpillar',
      description: 'Guide the caterpillar to eat food and grow longer. Use arrow keys or WASD to move!',
      bundleUrl: 'https://cdn.jsdelivr.net/gh/coolnk/mini-games-library/games/caterpillar-bundle.js',
      version: '1.0.0',
      author: 'Mini Games Team',
      bundleSize: '4KB'
    }
  ]
}

/**
 * Fetch games manifest from mini-games-library
 */
export async function fetchGameManifest(): Promise<GameManifest> {
  try {
    // Add timestamp to bust CDN cache and force fresh manifest
    const cacheBreaker = new Date().getTime()
    const url = `${GAMES_MANIFEST_URL}?t=${cacheBreaker}`
    console.log(`Fetching manifest from: ${url}`)
    const response = await fetch(url)
    console.log(`Fetch response status: ${response.status}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch manifest: ${response.statusText}`)
    }
    const manifest: GameManifest = await response.json()
    console.log(`✅ Fetched ${manifest.games.length} games from remote`)
    console.log('Games:', manifest.games.map(g => g.id))
    return manifest
  } catch (error) {
    console.warn('Error fetching games manifest from remote, using fallback:', error)
    console.log(`✅ Using fallback manifest with ${FALLBACK_MANIFEST.games.length} games`)
    return FALLBACK_MANIFEST
  }
}

/**
 * Load a game bundle - executes the bundle code to register the game
 */
export async function loadGameBundle(bundleUrl: string, gameId: string): Promise<void> {
  try {
    console.log(`Loading game bundle: ${gameId}`)
    const response = await fetch(bundleUrl)
    if (!response.ok) {
      throw new Error(`Failed to load game bundle: ${response.statusText}`)
    }

    const bundleCode = await response.text()

    // Execute the bundle code to register the game
    const func = new Function(bundleCode)
    func()

    console.log(`✅ Game bundle loaded: ${gameId}`)
  } catch (error) {
    console.error(`Error loading game bundle for ${gameId}:`, error)
    throw error
  }
}

