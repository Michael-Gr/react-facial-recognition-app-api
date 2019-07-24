const handleSignin = (database, bcrypt) => (req, res) => {
	database.select('email', 'hash').from('login')
	.where('email', '=', req.body.email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
		if (isValid) {
			database.select('*').from('users')
			.where('email', '=', data[0].email)
			.then(user => {res.json(user[0])})
			.catch(err => {res.status(400).json('Unable to login.')})
		} else {
			res.status(400).json('Invalid credentials.');
		}
	})
	.catch(err => {res.status(400).json('Invalid credentials.')});
}

module.exports = {
	handleSignin: handleSignin
};