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

interface ReadingPageProps {
  book: Book
  user: { name: string; email: string }
  onBackToLibrary: () => void
}

export default function ReadingPage({ book, user, onBackToLibrary }: ReadingPageProps) {
  const [fontSize, setFontSize] = useState(16)
  const [isPlaying, setIsPlaying] = useState(false)
  const [highlightColor, setHighlightColor] = useState('yellow')

  // Sample content - in production, this would come from your backend
  const sampleContent = book.category === 'story' 
    ? `Once upon a time, in the beautiful hills of Kenya, there lived a clever hare named Sungura. 

Sungura was known throughout the forest for his quick thinking and kind heart. One sunny morning, he decided to visit his friend, the wise old tortoise named Kobe.

"Jambo, Kobe!" called Sungura as he approached the tortoise's home under the big baobab tree.

"Jambo, my friend," replied Kobe slowly. "What brings you here so early?"

Sungura explained that he had heard about a great race that was to take place the next day. All the animals in the forest were invited to participate.

"I think I should enter," said Sungura confidently. "With my speed, I'm sure to win!"

Kobe smiled wisely. "Speed is important, my friend, but remember - slow and steady often wins the race."

The next day, animals from all over the forest gathered at the starting line. The race would go from the big baobab tree to the river and back.

"Ready, set, go!" called the elephant referee.

Sungura shot forward like lightning, leaving all the other animals far behind. He was so far ahead that he decided to take a nap under a shady tree.

Meanwhile, Kobe continued moving forward, one slow step at a time. He passed the sleeping hare and kept going steadily toward the finish line.

When Sungura woke up, he saw Kobe crossing the finish line!

"Congratulations, Kobe!" said Sungura, learning an important lesson about perseverance.`
    : book.category === 'textbook'
    ? `Chapter 1: Basic English Words

Welcome to your English learning journey! In this chapter, we will learn common words that we use every day.

Family Words:
- Mother (Mama)
- Father (Baba) 
- Sister (Dada)
- Brother (Kaka)

Colors:
- Red (Nyekundu)
- Blue (Buluu)
- Green (Kijani)
- Yellow (Njano)

Animals:
- Cat (Paka)
- Dog (Mbwa)
- Bird (Ndege)
- Fish (Samaki)

Practice Exercise:
1. Point to something red in your room
2. Say "Hello" to your family members
3. Name three animals you can see outside

Remember: Practice makes perfect! The more you read and speak, the better you become.`
    : `Word Puzzle Challenge!

Can you solve these fun word puzzles?

Rhyming Words:
Find words that rhyme with "cat":
- h_t (something you wear)
- b_t (flying animal)
- r_t (small animal)

Complete the Story:
The little _____ (animal) went to the _____ (place) to find some _____ (food).

Word Scramble:
Unscramble these Kenyan animal names:
- NOIL (big cat)
- PHANT ELE (big gray animal)  
- FIRAFFE G (tall animal)

Answers:
Rhyming: hat, bat, rat
Scramble: LION, ELEPHANT, GIRAFFE`

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(sampleContent)
      utterance.rate = 0.8
      utterance.pitch = 1
      
      if (book.language === 'sw') {
        utterance.lang = 'sw-KE'
      } else {
        utterance.lang = 'en-US'
      }
      
      if (isPlaying) {
        speechSynthesis.cancel()
        setIsPlaying(false)
      } else {
        speechSynthesis.speak(utterance)
        setIsPlaying(true)
        
        utterance.onend = () => setIsPlaying(false)
      }
    } else {
      alert('Text-to-speech is not supported in your browser')
    }
  }

  const getHighlightClass = () => {
    switch (highlightColor) {
      case 'yellow': return 'bg-yellow-200'
      case 'blue': return 'bg-blue-200'
      case 'green': return 'bg-green-200'
      case 'pink': return 'bg-pink-200'
      default: return 'bg-yellow-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToLibrary}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span className="text-xl">←</span>
                <span>Back to Library</span>
              </button>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{book.cover}</div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{book.title}</h1>
                  <p className="text-sm text-gray-600">{book.subtitle}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Reading as:</span>
              <span className="font-medium text-blue-600">{user.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Reading Controls */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Reading Tools</h2>
          
          <div className="grid md:grid-cols-4 gap-4">
            {/* Text-to-Speech */}
            <button
              onClick={handleTextToSpeech}
              className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                isPlaying 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <span className="text-lg">{isPlaying ? '⏹️' : '🔊'}</span>
              <span>{isPlaying ? 'Stop' : 'Listen'}</span>
            </button>

            {/* Font Size */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Size:</span>
              <button
                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300"
              >
                -
              </button>
              <span className="text-sm font-medium w-8 text-center">{fontSize}</span>
              <button
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300"
              >
                +
              </button>
            </div>

            {/* Highlight Color */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Highlight:</span>
              <div className="flex space-x-1">
                {['yellow', 'blue', 'green', 'pink'].map(color => (
                  <button
                    key={color}
                    onClick={() => setHighlightColor(color)}
                    className={`w-6 h-6 rounded-full border-2 ${
                      color === 'yellow' ? 'bg-yellow-200' :
                      color === 'blue' ? 'bg-blue-200' :
                      color === 'green' ? 'bg-green-200' : 'bg-pink-200'
                    } ${highlightColor === color ? 'border-gray-800' : 'border-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Progress:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <span className="text-sm font-medium text-green-600">25%</span>
            </div>
          </div>
        </div>

        {/* Reading Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div 
            className={`prose max-w-none leading-relaxed ${getHighlightClass()} p-6 rounded-lg`}
            style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
          >
            {sampleContent.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Reading Stats */}
        <div className="mt-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold">5 min</div>
              <div className="text-green-100">Reading Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold">250</div>
              <div className="text-green-100">Words Read</div>
            </div>
            <div>
              <div className="text-2xl font-bold">⭐⭐⭐</div>
              <div className="text-green-100">Great Job!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
