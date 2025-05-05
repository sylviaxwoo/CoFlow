import { Router } from 'express';
const router = Router();
import * as admindata from '../data/admin.js';
import middleware from '../middleware.js';


router.route('/auth/superuser-login')
    .get(middleware.superuserRouteMiddleware, async(req, res) => {
        try {
            const user = await admin.findAdminById(req.session.user.id);
            res.render('profile', { title: 'Profile', user: user });
        } catch (error) {
            console.error('Error fetching profile:', error);
            res.redirect('/login');
        }
    });

export default router;