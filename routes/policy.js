import { Router } from 'express';
const router = Router();



router.route('/term').get(async(req, res) => {
    res.render('terms-of-use', { title: 'Term of Use' });

});
router.route('/privacy').get(async(req, res) => {

    res.render('privacy-policy', { title: 'Privacy Policy' });

});

export default router;