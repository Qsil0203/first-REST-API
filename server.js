const express = require('express')

const app = express()
const PORT = 3000

app.use(express.json())

let tasks = [
    {id: 1, title: "Learn Node.js", completed: false, priority: "high"},
    {id: 2, title: "Build first API", completed: true, priority: "medium"},
    {id: 2, title: "Turn on the PC", completed: true, priority: "low"}
]

app.get('/', (req, res) => {
    res.json("Task API is running")
})


app.get("/tasks", (req,res) => {
    const {completed, priority} = req.query
    let filteredTasks = tasks

    if (completed !== undefined) {
        const value = completed === 'true'
        filteredTasks = filteredTasks.filter(item => item.completed === value)
    }

    if (priority !== undefined) {
        
        if (priority !== 'high' && priority !== 'medium' && priority !== 'low')  {
            return res.status(400).json({ 
                message: "Priority is invalid. Must be 'high', 'medium' or 'low'" 
            })
        }
        
        filteredTasks = filteredTasks.filter(item => item.priority === priority)
    }

    res.json(filteredTasks)
})

app.get("/tasks/completed-count", (req, res) => {
    const completedTasks = tasks.filter(item => item.completed === true)
    
    res.json({
        count: completedTasks.length
    })
})


app.get("/tasks/:id", (req,res) => {
    const id = Number(req.params.id)
    const task = tasks.find(item => item.id === id)

    if (!task) {
        return res.status(404).json({message: "Task not found"})
    }

    res.json(task)
})


app.post("/tasks", (req,res) => {
    const {title, completed = false} = req.body

    if(!title || typeof title !== 'string' || title.trim() === "") {
        return res.status(400).json({
            message: "Field title is required and must be a string"
        })
    }

    if (priority !== 'high' && priority !== 'medium' && priority !== 'low') {
        return res.status(400).json({ 
            message: "Priority is invalid. Must be 'high', 'medium' or 'low'" 
        })
    }

    const newTask = {
        id: Date.now(),
        title: title.trim(), 
        completed: Boolean(completed),
        priority
    }

    tasks.push(newTask)

    res.status(201).json(newTask)
})


app.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id)
    const {title , completed} = req.body

    const task = tasks.find(item => item.id === id)

    if (!task) {
        return res.status(400).json({message: "Task not found"})
    }

    if(!title || typeof title !== 'string' || typeof completed !== 'boolean') {
        return res.status(400).json({
            message: "title must be a string and completed must be a boolean"
        })
    }

    task.title = title
    task.completed = completed

    res.json(task)
})

app.patch("/tasks/:id", (req,res) => {
    const id = Number (req.params.id)
    const {title , completed, priority} = req.body

    const task = tasks.find(item => item.id === id)

    if (!task) {
        return res.status(400).json({message: "Task not found"})
    }

    if(title !== undefined){
        if(typeof title !== 'string' || title.trim() === ""){
            return res.status(400).json({
                message: "title must be a non-empty string"
            })
        }
        task.title = title.trim()
    }

    if (completed !== undefined) {
        if (typeof completed !== 'boolean') {
            return res.status(400).json({
                message: "completed must be a boolean"
            })
        }
        task.completed = completed
    }

    if (priority !== undefined) {
        if (priority !== 'high' && priority !== 'medium' && priority !== 'low') {
            return res.status(400).json({ 
                message: "Priority is invalid. Must be 'high', 'medium' or 'low'" 
            })
        }
        task.priority = priority
    }

    res.json(task)
})

app.delete("/tasks/:id", (req,res) => {
    const id = Number(req.params.id)
    const index = tasks.findIndex(item => item.id === id)

    if (index === -1){
        return res.status(404).json({message: "Task not found"})
    }

    tasks.splice(index, 1)

    res.status(204).send()
})

app.get('/', (req, res) => {
    res.send('Hello in Express!')
})

app.listen(PORT, () => {
    console.log(`Server started on http:localhost:${PORT}`)
})