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

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send(database.users);
});

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;

	database.select('*').from('users').where({
		id: id
	})
	.then(user => user.length ? res.json(user[0]) : res.status(400).json('No user found.'))
	.catch(err => res.status(400).json('Error getting user.'));
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
	const salt = bcrypt.genSaltSync(saltRounds);
	const hash = bcrypt.hashSync(password, salt);

	database.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
				.returning('*')
				.insert({
					email: loginEmail[0],
					name: name,
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);
				})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('Unable to save.'));
})

app.listen(3000, () => {
	console.log('API listening to port 3000');
});