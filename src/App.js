import React from 'react';
import useThermostatStore from './stores/useThermostatStore';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App = () => {
  const user = useThermostatStore((state) => state.user);

  return <div>{user ? <Dashboard /> : <Login />}</div>;
};

export default App;
