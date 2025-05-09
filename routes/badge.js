const express = require('express');
const router = express.Router();
const Badge = require('../models/Badge');
const { isAdmin } = require('../middleware/auth');

// 创建徽章（管理员）
router.post('/create', isAdmin, async (req, res) => {
  const { name, description, icon, condition } = req.body;
  try {
    const badge = new Badge({ name, description, icon, condition });
    await badge.save();
    res.status(201).json({ message: 'Badge created', badge });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取所有徽章
router.get('/', async (req, res) => {
  try {
    const badges = await Badge.find();
    res.json(badges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;