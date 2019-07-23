const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const database = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'michaelg',
    password : '',
    database : 'react-facial-recognition-db'
  }
});

database.select('*').from('users').then(data => {
	console.log(data);
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

// const database = {
// 	users: [
// 		{
// 			id: '123',
// 			name: 'john',
// 			email: 'john@email.com',
// 			password: 'cookies',
// 			entries: 0,
// 			joined: new Date()
// 		},
// 		{
// 			id: '124',
// 			name: 'sally',
// 			email: 'sally@email.com',
// 			password: 'bananas',
// 			entries: 0,
// 			joined: new Date()
// 		}	
// 	]
// }

app.get('/', (req, res) => {
	res.send(database.users);
});

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;

	database.users.forEach( user => {
		if (user.id === id) {
			found = true;
			res.json(user);
		}
	});

	if (!found) {
		res.status(400).json('No user found');
	}
});

app.post('/signin', (req, res) => {
	if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
		res.json('success');
	} else {
		res.status(400).json('error logging in');
	}
	res.json(database.users[0]);
});

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	const saltRounds = 10;

	bcrypt.hash(password, saltRounds, function(err, hash) {
	  console.log(hash);
	});

	database('users').insert({
		email: email,
		name: name,
		joined: new Date()
	}).then(console.log);

	//res.json(database.users[database.users.length - 1]);
})

app.listen(3000, () => {
	console.log('API listening to port 3000');
});