# server/app/api/v1/endpoints/ai_gen.py

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import os
import google.generativeai as genai
from dotenv import load_dotenv # Importa la función para cargar el .env

# Cargar las variables de entorno del archivo .env
# Nota: La mejor práctica es hacer esto en un archivo central como main.py,
# pero lo ponemos aquí para asegurar que funcione en este endpoint.
load_dotenv()

# Cargar la clave de API desde el entorno para seguridad
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Inicializa el modelo de IA que usaremos.
# 'gemini-1.5-flash' es ideal para este tipo de tareas.
model = genai.GenerativeModel('gemini-1.5-flash')

router = APIRouter()

# Esquema para el cuerpo de la solicitud
class PromptRequest(BaseModel):
    prompt: str

# Esquema para la respuesta
class TextResponse(BaseModel):
    generated_text: str

@router.post("/generate_text/", response_model=TextResponse)
def generate_text_from_prompt(request: PromptRequest):
    """
    Genera texto a partir de un prompt utilizando la API de Gemini.
    """
    if not request.prompt:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El prompt no puede estar vacío."
        )

    try:
        # Usa el método síncrono 'generate_content' para una llamada simple.
        # No es necesario que la función del endpoint sea 'async' si no usas await.
        response = model.generate_content(request.prompt)
        generated_text = response.text
        return TextResponse(generated_text=generated_text)
    except Exception as e:
        print(f"Error al llamar a la API de Gemini: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error en el servidor al generar el texto."
        )
