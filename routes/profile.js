import { Router } from 'express';
const router = Router();
import * as profiledata from '../data/user.js';
import middleware from '../middleware.js';



router.route('/').get(middleware.userRouteMiddleware, async(req, res) => {
    try {
        if (req.session && req.session.user) {
            const user = await profiledata.findUserById(req.session.user.id);
            res.render('profile', { title: 'Profile', user: user });
        }

    } catch (error) {
        console.error('Error fetching profile:', error);
        res.redirect('/auth/login');
    }
});
router.route('/admin').get(middleware.superuserRouteMiddleware, async(req, res) => {
    try {
        const user = await profiledata.findUserById(req.session.user.id);
        res.render('profile', { title: 'Profile', user: user });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.redirect('/auth/login');
    }
});
router.route('/business').get(async(req, res) => {
    try {
        const user = await profiledata.findUserById(req.session.user.id);
        res.render('profile', { title: 'Profile', user: user });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.redirect('/auth/login');
    }
});

export default router;