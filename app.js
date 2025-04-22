import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import { engine } from 'express-handlebars'; // Correct import for ESM

import path from "path";


app.use('/public', express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine({
    defaultLayout: 'main',
    helpers: {
        getCurrentYear: () => new Date().getFullYear(),
        eq: (v1, v2) => v1 === v2 // Register the 'eq' helper
    }
})); // Use the imported 'engine'
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});