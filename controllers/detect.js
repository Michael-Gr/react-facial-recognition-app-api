const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: 'd221524e3a274ee994e5e629560fd2a0'
});

const handleDetect = (req, res) => {
	const data = {};
	app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	.then(data => {res.json(data)})
	.catch(err => res.status(400).json('Issue reaching API.'));
}

module.exports = {
	handleDetect: handleDetect
};