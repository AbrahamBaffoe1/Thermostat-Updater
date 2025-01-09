import express from 'express';
const router = express.Router();

// Placeholder route
router.get('/status', (req, res) => {
  res.json({ temperature: 22, mode: 'cooling' });
});

export default router;