import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import { engine } from 'express-handlebars'; // Correct import for ESM
import session from 'express-session';
import middleware from './middleware.js';
import path from "path";
import { dbConnection, getMongoClient } from './config/mongoConnection.js';

const client = await getMongoClient(); // Get the MongoClient instance
const db = await dbConnection();

app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    name: 'CoFlow',
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));
app.engine('handlebars', engine({
    defaultLayout: 'main',
    helpers: {
        getCurrentYear: () => new Date().getFullYear(),
        eq: (v1, v2) => v1 === v2 // Register the 'eq' helper
    }
})); // Use the imported 'engine'
app.set('view engine', 'handlebars');

app.use(middleware.loggingMiddleware)
configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});