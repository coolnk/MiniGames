import { computed } from 'vue'
import { useLibraryStore } from '@/stores/libraryStore'
import { useUserStore } from '@/stores/userStore'

export function useBooks(ageGroup?: string) {
  const libraryStore = useLibraryStore()
  const userStore = useUserStore()

  const filteredBooks = computed(() => {
    if (ageGroup) {
      return libraryStore.getBooksByAgeGroup(ageGroup)
    }
    return libraryStore.books
  })

  const favoriteBooks = computed(() => {
    return filteredBooks.value.filter(book =>
      userStore.isBookFavorited(book.id)
    )
  })

  const readBooks = computed(() => {
    return filteredBooks.value.filter(book =>
      userStore.progress.booksRead.includes(book.id)
    )
  })

  const unreadBooks = computed(() => {
    return filteredBooks.value.filter(book =>
      !userStore.progress.booksRead.includes(book.id)
    )
  })

  const searchBooks = (query: string) => {
    return filteredBooks.value.filter(book =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase())
    )
  }

  const markAsRead = (bookId: string) => {
    userStore.completeBook(bookId)
  }

  const toggleFavorite = (bookId: string) => {
    userStore.toggleBookFavorite(bookId)
  }

  return {
    books: filteredBooks,
    favoriteBooks,
    readBooks,
    unreadBooks,
    loading: computed(() => libraryStore.loadingBooks),
    error: computed(() => libraryStore.errorBooks),
    searchBooks,
    markAsRead,
    toggleFavorite
  }
}
