const mongoose = require('mongoose');

mongoose
	.connect(
		'mongodb+srv://harshaksaini:rs9MZfv4n5Qngrbp@cluster0.7innx4a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
	)
	.then(() => {
		console.log(`Connection Succefully`);
	});
