import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DndContext, closestCenter } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Pencil, Trash2, Plus } from "lucide-react"
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

  const handleDragEnd = (event) => {

    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = activeList.tasks.findIndex(task => task.id === active.id)
    const newIndex = activeList.tasks.findIndex(task => task.id === over.id)

    const newTasks = [...activeList.tasks]

    const [movedTask] = newTasks.splice(oldIndex, 1)
    newTasks.splice(newIndex, 0, movedTask)

    setLists(
      lists.map(list =>
        list.id === activeListId
          ? { ...list, tasks: newTasks }
          : list
      )
    )
  }

  const editList = (id) => {
    const newName = prompt("Nuevo nombre de la lista")

    if (!newName) return

    setLists(
      lists.map(list =>
        list.id === id
          ? { ...list, name: newName }
          : list
      )
    )
  }

  const deleteList = (id) => {

    const confirmDelete = confirm("¿Eliminar esta lista?")

    if (!confirmDelete) return

    const updatedLists = lists.filter(list => list.id !== id)

    setLists(updatedLists)

    if (updatedLists.length > 0) {
      setActiveListId(updatedLists[0].id)
    }
  }

  const pendingTasksCount = (list) =>
  list.tasks.filter(task => !task.completed).length

  return (
    <div className="flex flex-col md:flex-row gap-6">

      <div className="hidden md:block md:w-48 flex-shrink-0">

        <h2 className="font-bold mb-3 text-gray-700 dark:text-gray-200">
          Listas
        </h2>

        <div className="flex flex-col gap-2">

          {lists.map(list => (

            <div
              key={list.id}
              className={`flex items-center justify-between px-3 py-2 rounded ${
                activeListId === list.id
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            >

              <button
                onClick={() => setActiveListId(list.id)}
                className="flex-1 text-left"
              >
                {list.name} ({pendingTasksCount(list)})
              </button>

              <div className="flex gap-2 ml-2">

                <button
                  onClick={() => editList(activeListId)}
                  className="text-yellow-500 hover:scale-110 transition"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() => deleteList(activeListId)}
                  className="text-red-500 hover:scale-110 transition"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            </div>

          ))}

          <button
            onClick={addList}
            className="w-full bg-indigo-500 text-white py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Nueva lista
          </button>

        </div>

      </div>

      <div className="md:hidden mb-4 space-y-2">

        <div className="flex gap-2">

          <select
            value={activeListId || ""}
            onChange={(e) => setActiveListId(Number(e.target.value))}
            className="flex-1 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            {lists.map(list => (
              <option key={list.id} value={list.id}>
                {list.name} ({pendingTasksCount(list)})
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              if (activeListId) editList(Number(activeListId))
            }}
            className="text-yellow-500 hover:scale-110 transition"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => {
              if (activeListId) deleteList(Number(activeListId))
            }}
            className="text-red-400 hover:scale-110 transition"
          >
            <Trash2 size={16} />
          </button>

        </div>

        <button
          onClick={addList}
          className="w-full bg-indigo-500 text-white py-2 rounded-lg"
        >
          + Nueva lista
        </button>

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

          <div className="hidden md:block">
            <TodoInput addTask={addTask} />
          </div>

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

          <div className="mt-4 space-y-2 pb-24">

            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >

              <SortableContext
                items={filteredTasks.map(task => task.id)}
                strategy={verticalListSortingStrategy}
              >

                {filteredTasks.map(task => (
                  <TodoItem
                    key={task.id}
                    task={task}
                    deleteTask={deleteTask}
                    toggleTask={toggleTask}
                    editTask={editTask}
                  />
                ))}

              </SortableContext>

            </DndContext>

          </div>

          <div className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 p-3 border-t border-gray-300 dark:border-gray-700">
            <TodoInput addTask={addTask} />
          </div>

        </motion.div>

      </div>

    </div>
  )
}

export default TodoList