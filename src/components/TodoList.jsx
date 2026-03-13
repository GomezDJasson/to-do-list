import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import TodoInput from "./TodoInput"
import TodoItem from "./TodoItem"

function TodoList() {

  const [lists, setLists] = useState(() => {
    const savedLists = localStorage.getItem("lists")
    return savedLists ? JSON.parse(savedLists) : [
      {
        id: 1,
        name: "Mi lista",
        tasks: []
      }
    ]
  })

  const [activeListId, setActiveListId] = useState(null)

  const [filter, setFilter] = useState("all")

  const activeList = lists.find(list => list.id === activeListId)

  useEffect(() => {
    if (lists.length > 0 && !activeListId) {
      setActiveListId(lists[0].id)
    }
  }, [lists])

  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(lists))
  }, [lists])

  const addList = () => {
    const name = prompt("Nombre de la lista")
    if (!name) return

    const newList = {
      id: Date.now(),
      name,
      tasks: []
    }

    setLists([...lists, newList])
  }

  const addTask = (text) => {

    const newTask = {
      id: Date.now(),
      text,
      completed: false
    }

    setLists(
      lists.map(list =>
        list.id === activeListId
          ? { ...list, tasks: [...list.tasks, newTask] }
          : list
      )
    )
  }

  const deleteTask = (id) => {
    setLists(
      lists.map(list =>
        list.id === activeListId
          ? { ...list, tasks: list.tasks.filter(task => task.id !== id) }
          : list
      )
    )
  }

  const toggleTask = (id) => {
    setLists(
      lists.map(list =>
        list.id === activeListId
          ? {
              ...list,
              tasks: list.tasks.map(task =>
                task.id === id
                  ? { ...task, completed: !task.completed }
                  : task
              )
            }
          : list
      )
    )
  }

  const clearCompleted = () => {
    setLists(
      lists.map(list =>
        list.id === activeListId
          ? {
              ...list,
              tasks: list.tasks.filter(task => !task.completed)
            }
          : list
      )
    )
  }

  const filteredTasks = activeList?.tasks.filter(task => {
    if (filter === "completed") return task.completed
    if (filter === "pending") return !task.completed
    return true
  }) || []

  const editTask = (id, newText) => {
    setLists(
      lists.map(list =>
        list.id === activeListId
          ? {
              ...list,
              tasks: list.tasks.map(task =>
                task.id === id
                  ? { ...task, text: newText }
                  : task
              )
            }
          : list
      )
    )
  }

  const pendingTasks =
    activeList?.tasks.filter(task => !task.completed).length || 0

  return (
    <div className="flex gap-6">

      <div className="w-48 flex-shrink-0">

        <h2 className="font-bold mb-3 text-gray-700 dark:text-gray-200">
          Listas
        </h2>

        <div className="flex flex-col gap-2">

          {lists.map(list => (
            <button
              key={list.id}
              onClick={() => setActiveListId(list.id)}
              className={`text-left px-3 py-2 rounded transition ${
                activeListId === list.id
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            >
              {list.name}
            </button>
          ))}

          <button
            onClick={addList}
            className="text-left px-3 py-2 rounded bg-gray-300 dark:bg-gray-600"
          >
            + Nueva lista
          </button>

        </div>

      </div>

      <div className="flex-1 max-h-[400px] overflow-y-auto">

        <motion.div
          key={activeListId}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >

          <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-200">
            {activeList?.name}
          </h2>

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

        </motion.div>

      </div>

    </div>
  )
}

export default TodoList