import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors()); // Allow cross-origin requests

// Mock Database
const users = [
  // Example user
  { id: 1, username: 'admin', password: 'password' }
];
const thermostat = { currentTemperature: 72, targetTemperature: 70 }; // Initialized thermostat

const zones = [
  // Example zones
  { id: 1, name: 'Living Room', thermostat: { currentTemperature: 72, targetTemperature: 70 } },
  { id: 2, name: 'Bedroom', thermostat: { currentTemperature: 68, targetTemperature: 65 } }
];

// Routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    res.status(200).json({ message: 'Login successful', userId: user.id, token: 'mock-token' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/logout', (req, res) => {
  // Logout logic
  res.status(200).json({ message: 'Logout successful' });
});

app.get('/api/thermostat', (req, res) => {
  // Fetch main thermostat data
  res.status(200).json(thermostat);
});

app.put('/api/thermostat', (req, res) => {
  // Update main thermostat data
  const { temperature } = req.body;
  if (typeof temperature !== 'number') {
    return res.status(400).json({ message: 'Invalid temperature value.' });
  }
  thermostat.targetTemperature = temperature;
  res.status(200).json({ message: 'Thermostat updated', thermostat });
});

// Zones Routes

// Get all zones
app.get('/api/zones', (req, res) => {
  res.status(200).json(zones);
});

// Add a new zone
app.post('/api/zones', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Zone name is required.' });
  }
  const newZone = { id: zones.length + 1, name, thermostat: { currentTemperature: 70, targetTemperature: 68 } };
  zones.push(newZone);
  res.status(201).json({ message: 'Zone added', zone: newZone });
});

// Update a zone
app.put('/api/zones/:id', (req, res) => {
  const zoneId = parseInt(req.params.id, 10);
  const { name, targetTemperature } = req.body;
  const zone = zones.find(z => z.id === zoneId);
  if (zone) {
    if (name) zone.name = name;
    if (typeof targetTemperature === 'number') zone.thermostat.targetTemperature = targetTemperature;
    res.status(200).json({ message: 'Zone updated', zone });
  } else {
    res.status(404).json({ message: 'Zone not found' });
  }
});

// Delete a zone
app.delete('/api/zones/:id', (req, res) => {
  const zoneId = parseInt(req.params.id, 10);
  const index = zones.findIndex(z => z.id === zoneId);
  if (index !== -1) {
    zones.splice(index, 1);
    res.status(200).json({ message: 'Zone deleted' });
  } else {
    res.status(404).json({ message: 'Zone not found' });
  }
});

// Start Server
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
