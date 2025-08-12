// client/src/pages/HabitsPage.jsx

import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { habitsService } from "../services/api";
import CreateHabitForm from "../components/organisms/CreateHabitForm";
import HabitCard from "../components/organisms/HabitCard";
import { LogOut, Target, Calendar, Plus, TrendingUp } from "lucide-react";
import AITextGenerator from "../components/organisms/AITextGenerator";

const HabitsPage = () => {
  const { user, token, logout } = useAuth();
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHabits = async () => {
    if (!user || !token) {
      setIsLoading(false);
      return;
    }
    try {
      const userHabits = await habitsService.getHabits();
      setHabits(userHabits);
    } catch (err) {
      console.error("Error al obtener los hábitos:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [user, token]);

  const handleCreateHabit = async (newHabit) => {
    try {
      const createdHabitWithRecommendations = await habitsService.createHabit({ ...newHabit, owner_id: user.id });
      setHabits([...habits, createdHabitWithRecommendations]);
      return createdHabitWithRecommendations;
    } catch (err) {
      console.error("Error al crear el hábito:", err);
      return Promise.reject(err);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este hábito?")) {
      return;
    }
    try {
      await habitsService.deleteHabit(habitId);
      setHabits(habits.filter(habit => habit.id !== habitId));
      console.log(`Hábito con ID ${habitId} eliminado.`);
    } catch (err) {
      console.error("Error al eliminar el hábito:", err);
      setError("No se pudo eliminar el hábito. Inténtalo de nuevo.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Cargando tus hábitos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchHabits}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mis Hábitos</h1>
                <p className="text-sm text-gray-500">Hola, {user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Hábitos</p>
                <p className="text-2xl font-bold text-gray-900">{habits.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Esta Semana</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progreso</p>
                <p className="text-2xl font-bold text-gray-900">0%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Tus Hábitos</h2>
              {habits.length > 0 && (
                <span className="text-sm text-gray-500">
                  {habits.length} hábito{habits.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            {habits.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes hábitos aún</h3>
                <p className="text-gray-500 mb-6">
                  Comienza creando tu primer hábito para empezar a construir una rutina saludable.
                </p>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {habits.map((habit, index) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onDelete={handleDeleteHabit}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="lg:sticky lg:top-24 lg:self-start space-y-8">
            <CreateHabitForm onHabitCreated={handleCreateHabit} />
            <AITextGenerator />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HabitsPage;