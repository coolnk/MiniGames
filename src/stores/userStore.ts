import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserProgress {
  gamesCompleted: string[]
  gameScores: Record<string, number>
  booksRead: string[]
  bookmarks: string[]
  favoriteGames: string[]
  favoriteBooks: string[]
  activitiesCompleted: string[]
}

export const useUserStore = defineStore('user', () => {
  // User authentication & profile
  const isAuthenticated = ref(false)
  const userId = ref<string | null>(null)
  const userName = ref('')
  const userAvatar = ref('')
  const userAge = ref<number | null>(null)

  // User progress
  const progress = ref<UserProgress>({
    gamesCompleted: [],
    gameScores: {},
    booksRead: [],
    bookmarks: [],
    favoriteGames: [],
    favoriteBooks: [],
    activitiesCompleted: []
  })

  // Computed properties
  const gamesCompleted = computed(() => progress.value.gamesCompleted.length)
  const booksRead = computed(() => progress.value.booksRead.length)
  const activitiesCompleted = computed(() => progress.value.activitiesCompleted.length)

  // Check if something is favorited
  const isGameFavorited = (gameId: string) => {
    return progress.value.favoriteGames.includes(gameId)
  }

  const isBookFavorited = (bookId: string) => {
    return progress.value.favoriteBooks.includes(bookId)
  }

  const isBookmarked = (itemId: string) => {
    return progress.value.bookmarks.includes(itemId)
  }

  // Actions
  const login = (id: string, name: string, avatar: string, age: number) => {
    userId.value = id
    userName.value = name
    userAvatar.value = avatar
    userAge.value = age
    isAuthenticated.value = true
    loadProgressFromStorage()
  }

  const logout = () => {
    isAuthenticated.value = false
    userId.value = null
    userName.value = ''
    userAvatar.value = ''
    userAge.value = null
    progress.value = {
      gamesCompleted: [],
      gameScores: {},
      booksRead: [],
      bookmarks: [],
      favoriteGames: [],
      favoriteBooks: [],
      activitiesCompleted: []
    }
  }

  const completeGame = (gameId: string, score: number = 0) => {
    if (!progress.value.gamesCompleted.includes(gameId)) {
      progress.value.gamesCompleted.push(gameId)
    }
    progress.value.gameScores[gameId] = score
    saveProgressToStorage()
  }

  const completeBook = (bookId: string) => {
    if (!progress.value.booksRead.includes(bookId)) {
      progress.value.booksRead.push(bookId)
    }
    saveProgressToStorage()
  }

  const completeActivity = (activityId: string) => {
    if (!progress.value.activitiesCompleted.includes(activityId)) {
      progress.value.activitiesCompleted.push(activityId)
    }
    saveProgressToStorage()
  }

  const toggleGameFavorite = (gameId: string) => {
    const index = progress.value.favoriteGames.indexOf(gameId)
    if (index > -1) {
      progress.value.favoriteGames.splice(index, 1)
    } else {
      progress.value.favoriteGames.push(gameId)
    }
    saveProgressToStorage()
  }

  const toggleBookFavorite = (bookId: string) => {
    const index = progress.value.favoriteBooks.indexOf(bookId)
    if (index > -1) {
      progress.value.favoriteBooks.splice(index, 1)
    } else {
      progress.value.favoriteBooks.push(bookId)
    }
    saveProgressToStorage()
  }

  const toggleBookmark = (itemId: string) => {
    const index = progress.value.bookmarks.indexOf(itemId)
    if (index > -1) {
      progress.value.bookmarks.splice(index, 1)
    } else {
      progress.value.bookmarks.push(itemId)
    }
    saveProgressToStorage()
  }

  // Local storage persistence
  const saveProgressToStorage = () => {
    if (userId.value && typeof localStorage !== 'undefined') {
      localStorage.setItem(`user_progress_${userId.value}`, JSON.stringify(progress.value))
    }
  }

  const loadProgressFromStorage = () => {
    if (userId.value && typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(`user_progress_${userId.value}`)
      if (stored) {
        progress.value = JSON.parse(stored)
      }
    }
  }

  return {
    // State
    isAuthenticated,
    userId,
    userName,
    userAvatar,
    userAge,
    progress,

    // Computed
    gamesCompleted,
    booksRead,
    activitiesCompleted,
    isGameFavorited,
    isBookFavorited,
    isBookmarked,

    // Actions
    login,
    logout,
    completeGame,
    completeBook,
    completeActivity,
    toggleGameFavorite,
    toggleBookFavorite,
    toggleBookmark,
    loadProgressFromStorage,
    saveProgressToStorage
  }
})
