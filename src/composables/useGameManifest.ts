import { ref } from 'vue'
import { fetchGameManifest, type GameInfo } from '@/utils/gameLoader'

export function useGameManifest() {
  const games = ref<GameInfo[]>([])
  const loading = ref(false)
  const error = ref('')

  const loadGames = async () => {
    loading.value = true
    error.value = ''

    try {
      console.log('🔄 Loading games...')
      const manifest = await fetchGameManifest()
      console.log('✅ Manifest loaded:', manifest)
      games.value = manifest.games
      console.log('✅ Games ready:', games.value.length)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load games'
      console.error('❌ Error:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    games,
    loading,
    error,
    loadGames
  }
}
