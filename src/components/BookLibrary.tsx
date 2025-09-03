import { useState } from 'react'

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

interface BookLibraryProps {
  user: { name: string; email: string }
  onSelectBook: (book: Book) => void
  onLogout: () => void
}

export default function BookLibrary({ user, onSelectBook, onLogout }: BookLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'story' | 'textbook' | 'wordgame'>('all')
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'en' | 'sw'>('all')
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')

  // Sample books - in production, this would come from your backend/government database
  const books: Book[] = [
    {
      id: '1',
      title: 'The Clever Hare and the Tortoise',
      subtitle: 'Kenyan Folk Tale',
      level: 'Grade 1-3',
      language: 'both',
      category: 'story',
      difficulty: 'beginner',
      cover: '🐰',
      description: 'A classic tale about perseverance and wisdom from Kenyan folklore.'
    },
    {
      id: '2',
      title: 'Sungura na Nyoka',
      subtitle: 'Hadithi ya Kiswahili',
      level: 'Grade 2-4',
      language: 'sw',
      category: 'story',
      difficulty: 'intermediate',
      cover: '🐍',
      description: 'Hadithi ya kujifunza kuhusu ushujaa na busara.'
    },
    {
      id: '3',
      title: 'My First English Words',
      subtitle: 'Government Syllabus',
      level: 'Grade 1',
      language: 'en',
      category: 'textbook',
      difficulty: 'beginner',
      cover: '📚',
      description: 'Official curriculum book for learning basic English vocabulary.'
    },
    {
      id: '4',
      title: 'Maneno ya Kiswahili',
      subtitle: 'Kitabu cha Serikali',
      level: 'Grade 1-2',
      language: 'sw',
      category: 'textbook',
      difficulty: 'beginner',
      cover: '📖',
      description: 'Kitabu rasmi cha kujifunza maneno ya msingi ya Kiswahili.'
    },
    {
      id: '5',
      title: 'Word Puzzle Adventures',
      subtitle: 'Interactive Learning',
      level: 'All Grades',
      language: 'both',
      category: 'wordgame',
      difficulty: 'intermediate',
      cover: '🧩',
      description: 'Fun word games to improve reading and spelling skills.'
    },
    {
      id: '6',
      title: 'Rhyme Time Challenge',
      subtitle: 'Poetry & Phonics',
      level: 'Grade 2-4',
      language: 'en',
      category: 'wordgame',
      difficulty: 'intermediate',
      cover: '🎵',
      description: 'Learn through rhymes and develop phonetic awareness.'
    }
  ]

  const filteredBooks = books.filter(book => {
    const categoryMatch = selectedCategory === 'all' || book.category === selectedCategory
    const languageMatch = selectedLanguage === 'all' || book.language === selectedLanguage || book.language === 'both'
    const levelMatch = selectedLevel === 'all' || book.difficulty === selectedLevel
    return categoryMatch && languageMatch && levelMatch
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'story': return '📚'
      case 'textbook': return '🎓'
      case 'wordgame': return '🎮'
      default: return '📖'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Book Library</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Reading Level</p>
                <p className="font-semibold text-blue-600">Grade 1-3</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Find Your Perfect Book</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="story">Stories & Tales</option>
                <option value="textbook">Textbooks</option>
                <option value="wordgame">Word Games</option>
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Languages</option>
                <option value="en">English</option>
                <option value="sw">Kiswahili 🇰🇪</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <div
              key={book.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              onClick={() => onSelectBook(book)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{book.cover}</div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(book.difficulty)}`}>
                      {book.difficulty}
                    </span>
                    <span className="text-2xl">{getCategoryIcon(book.category)}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{book.subtitle}</p>
                <p className="text-xs text-blue-600 font-medium mb-3">{book.level}</p>
                
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{book.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {book.language === 'both' ? (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        EN + SW 🇰🇪
                      </span>
                    ) : book.language === 'sw' ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Kiswahili 🇰🇪
                      </span>
                    ) : (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        English
                      </span>
                    )}
                  </div>
                  
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-md transition-shadow">
                    Start Reading
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more books.</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold">{books.length}</div>
              <div className="text-blue-100">Total Books</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{books.filter(b => b.category === 'story').length}</div>
              <div className="text-blue-100">Stories & Tales</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{books.filter(b => b.language === 'sw' || b.language === 'both').length}</div>
              <div className="text-blue-100">Kiswahili Books</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
