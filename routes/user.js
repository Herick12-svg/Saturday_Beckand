const express = require('express');
const router = express.Router();
const multer = require('multer') 
const upload = multer({ dest: 'upload/', limits: { fieldSize: 25*1024*1024} });
const User = require('../models/user');
const SHA256 = require("crypto-js/sha256");
const Base64 = require('crypto-js/enc-base64');
const {URL} = require('../utils/consts')


const fs = require('fs'); //File system

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
//for more than 1 file upload.array
router.post('/:id/profile', upload.single('file'), async(req, res) => {

const user = await User.findOne({_id: req.params.id})
console.log(user)
console.log(user)
if (user)
{
	const filename = req.file.originalname
	const index =filename.lastIndexOf('.')
	let extension = '';
	if (index >= 0)
	{
		// substring means that it take the letter started from index to end
		extension = filename.substring(index);
	}
	const fullname= `upload/${req.file.filename}${extension}`;
	//renamethe file with extension
	fs.rename(req.file.path, fullname, (err) => {
		console.log('rename err' , err)
	})
	console.log(URL)

	user.profile = `${URL}/${fullname}`
	//save into database
	await user.save();
	res.json({ error: false, profile: user.profile});
}
else
{
	res.json({ error:true, message: 'Invalid User'})
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
		res.json({ error: false })
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