import { Router } from 'express';
const router = Router();
import * as profiledata from '../data/user.js';



router.route('/').get(async(req, res) => {
    try {
        const user = await profiledata.findUserById(req.session.user.id);
        res.render('profile', { title: 'Profile', user: user });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.redirect('/login');
    }
});

export default router;