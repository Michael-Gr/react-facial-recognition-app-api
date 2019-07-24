const handleProfileGet = (database) => (req, res) => {
	const { id } = req.params;

	database.select('*').from('users').where({
		id: id
	})
	.then(user => user.length ? res.json(user[0]) : res.status(400).json('No user found.'))
	.catch(err => res.status(400).json('Error getting user.'));
}

module.exports = {
	handleProfileGet: handleProfileGet
};