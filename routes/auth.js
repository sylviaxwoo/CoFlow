import { Router } from 'express';
const router = Router();
import bcrypt from 'bcrypt';
import * as authdata from '../data/auth.js';
import * as userdata from '../data/user.js';



router.route('/signup')
    .get(async(req, res) => {
        res.render('signup', { title: 'Sign Up' });
    })
    .post(async(req, res) => {
        const formData = req.body;

        console.log('Signup Form Data:', formData);

        const { userName, firstName, lastName, email, password, bio, gender, city, state, dob, courses, education, terms, privacy } = req.body;

        try {
            const existingUsername = await userdata.findUserByUsername(userName);
            if (existingUsername) {
                return res.render('signup', { title: 'Sign Up', error: 'Username already exists.' });
            }
            const existingemail = await userdata.findUserByEmail(email);
            if (existingemail) {
                return res.render('signup', { title: 'Sign Up', error: 'Email already registered.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = { userName, firstName, lastName, email, hashedPassword, bio, gender, city, state, dob, courses, education }; // Include other fields in your user object
            await userdata.createUser(newUser);

            req.session.user = { id: newUser._id, userName: newUser.userName };
            res.redirect('/profile');

        } catch (error) {
            console.error('Error during signup:', error);
            res.render('signup', { title: 'Sign Up', error: 'An error occurred during signup.' });
        }
    });
router.route('/login')
    .get(async(req, res) => {
        res.render('login', { title: 'Login' });
    })
    .post(async(req, res) => {
        const { userName, password } = req.body;

        try {
            const user = await findUserByUsername(userName);
            if (!user) {
                return res.render('login', { title: 'Login', error: 'Invalid username or password.' });
            }

            const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
            if (!passwordMatch) {
                return res.render('login', { title: 'Login', error: 'Invalid username or password.' });
            }

            req.session.user = { id: user._id, userName: user.userName };
            res.redirect('/profile');

        } catch (error) {
            console.error('Error during login:', error);
            res.render('login', { title: 'Login', error: 'An error occurred during login.' });
        }
    });

router.route('/logout')
    .get(async(req, res) => {
        req.session.destroy(() => {
            res.redirect('/login');
        })
    });
export default router;