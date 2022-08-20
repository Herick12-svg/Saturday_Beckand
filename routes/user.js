const express = require('express');
const router = express.Router();
const User = require('../models/user');
const SHA256 = require("crypto-js/sha256");
const Base64 = require('crypto-js/enc-base64');

// /user/:id => GET /user/123456 => id = 123456
// To get the id use 'req.params.id'
router.get('/:id', async (req, res) => {

	try {
		const user = await User.findOne({ _id: req.params.id});
		if (user)
		{
			res.json({ error: false, data: user });
		}
		else
		{
			res.json({ error: true, message: 'Invalid user' });
		}		
	} catch (error) {
		res.json({ error: true, message: error.message });
	}
})

router.post('/edit', async (req, res) => {

	// Check if the request is verified / authenticated
	// Login success or not

	if (req.body.id)
	{
		// our goal to make this object
		// { name: req.body.name, hash: req.body.password, role: req.body.role }
		let updateOptions = {};
		// If name is provided
		if (req.body.name)
			updateOptions.name = req.body.name;
		if (req.body.password)
		{
			const hash = Base64.stringify(SHA256(req.body.password));
			updateOptions.hash = hash;
		}			
			
		await User.findOneAndUpdate({ _id: req.body.id }, updateOptions)
		res.json({ error: false , name, password})
	}
	else
	{
		res.json({ error: true, message: 'Missing parameters' })
	}
})

// CRUD ( Create, Read, Update, Delete ) => REST API
router.post('/delete', async (req, res) => {
	if (req.body.id)
	{
		await User.deleteOne({ _id: req.body.id });
		res.json({ error: false });
	}
	else
	{
		res.json({ error: true, message: 'Missing parameters'});
	}
})

module.exports = router;