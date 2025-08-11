# server/app/ml/recommendations.py

import spacy
from spacy.language import Language
from typing import List, Dict

nlp: Language = None

def load_spacy_model():
    """
    Carga el modelo de SpaCy. Si no está instalado, lo descarga automáticamente.
    """
    global nlp
    try:
        # Se usa un modelo más grande para mejor precisión
        nlp = spacy.load("es_core_news_md") 
    except OSError:
        print("Descargando modelo 'es_core_news_md' de SpaCy. Esto puede tardar un momento...")
        spacy.cli.download("es_core_news_md")
        nlp = spacy.load("es_core_news_md")

def get_habit_recommendations(title: str, description: str) -> List[str]:
    """
    Genera recomendaciones de IA, ahora con un análisis más sofisticado
    de la intención y saludabilidad del hábito usando NLP.
    """
    global nlp
    if nlp is None:
        load_spacy_model()
    
    recommendations = []
    text_to_analyze = (title + " " + description).lower()
    doc = nlp(text_to_analyze)

    # 1. Detección de intenciones y categorías de hábitos (NLP avanzado)
    unhealthy_keywords = ["chatarra", "chicharrones", "comida rápida", "azúcar", "alcohol", "fumar", "ver televisión", "estar en el celular"]
    ambitious_keywords = ["maratón", "50 flexiones", "2 horas", "100 páginas", "todos los días", "diario"]

    is_unhealthy = any(keyword in text_to_analyze for keyword in unhealthy_keywords)
    is_ambitious = any(keyword in text_to_analyze for keyword in ambitious_keywords)

    # Detección de métricas numéricas
    has_numerical_metric = any(token.like_num for token in doc)
    
    # --- Lógica de Recomendaciones (Priorizada) ---

    # Si se detecta un hábito perjudicial
    if is_unhealthy:
        if "televisión" in text_to_analyze or "celular" in text_to_analyze:
            recommendations.append("La IA ha detectado un hábito sedentario. Para mejorar tu rutina, intenta reemplazarlo con una actividad física o mental, como 'leer un libro' o 'salir a caminar'.")
        elif "chatarra" in text_to_analyze or "chicharrones" in text_to_analyze:
            recommendations.append("Este hábito no es beneficioso para tu salud. ¿Qué tal si lo sustituyes por algo saludable, como 'comer una fruta' o 'preparar una ensalada'?")
        else:
            recommendations.append("La IA sugiere que este hábito podría ser perjudicial. Considera reemplazarlo con una alternativa más saludable.")
        return recommendations
        
    # Si el hábito es positivo pero demasiado ambicioso
    if is_ambitious:
        recommendations.append("¡Gran entusiasmo! Sin embargo, la IA recomienda empezar con metas más pequeñas y alcanzables para asegurar la consistencia y evitar el agotamiento.")
        
    # Si el hábito es positivo pero le falta una métrica
    if not has_numerical_metric:
        if "beber agua" in text_to_analyze:
            recommendations.append("Tu hábito es excelente. La IA sugiere hacerlo medible. ¿Cuántos litros o vasos de agua quieres beber?")
        elif not recommendations: # No se ha añadido otra recomendación
            recommendations.append("Para maximizar el éxito, la IA recomienda añadir una métrica. Define 'cuánto' o 'cuántas veces' realizarás este hábito.")

    # Si el hábito es positivo y le falta un anclaje de tiempo
    time_related_words = ["mañana", "tarde", "noche", "después de", "antes de", "a las"]
    if not any(word in text_to_analyze for word in time_related_words) and not recommendations:
        recommendations.append("La IA sugiere conectar este hábito a una rutina existente para consolidarlo. Por ejemplo, 'meditar después de beber tu café de la mañana'.")
        
    # Mensaje final si no hay recomendaciones de mejora
    if not recommendations:
        recommendations.append("¡Excelente hábito! La IA ha analizado tu intención y sugiere que vas por buen camino. Sigue así, la consistencia es clave.")
        
    return recommendations