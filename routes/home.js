import { Router } from 'express';
const router = Router();
import * as userdata from '../data/user.js';


router.route('/').get(async(req, res) => {
    try {
        let user = null;
        if (req.session && req.session.user) {
            user = req.session.user;
        }
        res.render('home', {
            title: 'Home',
            user: user
        });
    } catch (e) {
        console.error(e);
        res.status(500).render('error', {
            title: "500",
            message: 'Failed to load home page'
        });
    }
});

export default router;