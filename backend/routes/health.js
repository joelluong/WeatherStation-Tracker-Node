const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
    // #swagger.tags = ['Health']
    // #swagger.summary = 'Health check endpoint'
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'backend-api',
    uptime: process.uptime()
  });
});

module.exports = router;