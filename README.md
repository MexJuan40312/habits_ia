# ANALIZADOR DE HÁBITOS CON IA #

# Descripción del Proyecto
Este proyecto es una aplicación web que permite a los usuarios registrar sus actividades diarias. El sistema, utilizando técnicas de Machine Learning, analiza estos datos para detectar patrones de comportamiento, identificar horas más productivas, y momentos de mayor estrés. Con base en este análisis, la aplicación sugiere mejoras personalizadas para optimizar la rutina diaria del usuario.

# Arquitectura
El proyecto se divide en dos componentes principales: un Backend construido con FastAPI y un Frontend desarrollado con React.

# Backend
-  Tecnologías: Python 3.9+, FastAPI, SQLAlchemy, Uvicorn.
-  Base de Datos: SQLite (configurable para otras bases de datos como PostgreSQL).
-  Arquitectura: Sigue un patrón similar a MVC, separando la lógica en modelos (`db/models`), controladores de endpoints (`api/endpoints`) y servicios de negocio (`ml/services`).
-  ML: El módulo de Machine Learning (`ml/`) está desacoplado del resto de la API para facilitar su mantenimiento y escalabilidad.

# Frontend
-  Tecnologías: React, Vite, Tailwind CSS.
-  Arquitectura: Implementa Atomic Design para organizar los componentes de la interfaz de usuario en `atoms`, `molecules`, `organisms` y `templates`, lo que asegura la reutilización y consistencia del diseño.
-  Estilos: Se utilizan clases de Tailwind CSS para un desarrollo rápido y un diseño responsive.

# ----------------------------- Configuración y Ejecución ------------------------- #

# Backend
1.  Navega a la carpeta `server/`:
    cd server

2.  Crea y activa el entorno virtual:
    python -m venv venv
    source venv/bin/activate  # macOS/Linux
    venv\Scripts\activate      # Windows

3.  Instala las dependencias:
    pip install -r requirements.txt
    
4.  Crea el archivo `.env` en la raíz de `server/` y añade las variables de entorno necesarias (por ejemplo, la URL de la base de datos).

5.  Inicia el servidor:
    uvicorn app.main:app --reload

    "El servidor se ejecutará en `http://localhost:8000`."

# Frontend
1.  Navega a la carpeta `client/`:
    cd client

2.  Instala las dependencias:
    npm install

3.  Inicia el servidor de desarrollo:
    npm run dev

    "La aplicación estará disponible en `http://localhost:5173`."

---

# --------------------------------- Actualizar Repositorio y Rama `main` --------------------------------- #

Para actualizar tu repositorio local y subir los cambios a la rama `main` en GitHub, sigue estos pasos desde la **raíz de tu proyecto (`my-project/`)**:

1.  Asegúrate de que no haya cambios sin commitear. Utiliza `git status` para verificarlo.

2.  Agrega los nuevos archivos y carpetas a tu staging area.
    git add .
    
3.  Realiza un commit con un mensaje descriptivo
    git commit -m "feat: Inicializa la estructura del proyecto con FastAPI, React y Atomic Design."

4.  Sube los cambios a tu rama `main` en GitHub.
    git push origin main
    
    
