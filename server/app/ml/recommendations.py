# server/app/ml/recommendations.py

import spacy
from spacy.language import Language

nlp: Language = None

def load_spacy_model():
    """Carga el modelo de SpaCy."""
    global nlp
    try:
        nlp = spacy.load("es_core_news_sm")
    except OSError:
        print("Descargando modelo 'es_core_news_sm' de SpaCy. Esto puede tardar un momento...")
        spacy.cli.download("es_core_news_sm")
        nlp = spacy.load("es_core_news_sm")

def get_habit_recommendations(title: str, description: str) -> list[str]:
    """
    Genera recomendaciones basadas en el título y la descripción del hábito.
    """
    global nlp
    if nlp is None:
        load_spacy_model()
    
    recommendations = []
    doc_title = nlp(title.lower())
    doc_description = nlp(description.lower())

    # Regla 1: Fomentar la especificidad del hábito
    vague_keywords = ["ser", "mejorar", "trabajar en", "hacer ejercicio", "hacer"]
    if any(token.text in vague_keywords for token in doc_title) or len(title.split()) < 3:
        recommendations.append("Intenta ser más específico. Por ejemplo, en lugar de 'Hacer ejercicio', prueba con 'Caminar 30 minutos al día'.")

    # Regla 2: Analizar la descripción para sugerir detalles
    if len(description.split()) < 5:
        recommendations.append("Considera añadir más detalles a la descripción, como la frecuencia (ej. 'todos los días') o el momento (ej. 'por las mañanas').")

    # Regla 3: Identificar hábitos potencialmente poco saludables o irrealistas
    extreme_patterns = [
        ("correr", ["100 km", "maratón todos los días"]),
        ("levantar", ["200 kg"]),
        ("ayuno", ["7 días"])
    ]
    for keyword, phrases in extreme_patterns:
        if keyword in doc_description.text:
            for phrase in phrases:
                if phrase in doc_description.text:
                    recommendations.append("Parece una meta muy ambiciosa. Considera empezar con un objetivo más pequeño y alcanzable para evitar el agotamiento.")
                    break

    # Regla 4: Recomendaciones positivas (si el hábito es bueno)
    positive_keywords = ["meditar", "leer", "agua", "estirar", "agradecer"]
    if not recommendations: # Solo añade recomendaciones positivas si no hay otras críticas
        for token in doc_title:
            if token.text in positive_keywords:
                recommendations.append(f"¡Excelente elección! Mantener este hábito te ayudará a mejorar tu {token.text} y bienestar general.")
                break

    return recommendations