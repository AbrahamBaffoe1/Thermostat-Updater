import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useThermostatStore from '../stores/useThermostatStore';
import Thermostat from '../components/Thermostat';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const thermostat = useThermostatStore((state) => state.thermostat);
  const setThermostat = useThermostatStore((state) => state.setThermostat);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchThermostat = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/thermostat', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setThermostat(data);
        } else {
          throw new Error('Failed to fetch thermostat data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchThermostat();
  }, [user, navigate, setThermostat]);

  if (!user) return null;

  return (
    <div className="min-h-screen w-full p-4 pt-24 flex flex-col items-center justify-center">
      <div className="bg-gray-800/50 backdrop-blur-lg p-8 max-w-md w-full mx-auto rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-8 text-white">Temperature Control</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : (
          <Thermostat 
            thermostat={thermostat} 
            setThermostat={setThermostat}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;