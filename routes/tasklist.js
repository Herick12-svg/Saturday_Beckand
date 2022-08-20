const express = require('express');
const router = express.Router();
const Task = require('../models/tasklist');

router.post('/add', async(req, res) => {
    if (req.body.name, req.body.completed)
	{
		// create one instance of User Model
		const new_task = new Task({
            name: req.body.name,
            completed: false,
			createdAt: new Date()
		})
		// save to database
		await new_task.save()
		res.json({ error: false, message: 'ok' })
	}
	else
	{
		res.json({ error: true, message: 'Missing parameters'})
	}

} )
router.post('/update', async (req, res) => {

	// Check if the request is verified / authenticated
	// Login success or not

	if (req.body.id, req.body.completed)
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
router.get('/get', async (req, res) => {
    Task.find({}, (err, data) )
    if (err)
    {
        res.json({ error: true , message: err.message });
    }
    else{
        res.json({ error: false, data});
    }
   
})

module.exports = router;

