import TodoList from "./components/TodoList"

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-[400px]">

        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          To Do List
        </h1>

        <TodoList />

      </div>

    </div>
  )
}

export default App