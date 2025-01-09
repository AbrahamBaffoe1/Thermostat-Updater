// server/routes/thermostat.js
import express from 'express';
import { Thermostat } from '../models/index.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all thermostats for a user
router.get('/', auth, async (req, res) => {
  try {
    const thermostats = await Thermostat.findAll({ 
      where: { user_id: req.user.userId }
    });
    res.json(thermostats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific thermostat status
router.get('/:id/status', auth, async (req, res) => {
  try {
    const thermostat = await Thermostat.findOne({
      where: { 
        id: req.params.id,
        user_id: req.user.userId 
      }
    });

    if (!thermostat) {
      return res.status(404).json({ message: 'Thermostat not found' });
    }

    res.json({
      id: thermostat.id,
      current_temperature: thermostat.current_temperature,
      target_temperature: thermostat.target_temperature,
      mode: thermostat.mode,
      status: thermostat.is_active ? 'active' : 'inactive'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update thermostat settings
router.put('/:id', auth, async (req, res) => {
  try {
    const { temperature, mode } = req.body;
    const thermostat = await Thermostat.findOne({ 
      where: { 
        id: req.params.id,
        user_id: req.user.userId 
      }
    });

    if (!thermostat) {
      return res.status(404).json({ message: 'Thermostat not found' });
    }

    const updates = {};
    if (temperature !== undefined) {
      updates.target_temperature = temperature;
    }
    if (mode !== undefined) {
      updates.mode = mode;
    }

    await thermostat.update({
      ...updates,
      updated_at: new Date()
    });

    res.json(thermostat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new thermostat
router.post('/', auth, async (req, res) => {
  try {
    const { name, location } = req.body;
    
    const thermostat = await Thermostat.create({
      name,
      location,
      user_id: req.user.userId,
      current_temperature: 20,
      target_temperature: 22,
      mode: 'off',
      is_active: true
    });

    res.status(201).json(thermostat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete thermostat
router.delete('/:id', auth, async (req, res) => {
  try {
    const thermostat = await Thermostat.findOne({
      where: { 
        id: req.params.id,
        user_id: req.user.userId 
      }
    });

    if (!thermostat) {
      return res.status(404).json({ message: 'Thermostat not found' });
    }

    await thermostat.destroy();
    res.json({ message: 'Thermostat deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update mode only
router.put('/:id/mode', auth, async (req, res) => {
  try {
    const { mode } = req.body;
    const thermostat = await Thermostat.findOne({ 
      where: { 
        id: req.params.id,
        user_id: req.user.userId 
      }
    });

    if (!thermostat) {
      return res.status(404).json({ message: 'Thermostat not found' });
    }
    // Set default temperatures based on mode
    let defaultTemp;
    if (mode === 'heat') {
      defaultTemp = 22; // 22°C for heating
    } else if (mode === 'cool') {
      defaultTemp = 18; // 18°C for cooling
    } else {
      defaultTemp = 20; // 20°C for off
    }
    await thermostat.update({
      target_temperature: defaultTemp,
      updated_at: new Date()
    });

    await thermostat.update({
      mode,
      updated_at: new Date()
    });

    res.json(thermostat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;