const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());

const database = {
	users: [
		{
			id: '123',
			name: 'john',
			email: 'john@email.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'sally',
			email: 'sally@email.com',
			password: 'bananas',
			entries: 0,
			joined: new Date()
		}	
	]
}

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
	bcrypt.compare(req.body.password, '$2b$10$RtftpePT7z8U9ApiEJQYveza6DNRX8R136Kkd8lBLVxvo7PNWBcju', function(err, res) {
	    console.log(res);
	});

	if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
		res.json('signed in');
	} else {
		res.status(400).json('error logging in');
	}
});

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	const saltRounds = 10;

	bcrypt.hash(password, saltRounds, function(err, hash) {
	  console.log(hash);
	});

	database.users.push(
		{
			id: '125',
			name: name,
			email: email,
			password: password,
			entries: 0,
			joined: new Date()
		}
	);
	res.json(database.users[database.users.length - 1]);
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;

	database.users.forEach( user => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	});

	if (!found) {
		res.status(400).json('No user found');
	}
});

app.listen(3000, () => {
	console.log('API listening to port 3000');
});