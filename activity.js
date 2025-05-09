const BadgeService = require('../services/badgeService');
const User = require('../models/User');

// 跟踪登录（Active Star 和 New Hat）
const trackLogin = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) return next();

    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    await BadgeService.checkAndAwardBadges(user, 'login');
    next();
  } catch (error) {
    next(error);
  }
};

// 跟踪加群（New Star 和 Hard-Working Star）
const trackGroupJoin = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) return next();

    user.groupJoinCount = (user.groupJoinCount || 0) + 1;
    await user.save();

    await BadgeService.checkAndAwardBadges(user, 'groupJoin');
    next();
  } catch (error) {
    next(error);
  }
};

// 跟踪评分（Social King）
const trackRating = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) return next();

    user.ratingCount = (user.ratingCount || 0) + 1;
    await user.save();

    await BadgeService.checkAndAwardBadges(user, 'rating');
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { trackLogin, trackGroupJoin, trackRating };