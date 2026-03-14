import { useState } from "react"
import { motion } from "framer-motion"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Pencil, Trash2, Save, GripVertical } from "lucide-react"

function TodoItem({ task, deleteTask, toggleTask, editTask }) {

  const [isEditing, setIsEditing] = useState(false)
  const [newText, setNewText] = useState(task.text)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleEdit = () => {
    if(newText.trim() === "") return
    editTask(task.id, newText)
    setIsEditing(false)
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg shadow-sm"
      animate={{
        scale: task.completed ? 0.98 : 1,
        opacity: task.completed ? 0.7 : 1
      }}
      transition={{ duration: 0.2 }}
    >

    <div
      {...attributes}
      {...listeners}
      className="cursor-grab text-gray-400"
    >
      <GripVertical size={18} />
    </div>
      
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

      <div className="flex gap-3 items-center">

        {isEditing ? (
          <button
            onClick={handleEdit}
            className="text-green-500 hover:scale-110 transition"
          >
            <Save size={18} />
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-yellow-500 hover:scale-110 transition"
          >
            <Pencil size={18} />
          </button>
        )}

        <button
          onClick={() => deleteTask(task.id)}
          className="text-red-500 hover:scale-110 transition"
        >
          <Trash2 size={18} />
        </button>

      </div>

    </motion.div>
  )
}

export default TodoItem