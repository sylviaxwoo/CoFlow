import { Router } from 'express';
const router = Router();
import * as admindata from '../data/admin.js';
import * as userdata from '../data/user.js';
import middleware from '../middleware.js';
import bcrypt from 'bcrypt';


router.route('/').get(middleware.superuserRouteMiddleware, async(req, res) => {
    try {
        const user_table = await userdata.getAllUsers(req.session.user.id);
        res.render('admin-table', { title: 'Admin', user_table: user_table });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.redirect('/auth/login');
    }
});
router.route('/admin-register').post(async(req, res) => {

    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        if (password.length < 5 && password.length > 20) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        // Check if admin exists
        const existingAdmin = await admindata.findAdminByadminName(username);
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const resAdmin = await admindata.createAdmin(username, hashedPassword);
        res.status(200).json(resAdmin);
    } catch (error) {
        console.error('Admin Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.route('/api-test').get(middleware.superuserRouteMiddleware, async(req, res) => {
    try {
        const user = await admindata.findUserById(req.session.user.id);
        res.render('admin-api', { title: 'Profile', user: user });
    } catch (error) {
        console.error('Error in api test page:', error);
        res.redirect('/auth/login');
    }
});
export default router;