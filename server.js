var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

// var todos = [{
// 	id: 1,
// 	description: 'Meet bf for lunch',
// 	completed: false
// }];

app.get('/', function (req, res) {
	res.send('Todo API Root');
})

//GET /todos
//GET /todos?completed=true&q=work
app.get('/todos', function (req, res) {
	var query = req.query;
	var where = {};

	if(query.hasOwnProperty('completed') && query.completed === 'true'){
		where.completed = true;
	}else if(query.hasOwnProperty('completed') && query.completed === 'false'){
		where.completed = false;
	}

	if(query.hasOwnProperty('q') && query.q.length > 0){
		where.description = {
			$like: '%' + query.q + '%'
		}
	}

	db.todo.findAll({where: where}).then(function (todos) {
		res.json(todos);
	}, function (e) {
		res.status(500).send();
	});

});

//GET the single todo
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id);

	db.todo.findById(todoId).then(function (todo) {
		if(!!todo){  
			res.json(todo.toJSON());
		}else{
			res.status(404).send();
		}
	}, function(e){
		res.status(500).send();
	});
})

//POST can take data /todos
app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}

	db.todo.create(body).then(function (todo) {
		res.json(todo.toJSON());
	}, function (e) {
		res.status(400).json(e);
	})

})

//DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id);

	db.todo.destroy({
		where:{
			id: todoId
		}
	}).then(function (rowsDeleted) {
		if(rowsDeleted === 0){
			res.status(404).json({
				error: 'No todo with ID'
			})
		}else{
			res.status(204).send();
		}
	}, function (e) {
		res.status(500).send();
	});

})

//PUT /todos/:id
app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id);
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};

    //404 not found, 400 bad syntex
	if(body.hasOwnProperty('completed')){
		attributes.completed = body.completed;
	}

	if(body.hasOwnProperty('description')){
		attributes.description = body.description;
	}

	db.todo.findById(todoId).then(function (todo) {
		if (todo) {
			todo.update(attributes).then(function (todo) {
				res.json(todo.toJSON());
			}, function (e) {
				res.status(400).json(e);
			});
		}else{
			res.status(404).json({
				error: "todo not found"
			});
		}
	}, function () {
		res.status(500).send();
	});
});

app.post('/users', function (req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function (user) {
		res.json(user.toJSON());
	}, function (e) {
		res.status(400).json(e);
	})
});

db.sequelize.sync().then(function () {
	app.listen(PORT, function () {
		console.log('express listening on PORT ' + PORT);
	});
});

