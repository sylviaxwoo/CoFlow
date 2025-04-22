import { Router } from 'express';
const router = Router();



router.route('/').get(async(req, res) => {
    try {
        res.render('home', {
            title: 'Home'
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