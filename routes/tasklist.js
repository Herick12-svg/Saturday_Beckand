const express = require('express');
const router = express.Router();
const Task = require('../models/tasklist');

router.post('/add', async(req, res) => {
	try {
		if (req.body.description && req.body.dueDate)
			{
				// create one instance of User Model
				const new_task = new Task({
					description: req.body.description,
					completed: false,
					createdAt: new Date(),
					dueDate: req.body.dueDate,
					user: req.user._id
					

					
				})
				console.log(new_task)
				// save to database
				await new_task.save()
				res.json({ error: false, message: 'ok' , data: new_task})
			} 

			else
			{
				res.json({ error: true, message: 'Missing parameters'})
			}
		} catch (error) {
			res.json({ error: true, message: error.message });
		}
   

})
router.post('/update', async (req, res) => {

	// Check if the request is verified / authenticated
	// Login success or not

	if (req.body.id && req.body.completed)
	{
		// our goal to make this object
		// { name: req.body.name, hash: req.body.password, role: req.body.role }
		let updateOptions = {};
		// If name is provided
		if (req.body.name)
            updateOptions.name = req.body.name;	

        if (req.body.completed)
			updateOptions.completed = req.body.completed;
			
		await Task.findOneAndUpdate({ _id: req.body.id }, updateOptions)
		res.json({ error: false })
	}
	else
	{
		res.json({ error: true, message: 'Missing parameters' })
	}
})
router.post('/delete', async (req, res) => {
	if (req.body.id)
	{
		await Task.deleteOne({ _id: req.body.id });
		res.json({ error: false });
	}
	else
	{
		res.json({ error: true, message: 'Missing parameters'});
	}
})
router.get('/:get', async (req, res) => {
	
	let options = {
	}

	if (req.query.startDate)
	{
		if (req.query.endDate) 
		{
			//Today date: (e.g !7 sept 2022)
			//start Date: 2022-9-17 00.00.00
			//end date:  2022-9-17 23.59.99
			options.dueDate = {
				$gte: req.query.startDate,
				$lte: req.query.endDate
			}
		}
		// upcoming task
		else {
			options.dueDate = {$get: req.query.startDate}
		}
	}

	try {
		const tasklist = await Task.find()
			.sort({dueDate: 1}) // sort by duedate {accending}
			.populate({
				path: 'user',
				select: 'username name profile',
				model:'user'
			})
			.exec()
		res.json({ error:false, data: tasklist})
	} catch (err) {
		res.json({ error:true, message: err.message})
	}
   
})

router.post('/:user/obtain', async (req, res) => {
	try {
		if (req.params.user) {
			console.log(req.params.user)
			const tasklist = await Task.find({user: req.params.user})
			

			res.json({ error:false, data: tasklist})
		}
		else {
			console.log("no user")
		}
	} catch (err) {
		res.json({ error:true, message: err.message})
	}

	
   
})

module.exports = router;

