import React, { useState, useEffect } from 'react';
import useThermostatStore from '../stores/useThermostatStore';

const Dashboard = () => {
  const thermostat = useThermostatStore((state) => state.thermostat);
  const setThermostat = useThermostatStore((state) => state.setThermostat);
  const setUser = useThermostatStore((state) => state.setUser);
  const [newTargetTemp, setNewTargetTemp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThermostat = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/thermostat');
        if (response.ok) {
          const data = await response.json();
          setThermostat(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch thermostat data.');
        }
      } catch (err) {
        console.error('Error fetching thermostat data:', err);
        setError('An error occurred while fetching thermostat data.');
      } finally {
        setLoading(false);
      }
    };

    fetchThermostat();
  }, [setThermostat]);

  const updateTemperature = async () => {
    if (newTargetTemp === '') {
      alert('Please enter a target temperature.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/thermostat', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ temperature: parseFloat(newTargetTemp) }),
      });

      if (response.ok) {
        const updatedThermostat = await response.json();
        setThermostat(updatedThermostat);
        alert(`Target temperature set to ${newTargetTemp}°F`);
        setNewTargetTemp('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update temperature.');
      }
    } catch (err) {
      console.error('Error updating temperature:', err);
      setError('An error occurred while updating temperature.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });

      if (response.ok) {
        setUser(null);
        alert('Logged out successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to logout.');
      }
    } catch (err) {
      console.error('Error during logout:', err);
      setError('An error occurred during logout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Thermostat Dashboard</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {thermostat ? (
        <>
          <p>Current Temperature: {thermostat.currentTemperature}°F</p>
          <p>Target Temperature: {thermostat.targetTemperature}°F</p>
          <input
            type="number"
            placeholder="Set Target Temperature"
            value={newTargetTemp}
            onChange={(e) => setNewTargetTemp(e.target.value)}
          />
          <button onClick={updateTemperature} disabled={loading}>
            {loading ? 'Updating...' : 'Update Temperature'}
          </button>
          <button onClick={handleLogout} disabled={loading} style={{ marginLeft: '10px' }}>
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </>
      ) : (
        <p>Loading thermostat data...</p>
      )}
    </div>
  );
};

export default Dashboard;
