const express = require('express');
const auth = require('../middleware/auth');
const thermostatController = require('../controllers/thermostat');

const router = express.Router();

// Base CRUD routes
router.post('/', auth, thermostatController.create);
router.get('/', auth, thermostatController.getAllForUser);
router.get('/:id', auth, thermostatController.getOne);
router.put('/:id', auth, thermostatController.update);
router.delete('/:id', auth, thermostatController.delete);

// Schedule management
router.post('/:id/schedule', auth, thermostatController.setSchedule);

// Analytics and monitoring
router.get('/:id/history', auth, thermostatController.getHistory);
router.get('/:id/analytics', auth, thermostatController.getAnalytics);

// Zone management
router.get('/zones/summary', auth, thermostatController.getZonesSummary);

// Backward compatibility for existing frontend
router.get('/:id/status', auth, async (req, res) => {
  try {
    const thermostat = await thermostatController.getOne(req, res);
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

// Specialized mode update endpoint (kept for backward compatibility)
router.put('/:id/mode', auth, async (req, res) => {
  try {
    const { mode } = req.body;
    
    // Set default temperatures based on mode
    let target_temperature;
    if (mode === 'heat') {
      target_temperature = 22;
    } else if (mode === 'cool') {
      target_temperature = 18;
    }

    // Use the controller's update method
    req.body = { mode, target_temperature };
    return thermostatController.update(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
