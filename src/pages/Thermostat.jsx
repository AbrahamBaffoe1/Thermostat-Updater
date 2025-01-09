import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

const Thermostat = () => {
  const [temperature, setTemperature] = useState(20)
  const [mode, setMode] = useState('heat') // 'heat' or 'cool'

  const handleIncrement = () => {
    setTemperature(prev => Math.min(prev + 0.5, 30))
  }

  const handleDecrement = () => {
    setTemperature(prev => Math.max(prev - 0.5, 15))
  }

  const toggleMode = () => {
    setMode(prev => prev === 'heat' ? 'cool' : 'heat')
  }

  // Get temperature color based on value and mode
  const getTemperatureColor = () => {
    if (mode === 'heat') {
      return temperature >= 24 ? 'text-red-400' : 'text-orange-400'
    }
    return temperature <= 20 ? 'text-blue-400' : 'text-blue-300'
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Mode Toggle */}
      <button 
        onClick={toggleMode}
        className={`mb-6 px-6 py-2 rounded-full text-white transition-all ${
          mode === 'heat' 
            ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' 
            : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
        }`}
      >
        Mode: {mode === 'heat' ? 'Heat' : 'Cool'}
      </button>

      {/* Temperature Display */}
      <div className="text-7xl font-bold mb-8">
        <span className={`${getTemperatureColor()} transition-colors`}>
          {temperature.toFixed(1)}°C
        </span>
      </div>

      {/* Temperature Controls */}
      <div className="flex flex-col gap-4">
        <button
          onClick={handleIncrement}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm"
          aria-label="Increase temperature"
        >
          <ChevronUp size={32} className="text-white" />
        </button>
        
        <button
          onClick={handleDecrement}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm"
          aria-label="Decrease temperature"
        >
          <ChevronDown size={32} className="text-white" />
        </button>
      </div>
    </div>
  )
}

export default Thermostat