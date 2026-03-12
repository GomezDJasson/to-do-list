import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed))
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
          className={`px-3 py-1 rounded transition ${
            filter === "all"
              ? "bg-indigo-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          }`}
        >
          Todas
        </button>

        <button
          onClick={() => setFilter("pending")}
          className={`px-3 py-1 rounded transition ${
            filter === "pending"
              ? "bg-yellow-500 text-white"
              : "bg-yellow-200 dark:bg-yellow-600 text-gray-800 dark:text-white"
          }`}
        >
          Pendientes
        </button>

        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1 rounded transition ${
            filter === "completed"
              ? "bg-green-500 text-white"
              : "bg-green-200 dark:bg-green-600 text-gray-800 dark:text-white"
          }`}
        >
          Completadas
        </button>

      </div>

      <p className="text-center mt-3 text-gray-600">
        {pendingTasks} tareas pendientes
      </p>

      <button
        onClick={clearCompleted}
        className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
      >
        Limpiar completadas
      </button>

      <div className="mt-4 space-y-2">

        <AnimatePresence>

          {filteredTasks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <TodoItem
                task={task}
                deleteTask={deleteTask}
                toggleTask={toggleTask}
                editTask={editTask}
              />
            </motion.div>
          ))}

        </AnimatePresence>

      </div>

    </div>
  )
}

export default TodoList