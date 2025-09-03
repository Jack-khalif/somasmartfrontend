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
  selectedVoice: string
}

export default function ReadingInterface() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1)
  const [progress, setProgress] = useState(0)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'sw'>('en')
  const [settings, setSettings] = useState<ReadingSettings>({
    fontSize: 18,
    fontFamily: 'OpenDyslexic, Arial, sans-serif',
    lineHeight: 1.8,
    backgroundColor: '#fef7e0',
    textColor: '#2d3748',
    highlightColor: '#fbbf24',
    speechRate: 0.8,
    speechPitch: 1.0,
    selectedVoice: ''
  })

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)
  const textRef = useRef<HTMLDivElement>(null)

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices()
      setAvailableVoices(voices)
      
      // Try to find a good default voice (Kiswahili first, then British English, South African, etc.)
      const preferredVoices = voices.filter(voice => 
        voice.lang.includes('sw') || // Kiswahili
        voice.lang.includes('en-GB') || // British English
        voice.lang.includes('en-ZA') || // South African English
        voice.lang.includes('en-AU') || // Australian English
        voice.lang.includes('en-') // Any English
      )
      
      if (preferredVoices.length > 0 && !settings.selectedVoice) {
        setSettings(prev => ({ ...prev, selectedVoice: preferredVoices[0].name }))
      }
    }

    loadVoices()
    speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  // Sample story content - in production, this would come from your backend
  const storyContent = {
    en: {
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
    },
    sw: {
      title: "Sungura Mjanja na Kobe",
      subtitle: "Hadithi ya Kiafrika",
      paragraphs: [
        "Hapo zamani, katika milima mizuri ya Kenya, kuliishi sungura mwepesi sana na kobe mwenye busara lakini mpolepole.",
        "Sungura alikuwa akijivunia kila wakati jinsi alivyoweza kukimbia kwa haraka. 'Mimi ni mnyama mwepesi zaidi katika Kenya yote!' alikuwa akisema kwa yeyote aliyetaka kusikiliza.",
        "Asubuhi moja ya jua, kobe alichoka kusikia majivuno ya sungura. 'Rafiki Sungura,' alisema kobe kwa utulivu, 'ungependa kushindana nami?'",
        "Sungura alicheka sana hata akajiviringisha chini. 'Unataka kushindana nami?' alicheka. 'Hii itakuwa mbio rahisi zaidi nilizoshinda!'",
        "Wanyamapori wote wa msituni walikusanyika kuona mbio kuu. Tembo mzee mwenye busara alichaguliwa kuwa jaji.",
        "'Tayari, weka, NENDA!' alipiga kelele tembo. Sungura aliruka mbele kama umeme, wakati kobe alianza safari yake ya polepole na ya kudumu.",
        "Sungura alikuwa mbele sana hivi kwamba aliamua kulala chini ya mti mkubwa wa mbuyu. 'Nina wakati mwingi,' alifikiri akisinzia.",
        "Wakati huo huo, kobe aliendelea kusonga mbele, hatua kwa hatua, bila kusimama, bila kukata tamaa.",
        "Sungura alipozinduka, alimwona kobe akivuka mstari wa mwisho! Wanyamapori wote walimpongeza kobe.",
        "Tangu siku hiyo, sungura alijifunza kwamba kuwa na uvumilivu na kujitolea ni muhimu zaidi kuliko kuwa mwepesi."
      ]
    }
  }

  // Get current story based on language
  const currentStory = storyContent[currentLanguage]

  // Split text into words for highlighting
  const getAllWords = () => {
    return currentStory.paragraphs.flatMap((paragraph: string, pIndex: number) => 
      paragraph.split(' ').map((word: string, wIndex: number) => ({
        word: word.replace(/[.,!?]/g, ''),
        punctuation: word.match(/[.,!?]/)?.[0] || '',
        paragraphIndex: pIndex,
        wordIndex: wIndex,
        globalIndex: currentStory.paragraphs.slice(0, pIndex).reduce((acc: number, p: string) => acc + p.split(' ').length, 0) + wIndex
      }))
    )
  }

  const allWords = getAllWords()

  const startReading = () => {
    if ('speechSynthesis' in window) {
      const text = currentStory.paragraphs.join(' ')
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Set voice if selected
      if (settings.selectedVoice) {
        const selectedVoice = availableVoices.find(voice => voice.name === settings.selectedVoice)
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }
      }
      
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

          {/* Language Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Language:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentLanguage('en')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  currentLanguage === 'en' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setCurrentLanguage('sw')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  currentLanguage === 'sw' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Kiswahili 🇰🇪
              </button>
            </div>
          </div>

          {/* Voice Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Voice:</span>
            <select
              value={settings.selectedVoice}
              onChange={(e) => setSettings(prev => ({ ...prev, selectedVoice: e.target.value }))}
              className="text-sm border border-gray-300 rounded px-2 py-1 max-w-40"
            >
              <option value="">Default</option>
              {availableVoices
                .filter(voice => 
                  currentLanguage === 'sw' 
                    ? voice.lang.includes('sw')
                    : voice.lang.includes('en')
                )
                .sort((a, b) => {
                  // Prioritize Kiswahili voices first when sw is selected
                  if (currentLanguage === 'sw' && a.lang.includes('sw') && !b.lang.includes('sw')) return -1;
                  if (currentLanguage === 'sw' && !a.lang.includes('sw') && b.lang.includes('sw')) return 1;
                  return a.name.localeCompare(b.name);
                })
                .map(voice => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang}) {voice.lang.includes('sw') ? '🇰🇪' : ''}
                  </option>
                ))}
            </select>
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
            {currentStory.title}
          </h1>
          <p 
            className="text-lg opacity-75"
            style={{ 
              color: settings.textColor,
              fontSize: `${settings.fontSize + 2}px`,
              fontFamily: settings.fontFamily 
            }}
          >
            {currentStory.subtitle}
          </p>
        </div>

        <div ref={textRef} className="space-y-6">
          {currentStory.paragraphs.map((paragraph, pIndex) => (
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
              {paragraph.split(' ').map((word: string, wIndex: number) => {
                const globalIndex = currentStory.paragraphs.slice(0, pIndex).reduce((acc: number, p: string) => acc + p.split(' ').length, 0) + wIndex
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
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Reading Tips</h3>
          <ul className="text-blue-700 space-y-2 text-sm">
            <li>• Choose between English and Kiswahili stories</li>
            <li>• Use the play button to hear the story read aloud</li>
            <li>• Choose a voice that sounds comfortable to you</li>
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
