// client/src/components/organisms/AITextGenerator.jsx

import React, { useState } from "react";
import Button from "../atoms/Button";
import FormField from "../molecules/FormField";
import { aiService } from "../../services/api";
import { Sparkles } from "lucide-react";

const AITextGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateText = async (e) => {
    e.preventDefault();
    if (!prompt) return;

    setIsLoading(true);
    try {
      const response = await aiService.generateText(prompt);
      setGeneratedText(response.generated_text);
    } catch (error) {
      console.error("Error generating text:", error);
      setGeneratedText("Hubo un error al generar el texto. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6">
      <div className="flex items-center space-x-3 text-gray-900">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold">Generador de Texto con IA</h3>
      </div>
      <form onSubmit={handleGenerateText} className="space-y-4">
        <FormField
          label="Escribe tu prompt"
          type="text"
          placeholder="Ej: Dime 3 ideas de hábitos para mejorar la concentración"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Generando..." : "Generar Texto"}
        </Button>
      </form>
      {generatedText && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-4">
          <p className="font-semibold text-gray-900 mb-2">Resultado:</p>
          <p className="text-gray-700 whitespace-pre-wrap">{generatedText}</p>
        </div>
      )}
    </div>
  );
};

export default AITextGenerator;