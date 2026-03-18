function Footer() {
  return (
    <footer className="w-full text-center py-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-300 dark:border-gray-700 mt-6">
        © {new Date().getFullYear()} • Desarrollado por{" "}
        <span className="font-semibold text-indigo-500">
            <a href="https://portafolio-jasson.vercel.app"> Jasson D. Gomez </a>
        </span>
    </footer>
  )
}

export default Footer