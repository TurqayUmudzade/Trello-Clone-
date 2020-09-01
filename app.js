const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser, getUserID } = require('./Middleware/authMW');
require('dotenv').config()


//Routes
const authRoutes = require('./Routes/authRoutes');
const boardRoutes = require('./Routes/boardRoutes');
const userRoutes = require('./Routes/userRoutes')


const app = express();

//VIEW ENGINE
app.set('views', path.join(__dirname, 'Views/pages'));
app.set('view engine', 'ejs')

//Middleware
app.use(express.static('Public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(getUserID)



const port = process.env.PORT || 3000;
//Database connection

const dbURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.zyklu.mongodb.net/node-auth`;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then((result) => app.listen(3000, () => console.log("Server Up at port " + port)))
    .catch((err) => console.log(err));


//Routes

app.get('*', checkUser);

app.get('/', (req, res) => { res.render('home') });

//Login/Register
app.use(authRoutes);


//[Auth]
app.use(boardRoutes);

//[Auth]
app.use(userRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});