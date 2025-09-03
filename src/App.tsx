import FloatingDockDemo from './components/floating-dock-demo'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            SomaSmart Frontend
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
            Dyslexia-friendly reading platform for Kenyan children
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 italic">
            "Dyslexia is no disorder, dyslexics think differently."
          </p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4 text-center">
            FloatingDock Component Demo
          </h2>
          <FloatingDockDemo />
        </div>
        
        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
          <p>Install missing dependencies to see the full functionality:</p>
          <code className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-xs">
            npm install
          </code>
        </div>
      </div>
    </div>
  )
}

export default App
