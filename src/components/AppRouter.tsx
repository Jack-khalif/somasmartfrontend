import { useState } from 'react'
import LandingPage from './LandingPage'
import AuthPage from './AuthPage'
import BookLibrary from './BookLibrary'

type Page = 'landing' | 'auth' | 'library'

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

  const handleGetStarted = () => {
    setCurrentPage('auth')
  }

  const handleLogin = (userData: User) => {
    setUser(userData)
    setCurrentPage('library')
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentPage('landing')
  }

  const handleSelectBook = (book: Book) => {
    // Handle book selection - could navigate to reading interface
    console.log('Selected book:', book)
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
    
    default:
      return <LandingPage onGetStarted={handleGetStarted} />
  }
}
