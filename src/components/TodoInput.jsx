import { useState } from "react"

function TodoInput({ addTask }) {

  const [text, setText] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if(text.trim() === "") return

    addTask(text)
    setText("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">

      <input
        type="text"
        placeholder="Nueva tarea..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <button
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 rounded-lg transition"
      >
        +
      </button>

    </form>
  )
}

export default TodoInput