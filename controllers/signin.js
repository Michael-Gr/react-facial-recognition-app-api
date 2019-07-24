const handleSignin = (database, bcrypt) => (req, res) => {
	const { email, password } = req.body;

	if (!email, !password) {
		return res.status(400).json('Invalid form data.');
	}

	database.select('email', 'hash').from('login')
	.where('email', '=', email)
	.then(data => {
		const isValid = bcrypt.compareSync(password, data[0].hash);
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