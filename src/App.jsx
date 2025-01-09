import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LogIn, UserPlus, LogOut } from 'lucide-react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 p-4 glass-morphism m-4 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold text-white hover:text-blue-300 transition-colors">
          Smart Thermostat
        </Link>
        <div className="flex gap-4">
          {user ? (
            <button 
              onClick={logout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white transition-all px-4 py-2 rounded-lg"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          ) : (
            <>
              <Link 
                to="/login" 
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white transition-all px-4 py-2 rounded-lg"
              >
                <LogIn size={20} />
                <span>Login</span>
              </Link>
              <Link 
                to="/signup" 
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white transition-all px-4 py-2 rounded-lg"
              >
                <UserPlus size={20} />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen w-full bg-gray-900">
          <Navigation />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;