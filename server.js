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
	var queryParams = req.query;
	var filterTodos = todos;

	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
		filterTodos = _.where(filterTodos, {completed: true});
	}else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
		filterTodos = _.where(filterTodos, {completed: false});
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filterTodos = _.filter(filterTodos, function (todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q) > -1;
		})
	}

	res.json(filterTodos);

})

//GET the single todo
app.get('/todos/:id', function (req, res) {

	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(matchedTodo){
		res.json(matchedTodo);
	}else{
		res.status(404).send();
	}
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

	//input validation
	// if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
	// 	return res.status(400).send();
	// }

	// body.description = body.description.trim();
	// body.id = todoNextId++;

	// todos.push(body);

	// res.json(body);
})

//DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (!matchedTodo) {
		res.status(404).json({"error":"no todo found with that ID"});
	}else{
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
})

//PUT /todos/:id
app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

    //404 not found, 400 bad syntex
	if (!matchedTodo) {
		return res.status(404).send();
	}

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	}else if(body.hasOwnProperty('completed') ){
		return res.status(400).send();
	}

	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
		validAttributes.description = body.description;
	}else if(body.hasOwnProperty('description')){
		return res.status(400).send();
	}

	//Here to update, new _ method
	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});

db.sequelize.sync().then(function () {
	app.listen(PORT, function () {
		console.log('express listening on PORT ' + PORT);
	});
});

