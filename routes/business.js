const express = require('express');
const router = express.Router();
const business = require('../data/business');
const { ensureAuthenticated, ensureBusiness } = require('../middleware/authMiddleware');

// 商家资料
router.get('/profile', 
  ensureAuthenticated, 
  ensureBusiness, 
  businessController.getProfile
);

// 商家日程（增强版）
router.route('/schedule')
  .get(ensureAuthenticated, ensureBusiness, businessController.getSchedule) // 查看日程
  .post(ensureAuthenticated, ensureBusiness, businessController.addScheduleItem) // 添加日程项
  .delete(ensureAuthenticated, ensureBusiness, businessController.removeScheduleItem); // 删除日程项

// 商家事件管理
router.get('/schedule/events', 
  ensureAuthenticated, 
  ensureBusiness, 
  businessController.getHostedEvents
);

module.exports = router;