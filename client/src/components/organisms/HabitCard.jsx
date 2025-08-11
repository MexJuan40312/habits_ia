import { Clock, Target, Trash2 } from "lucide-react";
import React from "react";

const HabitCard = ({ habit, onDelete, index }) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: "fadeInUp 0.5s ease-out forwards",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{habit.title}</h3>
              <p className="text-sm text-gray-500">ID: {habit.id}</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">{habit.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Creado recientemente</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onDelete(habit.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Eliminar Hábito"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default HabitCard;