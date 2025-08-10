import { Routes, Route } from "react-router-dom"
import "./App.css"
import LoginPage from "./pages/LoginPage"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* Otras rutas a agregar */}
      </Routes>
    </div>
  )
}

export default App
