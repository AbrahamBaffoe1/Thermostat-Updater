const { Thermostat, User } = require('../models');
const { Op } = require('sequelize');

// Helper function to validate temperature
const isValidTemperature = (temp, min = 0, max = 40) => {
  return typeof temp === 'number' && temp >= min && temp <= max;
};

// Helper to calculate energy usage
const calculateEnergyUsage = (currentTemp, targetTemp, mode) => {
  if (mode === 'off') return 0;
  const tempDiff = Math.abs(currentTemp - targetTemp);
  // Basic energy calculation - could be made more sophisticated
  return mode === 'heat' ? tempDiff * 1.2 : tempDiff;
};

const thermostatController = {
  // Create a new thermostat
  async create(req, res) {
    try {
      const { name, zone, target_temperature, mode } = req.body;
      const thermostat = await Thermostat.create({
        name,
        zone,
        target_temperature,
        mode,
        user_id: req.user.id,
      });
      res.status(201).json(thermostat);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all thermostats for a user
  async getAllForUser(req, res) {
    try {
      const thermostats = await Thermostat.findAll({
        where: { user_id: req.user.id },
        order: [['created_at', 'DESC']],
      });
      res.json(thermostats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get a specific thermostat
  async getOne(req, res) {
    try {
      const thermostat = await Thermostat.findOne({
        where: {
          id: req.params.id,
          user_id: req.user.id,
        },
      });
      if (!thermostat) {
        return res.status(404).json({ error: 'Thermostat not found' });
      }
      res.json(thermostat);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update thermostat settings
  async update(req, res) {
    try {
      const { target_temperature, mode, name, zone } = req.body;
      const thermostat = await Thermostat.findOne({
        where: {
          id: req.params.id,
          user_id: req.user.id,
        },
      });

      if (!thermostat) {
        return res.status(404).json({ error: 'Thermostat not found' });
      }

      // Validate temperature if provided
      if (target_temperature !== undefined) {
        if (!isValidTemperature(target_temperature, 15, 30)) {
          return res.status(400).json({ error: 'Invalid temperature' });
        }
      }

      // Update fields
      const updates = {};
      if (target_temperature !== undefined) updates.target_temperature = target_temperature;
      if (mode !== undefined) updates.mode = mode;
      if (name !== undefined) updates.name = name;
      if (zone !== undefined) updates.zone = zone;

      await thermostat.update(updates);
      res.json(thermostat);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Set temperature schedule
  async setSchedule(req, res) {
    try {
      const { schedule } = req.body;
      const thermostat = await Thermostat.findOne({
        where: {
          id: req.params.id,
          user_id: req.user.id,
        },
      });

      if (!thermostat) {
        return res.status(404).json({ error: 'Thermostat not found' });
      }

      // Validate schedule format
      if (!Array.isArray(schedule)) {
        return res.status(400).json({ error: 'Invalid schedule format' });
      }

      // Validate each schedule entry
      for (const entry of schedule) {
        if (!entry.time || !entry.temperature || !entry.days) {
          return res.status(400).json({ error: 'Invalid schedule entry' });
        }
        if (!isValidTemperature(entry.temperature, 15, 30)) {
          return res.status(400).json({ error: 'Invalid temperature in schedule' });
        }
      }

      await thermostat.update({ schedule });
      res.json(thermostat);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get temperature history
  async getHistory(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const thermostat = await Thermostat.findOne({
        where: {
          id: req.params.id,
          user_id: req.user.id,
        },
      });

      if (!thermostat) {
        return res.status(404).json({ error: 'Thermostat not found' });
      }

      // This would typically query a separate temperature_history table
      // For now, we'll return a simulated history
      const history = {
        temperatures: [],
        energy_usage: [],
        timestamp: new Date(),
      };

      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get energy usage analytics
  async getAnalytics(req, res) {
    try {
      const thermostat = await Thermostat.findOne({
        where: {
          id: req.params.id,
          user_id: req.user.id,
        },
      });

      if (!thermostat) {
        return res.status(404).json({ error: 'Thermostat not found' });
      }

      // Calculate current energy usage
      const currentUsage = calculateEnergyUsage(
        thermostat.current_temperature,
        thermostat.target_temperature,
        thermostat.mode
      );

      // In a real application, this would query historical data
      const analytics = {
        current_usage: currentUsage,
        daily_average: currentUsage * 24,
        weekly_usage: currentUsage * 24 * 7,
        monthly_usage: currentUsage * 24 * 30,
        efficiency_score: Math.round((1 - currentUsage / 10) * 100),
        timestamp: new Date(),
      };

      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get zones summary
  async getZonesSummary(req, res) {
    try {
      const zones = await Thermostat.findAll({
        where: { user_id: req.user.id },
        attributes: [
          'zone',
          [sequelize.fn('AVG', sequelize.col('current_temperature')), 'avg_temperature'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'device_count'],
        ],
        group: ['zone'],
      });

      res.json(zones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete a thermostat
  async delete(req, res) {
    try {
      const result = await Thermostat.destroy({
        where: {
          id: req.params.id,
          user_id: req.user.id,
        },
      });

      if (!result) {
        return res.status(404).json({ error: 'Thermostat not found' });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = thermostatController;
