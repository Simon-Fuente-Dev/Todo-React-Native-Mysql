import express from "express";
import {
    getTodoById,
    createTodo,
    deleteTodo,
    getSharedTodoById,
    getTodosById,
    getUserByEmail,
    getUserByID,
    shareTodo,
    toggleCompleted
} from "./database.js";
import cors from 'cors';

const corsOptions = {
    origin: "http://127.0.0.1:5137",
    methods: ['POST', 'GET'],
    credentials: true
};

const app = express();
app.use(express.json()); //Haga caso a request que sean json
app.use(cors(corsOptions));

//Obtener todos los todos
app.get('/todos/:id', async (req, res) => {
    const todos = await getTodosById(req.params.id)
    res.status(200).send(todos)
})

app.get("/todos/shared_todos/:id", async (req, res) => {
    const todo = await getSharedTodoById(req.params.id);
    console.log(todo)
    const author = await getUserByID(todo.user_id);
    const shared_with = await getUserByID(todo.shared_with_id);
    res.status(200).send({ author, shared_with });
});

app.get("/user/:id", async (req, res) => {
    const user = await getUserByID(req.params.id);
    res.status(200).send(user);
});

app.put("/todos/:id", async (req, res) => {
    const { value } = req.body;
    const todo = await toggleCompleted(req.params.id, value);
    res.status(200).send(todo);
});

app.delete("/todos/:id", async (req, res) => {
    await deleteTodo(req.params.id);
    res.send({ message: "Todo deleted successfully" });
});

app.post("/todos/shared_todos", async (req, res) => {
    const { todo_id, user_id, email } = req.body;
    const userToShare = await getUserByEmail(email);
    const sharedTodo = await shareTodo(todo_id, user_id, userToShare.id);
    res.status(201).send(sharedTodo);
});

app.post("/todos", async (req, res) => {
    const { user_id, title } = req.body;
    const todo = await createTodo(user_id, title);
    res.status(201).send(todo);
});


app.listen(8080, () => {
    console.log('Server running on port 8080')
})