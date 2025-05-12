import { Router } from 'express';
const router = Router();



router.route('/about').get(async(req, res) => {
    res.render('about', { title: 'About' });

});
router.route('/contact').get(async(req, res) => {

    res.render('contact', { title: 'Contact' });

});

export default router;