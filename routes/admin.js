import { Router } from 'express';
const router = Router();
import * as admindata from '../data/admin.js';
import * as userdata from '../data/user.js';
import middleware from '../middleware.js';
import bcrypt from 'bcrypt';


router.route('/admin-table').get(middleware.superuserRouteMiddleware, async(req, res) => {
    try {

        const user = await admindata.findAdminById(req.session.user.id);
        const user_table = await userdata.getAllUsers();
        const admin_table = await admindata.getAllAdmin();
        res.render('admin-table', { title: 'Admin', user: user, user_table: user_table, admin_table: admin_table });
    } catch (error) {
        console.error('Error fetching admin table:', error);
        res.status(500).render('error', { title: "error", message: error });
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

export default router;