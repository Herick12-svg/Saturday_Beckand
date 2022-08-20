const express = require('express');
const router = express.Router();
const User = require('../models/user');
const SHA256 = require("crypto-js/sha256");
const Base64 = require('crypto-js/enc-base64');
const jwt = require('jsonwebtoken')

router.post('/signup', async (req, res) => {
	if (req.body.username && req.body.password && req.body.name)
	{
		// create one instance of User Model
		const hash = Base64.stringify(SHA256(req.body.password));
		const new_user = new User({
			username: req.body.username,
			hash,
			name: req.body.name,
			createdAt: new Date()
		})
		// save to database
		await new_user.save()
		res.json({ error: false, message: 'ok' })
	}
	else
	{
		res.json({ error: true, message: 'Missing parameters'})
	}
})

router.post('/login', async (req, res) => {
	// if provide username and password
	if (req.body.username && req.body.password)
	{
		const hash = Base64.stringify(SHA256(req.body.password));
		// Query DB with given username and password
		// <Model>.findOne({ ... column: value ... })
		// findOne : only find one of all data in DB
		const data = await User.findOne({ username: req.body.username, hash })
		
		// if data is not null
		if (data)
		{
            //Generate token
            const token = jwt.sign({  
                id: data._id, 
                username: data.username, 
                name: data.name, 
                role: data.role}, 
                'hs123$@Abc' )

			res.json({ error: false, data, token })
		}
		else
		{
			res.json({ error: true, message: 'Invalid username/password' })
		}
	}
	else
	{
		res.json({ error: true, message: 'Missing parameters' })
	}
})

module.exports = router;