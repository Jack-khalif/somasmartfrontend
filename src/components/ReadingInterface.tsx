import { useState, useEffect, useRef } from 'react'

interface ReadingSettings {
  fontSize: number
  fontFamily: string
  lineHeight: number
  backgroundColor: string
  textColor: string
  highlightColor: string
  speechRate: number
  speechPitch: number
}

export default function ReadingInterface() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1)
  const [progress, setProgress] = useState(0)
  const [settings, setSettings] = useState<ReadingSettings>({
    fontSize: 18,
    fontFamily: 'OpenDyslexic, Arial, sans-serif',
    lineHeight: 1.8,
    backgroundColor: '#fef7e0',
    textColor: '#2d3748',
    highlightColor: '#fbbf24',
    speechRate: 0.8,
    speechPitch: 1.0
  })

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)
  const textRef = useRef<HTMLDivElement>(null)

  // Sample story content - in production, this would come from your backend
  const storyContent = {
    title: "The Clever Hare and the Tortoise",
    subtitle: "A Kenyan Folk Tale",
    paragraphs: [
      "Once upon a time, in the beautiful hills of Kenya, there lived a very fast hare and a slow but wise tortoise.",
      "The hare was always boasting about how fast he could run. 'I am the fastest animal in all of Kenya!' he would say to anyone who would listen.",
      "One sunny morning, the tortoise got tired of hearing the hare's boasts. 'Friend Hare,' said the tortoise calmly, 'would you like to race with me?'",
      "The hare laughed so hard that he rolled on the ground. 'You want to race ME?' he giggled. 'This will be the easiest race I've ever won!'",
      "All the animals of the forest gathered to watch the great race. The wise old elephant was chosen as the judge.",
      "'Ready, set, GO!' trumpeted the elephant. The hare shot forward like lightning, while the tortoise began his slow, steady journey.",
      "The hare was so far ahead that he decided to take a nap under a big baobab tree. 'I have plenty of time,' he thought sleepily.",
      "Meanwhile, the tortoise kept moving forward, step by step, never stopping, never giving up.",
      "When the hare woke up, he saw the tortoise crossing the finish line! All the animals cheered for the tortoise.",
      "From that day on, the hare learned that being steady and determined is more important than being fast."
    ]
  }

  // Split text into words for highlighting
  const getAllWords = () => {
    return storyContent.paragraphs.flatMap((paragraph, pIndex) => 
      paragraph.split(' ').map((word, wIndex) => ({
        word: word.replace(/[.,!?]/g, ''),
        punctuation: word.match(/[.,!?]/)?.[0] || '',
        paragraphIndex: pIndex,
        wordIndex: wIndex,
        globalIndex: storyContent.paragraphs.slice(0, pIndex).reduce((acc, p) => acc + p.split(' ').length, 0) + wIndex
      }))
    )
  }

  const allWords = getAllWords()

  const startReading = () => {
    if ('speechSynthesis' in window) {
      const text = storyContent.paragraphs.join(' ')
      const utterance = new SpeechSynthesisUtterance(text)
      
      utterance.rate = settings.speechRate
      utterance.pitch = settings.speechPitch
      utterance.volume = 1

      let wordIndex = 0
      const words = text.split(' ')

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          setCurrentWordIndex(wordIndex)
          setProgress((wordIndex / words.length) * 100)
          wordIndex++
        }
      }

      utterance.onend = () => {
        setIsPlaying(false)
        setIsPaused(false)
        setCurrentWordIndex(-1)
        setProgress(100)
      }

      speechRef.current = utterance
      speechSynthesis.speak(utterance)
      setIsPlaying(true)
      setIsPaused(false)
    }
  }

  const pauseReading = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause()
      setIsPaused(true)
    }
  }

  const resumeReading = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume()
      setIsPaused(false)
    }
  }

  const stopReading = () => {
    speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
    setCurrentWordIndex(-1)
    setProgress(0)
  }

  const adjustFontSize = (increment: number) => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.max(12, Math.min(32, prev.fontSize + increment))
    }))
  }

  const changeColorTheme = (theme: string) => {
    const themes = {
      cream: { backgroundColor: '#fef7e0', textColor: '#2d3748', highlightColor: '#fbbf24' },
      blue: { backgroundColor: '#e0f2fe', textColor: '#1e3a8a', highlightColor: '#3b82f6' },
      green: { backgroundColor: '#f0fdf4', textColor: '#166534', highlightColor: '#22c55e' },
      dark: { backgroundColor: '#1f2937', textColor: '#f9fafb', highlightColor: '#fbbf24' }
    }
    
    if (themes[theme as keyof typeof themes]) {
      setSettings(prev => ({ ...prev, ...themes[theme as keyof typeof themes] }))
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: settings.backgroundColor }}>
      {/* Header Controls */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Reading Controls */}
          <div className="flex items-center space-x-3">
            {!isPlaying ? (
              <button
                onClick={startReading}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full flex items-center space-x-2 transition-colors"
              >
                <span>▶️</span>
                <span>Start Reading</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                {!isPaused ? (
                  <button
                    onClick={pauseReading}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-colors"
                  >
                    <span>⏸️</span>
                    <span>Pause</span>
                  </button>
                ) : (
                  <button
                    onClick={resumeReading}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-colors"
                  >
                    <span>▶️</span>
                    <span>Resume</span>
                  </button>
                )}
                <button
                  onClick={stopReading}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-colors"
                >
                  <span>⏹️</span>
                  <span>Stop</span>
                </button>
              </div>
            )}
          </div>

          {/* Font Size Controls */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Font Size:</span>
            <button
              onClick={() => adjustFontSize(-2)}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition-colors"
            >
              A-
            </button>
            <span className="text-sm font-medium px-2">{settings.fontSize}px</span>
            <button
              onClick={() => adjustFontSize(2)}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition-colors"
            >
              A+
            </button>
          </div>

          {/* Color Theme Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Theme:</span>
            <div className="flex space-x-1">
              {[
                { name: 'cream', color: '#fef7e0' },
                { name: 'blue', color: '#e0f2fe' },
                { name: 'green', color: '#f0fdf4' },
                { name: 'dark', color: '#1f2937' }
              ].map(theme => (
                <button
                  key={theme.name}
                  onClick={() => changeColorTheme(theme.name)}
                  className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors"
                  style={{ backgroundColor: theme.color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="max-w-4xl mx-auto mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1 text-center">
              Reading Progress: {Math.round(progress)}%
            </div>
          </div>
        )}
      </div>

      {/* Reading Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ 
              color: settings.textColor,
              fontSize: `${settings.fontSize + 8}px`,
              fontFamily: settings.fontFamily 
            }}
          >
            {storyContent.title}
          </h1>
          <p 
            className="text-lg opacity-75"
            style={{ 
              color: settings.textColor,
              fontSize: `${settings.fontSize + 2}px`,
              fontFamily: settings.fontFamily 
            }}
          >
            {storyContent.subtitle}
          </p>
        </div>

        <div ref={textRef} className="space-y-6">
          {storyContent.paragraphs.map((paragraph, pIndex) => (
            <p
              key={pIndex}
              style={{
                fontSize: `${settings.fontSize}px`,
                fontFamily: settings.fontFamily,
                lineHeight: settings.lineHeight,
                color: settings.textColor
              }}
              className="leading-relaxed"
            >
              {paragraph.split(' ').map((word, wIndex) => {
                const globalIndex = storyContent.paragraphs.slice(0, pIndex).reduce((acc, p) => acc + p.split(' ').length, 0) + wIndex
                const isCurrentWord = globalIndex === currentWordIndex
                const cleanWord = word.replace(/[.,!?]/g, '')
                const punctuation = word.match(/[.,!?]/)?.[0] || ''
                
                return (
                  <span key={wIndex}>
                    <span
                      className={`transition-all duration-200 ${isCurrentWord ? 'font-bold' : ''}`}
                      style={{
                        backgroundColor: isCurrentWord ? settings.highlightColor : 'transparent',
                        padding: isCurrentWord ? '2px 4px' : '0',
                        borderRadius: isCurrentWord ? '4px' : '0'
                      }}
                    >
                      {cleanWord}
                    </span>
                    {punctuation}
                    {wIndex < paragraph.split(' ').length - 1 ? ' ' : ''}
                  </span>
                )
              })}
            </p>
          ))}
        </div>

        {/* Reading Tips */}
        <div className="mt-12 p-6 bg-blue-50 rounded-xl">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">📚 Reading Tips</h3>
          <ul className="text-blue-700 space-y-2 text-sm">
            <li>• Use the play button to hear the story read aloud</li>
            <li>• Watch the highlighted words as they're being read</li>
            <li>• Adjust font size and colors to what feels comfortable</li>
            <li>• Take breaks whenever you need them</li>
            <li>• Try reading along with the voice for practice</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
