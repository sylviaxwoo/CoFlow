import { Router } from 'express';
const router = Router();
import bcrypt from 'bcrypt';
import * as businessdata from '../data/business.js';
import middleware from '../middleware.js';
import Validation from '../helpers.js';

// 新增会话检查中间件
const ensureBusinessAuth = (req, res, next) => {
  if (req.session.user?.role === 'business') return next();
  res.redirect('/auth/login');
};

// 商业注册路由
router.route('/signup')
  .get(middleware.signupRouteMiddleware, (req, res) => {
    res.render('business-signup', { title: 'Business Sign Up' });
  })
  .post(async (req, res) => {
    try {
      console.log('Business signup request body:', req.body);
      const { company, email, password, userName, phone, description, address, city, state, courses, terms, privacy } = req.body;
      
      // 验证必需字段
      if (!company || !email || !password || !userName || !phone || !description || !address || !city || !state || !terms || !privacy) {
        console.error('Missing required fields:', { company, email, userName, phone, description, address, city, state, terms, privacy });
        return res.status(400).json({ error: 'All required fields must be provided' });
      }

      // 数据验证
      try {
        console.log('Starting validation...');
        Validation.checkString(company, "Company Name");
        Validation.checkEmail(email);
        Validation.checkPassword(password, "Password");
        Validation.checkString(userName, "Username");
        Validation.checkPhone(phone, "Phone");
        Validation.checkString(description, "Description");
        Validation.checkString(address, "Address");
        Validation.checkString(city, "City");
        Validation.checkString(state, "State");
        if (courses) Validation.checkStringArray(courses, "Courses");
        console.log('Validation passed');
      } catch (validationError) {
        console.error('Validation error:', validationError);
        return res.status(400).json({ error: validationError.toString() });
      }

      // 创建商业账户
      try {
        console.log('Creating business account...');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed');
        
        const newBusiness = await businessdata.createBusiness({
          company,
          email,
          password: hashedPassword,
          userName,
          phone,
          description,
          address,
          city,
          state,
          courses: courses || [],
          terms,
          privacy
        });
        console.log('Business account created:', newBusiness);

        // 设置会话
        req.session.user = {
          id: newBusiness._id,
          email: email,
          role: 'business',
          company: company
        };

        // 确保会话保存后重定向
        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            return res.status(500).json({ error: 'Failed to initialize session' });
          }
          console.log('Session saved, redirecting...');
          res.json({ success: true, redirect: '/business/dashboard' });
        });
      } catch (businessError) {
        console.error('Business creation error:', businessError);
        // 确保错误信息是字符串
        const errorMessage = businessError instanceof Error ? 
          businessError.message : 
          String(businessError);
        return res.status(500).json({ error: errorMessage });
      }
    } catch (error) {
      console.error('Registration Error:', error);
      // 确保错误信息是字符串
      const errorMessage = error instanceof Error ? 
        error.message : 
        String(error);
      res.status(500).json({ error: errorMessage });
    }
  });

// 商业资料路由（新增）
router.get('/business-profile', ensureBusinessAuth, async (req, res) => {
  try {
    const business = await businessdata.getBusinessById(req.session.user.id);
    res.render('business-profile', {
      title: 'Business Profile',
      business,
      currentUser: req.session.user
    });
  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Failed to load profile' 
    });
  }
});

// 其他路由...
router.get('/terms', (req, res) => {
  res.render('business-terms', { title: 'Terms of Use' });
});

router.get('/privacy', (req, res) => {
  res.render('business-privacy', { title: 'Privacy Policy' });
});

  

// // 商家资料
// router.get('/profile', 
//   ensureAuthenticated, 
//   ensureBusiness, 
//   businessController.getProfile
// );

// // 商家日程（增强版）
// router.route('/schedule')
//   .get(ensureAuthenticated, ensureBusiness, businessController.getSchedule) // 查看日程
//   .post(ensureAuthenticated, ensureBusiness, businessController.addScheduleItem) // 添加日程项
//   .delete(ensureAuthenticated, ensureBusiness, businessController.removeScheduleItem); // 删除日程项

// // 商家事件管理
// router.get('/schedule/events', 
//   ensureAuthenticated, 
//   ensureBusiness, 
//   businessController.getHostedEvents
// );
export default router;