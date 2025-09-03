import { useState } from 'react'
import LandingPage from './LandingPage'
import AuthPage from './AuthPage'
import BookLibrary from './BookLibrary'
import ReadingPage from './ReadingPage'

type Page = 'landing' | 'auth' | 'library' | 'reading'

interface User {
  name: string
  email: string
}

interface Book {
  id: string
  title: string
  subtitle: string
  level: string
  language: 'en' | 'sw' | 'both'
  category: 'story' | 'textbook' | 'wordgame'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  cover: string
  description: string
}

export default function AppRouter() {
  const [currentPage, setCurrentPage] = useState<Page>('landing')
  const [user, setUser] = useState<User | null>(null)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const handleGetStarted = () => {
    setCurrentPage('auth')
  }

  const handleLogin = (userData: User) => {
    setUser(userData)
    setCurrentPage('library')
  }

  const handleLogout = () => {
    setUser(null)
    setSelectedBook(null)
    setCurrentPage('landing')
  }

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book)
    setCurrentPage('reading')
  }

  const handleBackToLibrary = () => {
    setSelectedBook(null)
    setCurrentPage('library')
  }

  switch (currentPage) {
    case 'landing':
      return <LandingPage onGetStarted={handleGetStarted} />
    
    case 'auth':
      return <AuthPage onLogin={handleLogin} />
    
    case 'library':
      return user ? (
        <BookLibrary 
          user={user} 
          onSelectBook={handleSelectBook}
          onLogout={handleLogout} 
        />
      ) : (
        <LandingPage onGetStarted={handleGetStarted} />
      )
    
    case 'reading':
      return user && selectedBook ? (
        <ReadingPage 
          book={selectedBook}
          user={user}
          onBackToLibrary={handleBackToLibrary}
        />
      ) : (
        <LandingPage onGetStarted={handleGetStarted} />
      )
    
    default:
      return <LandingPage onGetStarted={handleGetStarted} />
  }
}
