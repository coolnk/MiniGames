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

/**
 * Fetch games manifest from mini-games-library
 */
export async function fetchGameManifest(): Promise<GameManifest> {
  try {
    const response = await fetch(GAMES_MANIFEST_URL)
    if (!response.ok) {
      throw new Error(`Failed to fetch manifest: ${response.statusText}`)
    }
    const manifest: GameManifest = await response.json()
    console.log(`✅ Fetched ${manifest.games.length} games`)
    return manifest
  } catch (error) {
    console.error('Error fetching games manifest:', error)
    throw error
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

