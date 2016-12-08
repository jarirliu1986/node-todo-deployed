var express = require('express');
var bodyParser = require('body-parser');

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
	var todoId = req.params.id;
	var noMatch = true;
	var matchedTodo;

	todos.forEach(function (todo) {
		if(todo.id == todoId){
			noMatch = false;
			matchedTodo = todo;
		}
	})
	if(noMatch){
		res.status(404).send();
	}else{
		res.json(matchedTodo);
	}
})

//POST can take data /todos
app.post('/todos', function (req, res) {
	var body = req.body;
	// console.log('description ' + body.description);
	// console.log(body);
	// res.json(body);
	body.id = todoNextId++;
	todos.push(body);
	res.json(body);
})

app.listen(PORT, function () {
	console.log('express listening on PORT ' + PORT);
})