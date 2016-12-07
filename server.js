var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: 'Meet bf for lunch',
	completed: false
},{
	id: 2,
	description: 'go to market',
	completed: false	
},{
	id: 3,
	description: 'have breakfast',
	completed: true	
}];

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

app.listen(PORT, function () {
	console.log('express listening on PORT ' + PORT);
})