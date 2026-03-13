import { useState } from "react"
import { motion } from "framer-motion"

function TodoItem({ task, deleteTask, toggleTask, editTask }) {

  const [isEditing, setIsEditing] = useState(false)
  const [newText, setNewText] = useState(task.text)

  const handleEdit = () => {
    if(newText.trim() === "") return
    editTask(task.id, newText)
    setIsEditing(false)
  }

  return (
    <motion.div
      className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg shadow-sm"
      animate={{
        scale: task.completed ? 0.98 : 1,
        opacity: task.completed ? 0.7 : 1
      }}
      transition={{ duration: 0.2 }}
    >
      
      {isEditing ? (
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="border p-1 rounded w-full mr-2"
        />
      ) : (
        <motion.span
          onClick={() => toggleTask(task.id)}
          animate={{
            textDecoration: task.completed ? "line-through" : "none"
          }}
          transition={{ duration: 0.2 }}
          className={`cursor-pointer flex-1 ${
            task.completed ? "line-through text-gray-400" : "text-gray-700 dark:text-gray-200"
          }`}
        >
          {task.text}
        </motion.span>
      )}

      <div className="flex gap-2">

        {isEditing ? (
          <button
            onClick={handleEdit}
            className="text-green-500"
          >
            💾
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500"
          >
            ✏️
          </button>
        )}

        <button
          onClick={() => deleteTask(task.id)}
          className="text-red-500"
        >
          ❌
        </button>

      </div>

    </motion.div>
  )
}

export default TodoItem