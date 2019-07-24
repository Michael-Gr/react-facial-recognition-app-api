const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');

const database = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'michaelg',
    password : '',
    database : 'react-facial-recognition-db'
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {res.json('Success')});

app.post('/register', register.handleRegister(database, bcrypt));

app.post('/signin', signin.handleSignin(database, bcrypt));

app.get('/profile/:id', profile.handleProfileGet(database));

app.listen(3000, () => {
	console.log('API listening to port 3000');
});