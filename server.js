var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

// var todos = [{
// 	id: 1,
// 	description: 'Meet bf for lunch',
// 	completed: false
// },{
// 	id: 2,
// 	description: 'go to market',
// 	completed: false	
// },{
// 	id: 3,
// 	description: 'have breakfast',
// 	completed: true	
// }];

app.get('/', function (req, res) {
	res.send('Todo API Root');
})

//GET /todos
app.get('/todos', function (req, res) {
	res.json(todos);
})
//GET the single todo
app.get('/todos/:id', function (req, res) {
	//res.send('asking for id ' + req.params.id);
	var todoId = parseInt(req.params.id);
	console.log(todos);
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

	//input validation
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}

	body.description = body.description.trim();
	body.id = todoNextId++;

	todos.push(body);
	
	res.json(body);
})

app.listen(PORT, function () {
	console.log('express listening on PORT ' + PORT);
})