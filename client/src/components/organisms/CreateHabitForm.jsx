import { useState } from "react"
import FormField from "../molecules/FormField"
import Button from "../atoms/Button"
import { Plus, Target, FileText, Sparkles, Lightbulb, CheckCircle } from "lucide-react"

const CreateHabitForm = ({ onHabitCreated }) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [recommendations, setRecommendations] = useState([]) // NUEVO ESTADO para las recomendaciones
  const [showRecommendations, setShowRecommendations] = useState(false) // NUEVO ESTADO para controlar la visibilidad

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    setIsLoading(true)
    const newHabit = {
      title: title.trim(),
      description: description.trim(),
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
    }

    try {
      const createdHabitWithRecommendations = await onHabitCreated(newHabit)
      setRecommendations(createdHabitWithRecommendations.recommendations)
      setShowRecommendations(true)
      setTitle("")
      setDescription("")
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error("Error creating habit:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const defaultRecommendations = [
    "Sé específico con el tiempo y la frecuencia",
    "Comienza con metas pequeñas y alcanzables",
    "Vincula el hábito a una rutina existente",
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Crear Nuevo Hábito</h2>
            <p className="text-blue-100">Construye una rutina saludable</p>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 m-6 rounded-r-xl">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <p className="text-green-700 font-medium">¡Hábito creado exitosamente!</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <FormField
          label="Título del Hábito"
          type="text"
          placeholder="Ej: Beber 2 litros de agua"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          icon={Target}
        />

        <div className="space-y-2">
          <label className="block text-gray-900 text-sm font-medium">Descripción</label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <textarea
              placeholder="Describe tu hábito y cuándo planeas realizarlo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 text-base placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent hover:border-gray-300 resize-none"
            />
          </div>
        </div>

        {/* RECOMENDACIONES DINÁMICAS Y ESTÉTICAS */}
        {showRecommendations && recommendations.length > 0 ? (
          <div className="bg-blue-50 rounded-xl p-4 transition-all duration-300">
            <h4 className="text-sm font-bold text-blue-800 flex items-center mb-2">
              <Lightbulb className="inline-block w-4 h-4 mr-2 text-blue-600" />
              Sugerencias de la IA:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              {recommendations.map((rec, index) => <li key={index}>• {rec}</li>)}
            </ul>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-900 flex items-center mb-2">
              <Lightbulb className="inline-block w-4 h-4 mr-2 text-yellow-500" />
              Consejos para un buen hábito:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {defaultRecommendations.map((rec, index) => <li key={index}>• {rec}</li>)}
            </ul>
          </div>
        )}

        <Button type="submit" disabled={isLoading || !title.trim() || !description.trim()} className="h-12">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Creando hábito...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Plus className="w-4 h-4 mr-2" />
              Crear Hábito
            </div>
          )}
        </Button>
      </form>
    </div>
  )
}

export default CreateHabitForm