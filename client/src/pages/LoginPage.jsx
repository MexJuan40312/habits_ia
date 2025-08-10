// client/src/pages/LoginPage.jsx

"use client"

import { useState } from "react"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import FormField from "../components/molecules/FormField"
import Button from "../components/atoms/Button"
import authService from '../services/api' // Importamos el servicio de autenticación
import { useNavigate } from 'react-router-dom'; // Para redirigir al usuario

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Hook para la navegación

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null); // Limpiamos errores previos

    try {
      const userData = await authService.login(email, password);
      console.log("Inicio de sesión exitoso:", userData);
      // Aquí se debería guardar el estado de autenticación (por ejemplo, con un contexto)
      // Por ahora, solo redirigimos al usuario a la página de hábitos
      navigate('/habits'); 
    } catch (err) {
      console.error("Error de inicio de sesión:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
         <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido de vuelta</h1>
          <p className="text-gray-600 text-lg">Inicia sesión con tu cuenta</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Correo electrónico"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
            />

            <div className="relative">
              <FormField
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[42px] text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
              </button>
            </div>

            {/* Opciones y error */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="mr-3 w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 focus:ring-2"
                />
                Recordarme
              </label>
              <a href="#" className="text-sm text-gray-900 hover:text-gray-700 font-medium transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={isLoading} className="h-14 text-lg">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage