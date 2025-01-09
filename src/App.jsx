import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { LogIn, UserPlus } from 'lucide-react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full">
        {/* Navigation Header */}
        <nav className="fixed top-0 left-0 right-0 p-4 glass-morphism m-4 z-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-semibold text-white hover:text-blue-300 transition-colors">
              Smart Thermostat
            </Link>
            <div className="flex gap-4">
              <Link 
                to="/login" 
                className="flex items-center gap-2 bg-white hover:bg-white/20 transition-all px-4 py-2 rounded-lg"
              >
                <LogIn size={20} />
                <span>Login</span>
              </Link>
              <Link 
                to="/signup" 
                className="flex items-center gap-2 bg-black hover:bg-white transition-all px-4 py-2 rounded-lg"
              >
                <UserPlus size={20} />
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App