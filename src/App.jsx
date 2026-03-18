import { useState, useEffect } from "react"
import TodoList from "./components/TodoList"
import Footer from "./components/Footer"

function App() {

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme")
    return savedTheme === "dark"
  })

  useEffect(() => {
    document.documentElement.classList.remove("dark")
  }, [])

  useEffect(() => {
    const html = document.documentElement

    if (darkMode) {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light")
  }, [darkMode])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">

      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 text-gray-800 dark:text-gray-200">

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mb-4 text-sm bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <h1 className="text-3xl font-bold text-center mb-6">
          To Do List
        </h1>

        <TodoList />

        <Footer />

      </div>

    </div>
  )
}

export default App