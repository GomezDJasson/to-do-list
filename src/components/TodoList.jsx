import { useState, useEffect } from "react"
import TodoInput from "./TodoInput"
import TodoItem from "./TodoItem"

function TodoList() {

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks")
    return savedTasks ? JSON.parse(savedTasks) : []
  })

  const [filter, setFilter] = useState("all")

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = (text) => {
    const newTask = {
      id: Date.now(),
      text,
      completed: false
    }

    setTasks([...tasks, newTask])
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const toggleTask = (id) => {
    setTasks(
      tasks.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed
    if (filter === "pending") return !task.completed
    return true
  })

  const editTask = (id, newText) => {
    setTasks(
      tasks.map(task =>
        task.id === id
          ? { ...task, text: newText }
          : task
      )
    )
  }

  const pendingTasks = tasks.filter(task => !task.completed).length

  return (
    <div>

      <TodoInput addTask={addTask} />

      <div className="flex justify-center gap-2 mt-4">

        <button
          onClick={() => setFilter("all")}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Todas
        </button>

        <button
          onClick={() => setFilter("pending")}
          className="px-3 py-1 bg-yellow-200 rounded"
        >
          Pendientes
        </button>

        <button
          onClick={() => setFilter("completed")}
          className="px-3 py-1 bg-green-200 rounded"
        >
          Completadas
        </button>

      </div>

      <p className="text-center mt-3 text-gray-600">
        {pendingTasks} tareas pendientes
      </p>

      <div className="mt-4 space-y-2">
        {filteredTasks.map(task => (
          <TodoItem
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            toggleTask={toggleTask}
            editTask={editTask}
          />
        ))}
      </div>

    </div>
  )
}

export default TodoList