# 📚 Aplicación de Estudio - Preguntas y Respuestas

Una aplicación simple y efectiva para estudiar usando archivos de texto con preguntas y respuestas.

## 🚀 Características

- ✅ Carga preguntas desde archivos .txt
- ✅ **Sistema de evaluación**: Marca respuestas como correctas/incorrectas
- ✅ **Estadísticas detalladas**: Precisión, correctas, incorrectas
- ✅ Progreso visual y estadísticas avanzadas
- ✅ Mezclar preguntas aleatoriamente
- ✅ Marcar preguntas difíciles
- ✅ **Filtros de estudio**: Solo incorrectas, difíciles o sin responder
- ✅ **Guardado automático** de progreso y resultados
- ✅ Navegación con teclado
- ✅ **Reportes finales** con estadísticas de precisión

## 📋 Formato del Archivo

El archivo .txt debe tener este formato:

```
¿Cuál es la capital de Francia?
París

¿Qué es HTML?
HyperText Markup Language

¿Cuántos continentes hay?
7 continentes
```

- Una línea para la pregunta
- Siguiente línea para la respuesta  
- Línea vacía para separar cada par pregunta-respuesta

## 🌐 Versión Web (HTML) - RECOMENDADA

### Cómo usar:
1. Abre el archivo `1.html` en tu navegador web
2. Haz clic en "Selecciona un archivo .txt"
3. Carga tu archivo con preguntas (puedes usar `preguntas_ejemplo.txt`)
4. Haz clic en "🎯 Comenzar Estudio"

### Controles:
- **Espacebar/Enter**: Mostrar respuesta o siguiente pregunta
- **←/→**: Navegar entre preguntas
- **S**: Mezclar preguntas
- **Botones**: Usar los botones en pantalla

### Funciones:
- 📊 Barra de progreso visual
- 🔀 Mezclar preguntas aleatoriamente
- ⭐ Marcar preguntas difíciles
- 🔄 Reiniciar progreso
- 📱 Funciona en móvil y escritorio

## 🐍 Versión Python (Terminal)

### Cómo usar:
1. Abre PowerShell en la carpeta del proyecto
2. Ejecuta: `python main.py`
3. Sigue las instrucciones en pantalla

### Controles:
- **Enter**: Mostrar respuesta o siguiente pregunta
- **a**: Pregunta anterior
- **d**: Marcar/desmarcar como difícil
- **q**: Salir del estudio

### Funciones:
- 📊 Barra de progreso ASCII
- 🔀 Mezclar preguntas
- ⭐ Lista de preguntas difíciles
- 🔄 Reiniciar progreso
- 📁 Cargar múltiples archivos

## 📁 Archivos Incluidos

- `1.html` - Aplicación web completa
- `main.py` - Aplicación de terminal en Python
- `preguntas_ejemplo.txt` - Archivo de ejemplo con 10 preguntas  
- `ejemplo_progreso.json` - Ejemplo de archivo de progreso exportado
- `README.md` - Este archivo de instrucciones

## 🎯 Consejos de Uso

1. **Crea tus archivos .txt** con las preguntas que quieras estudiar
2. **Usa la versión web** para una experiencia más visual
3. **Mezcla las preguntas** para estudiar en orden aleatorio
4. **Marca las difíciles** para repasarlas después
5. **Usa atajos de teclado** para estudiar más rápido

## 💾 **Sistema de Progreso Guardado**

### 🔄 **Guardado Automático**
- ✅ **Guardado automático**: Tu progreso se guarda cada vez que avanzas
- ✅ **Guardado periódico**: Se guarda automáticamente cada 30 segundos
- ✅ **Recuperación inteligente**: Al recargar las mismas preguntas, recupera tu progreso
- ✅ **Verificación de integridad**: Solo carga el progreso si las preguntas coinciden

### 📁 **Gestión de Progreso**
- **💾 Guardar Progreso**: Guarda manualmente tu progreso actual
- **📁 Cargar Progreso**: Carga un archivo de progreso exportado
- **📤 Exportar Progreso**: Descarga tu progreso como archivo JSON
- **🔄 Reiniciar**: Borra todo el progreso (con confirmación)

### 📊 **Qué se Guarda**
- ✅ Pregunta actual donde te quedaste
- ✅ Preguntas marcadas como difíciles
- ✅ **Resultados de cada pregunta** (correcta/incorrecta/saltada)
- ✅ **Estadísticas completas** (precisión, total respondidas, etc.)
- ✅ Fecha y hora del guardado
- ✅ Verificación de que las preguntas son las mismas

## 📈 **Sistema de Evaluación**

### ✅❌ **Calificación de Respuestas**
Después de ver cada respuesta, puedes marcar si tu respuesta mental fue:
- **✅ Correcta**: Sabías la respuesta correcta
- **❌ Incorrecta**: No sabías o te equivocaste
- **⏭️ Saltar**: No evaluar esta pregunta

### 📊 **Estadísticas Inteligentes**
- **Precisión en tiempo real**: Porcentaje de aciertos
- **Contador de correctas/incorrectas**: Seguimiento detallado
- **Indicadores visuales**: ✅❌⏭️ en preguntas ya respondidas
- **Reporte final**: Estadísticas completas al terminar

### 🎯 **Filtros de Estudio**
- **❌ Solo Incorrectas**: Estudia solo las que te equivocaste
- **⭐ Solo Difíciles**: Enfócate en las marcadas como difíciles
- **❓ Sin Responder**: Completa las que faltan por evaluar

### 💻 **Dónde se Guarda**
- **LocalStorage del navegador**: Guardado automático local
- **Archivos JSON**: Exporta para backup o transferir entre dispositivos
- **Compatible**: Funciona en cualquier navegador moderno

## ✨ Ejemplo de Sesión de Estudio

1. Abre `1.html` en el navegador
2. Carga `preguntas_ejemplo.txt`
3. **Tu progreso anterior se carga automáticamente** 📚
4. Haz clic en "Comenzar Estudio"
5. Lee la pregunta y piensa la respuesta
6. Presiona Espacebar para ver la respuesta
7. Presiona Espaciar de nuevo para la siguiente pregunta
8. Si una pregunta es difícil, márcala con el botón ⭐
9. **Tu progreso se guarda automáticamente** 💾
10. Puedes cerrar y volver más tarde - continuarás donde lo dejaste

## 🔧 Requisitos

### Versión Web:
- Cualquier navegador web moderno
- No requiere instalación

### Versión Python:
- Python 3.x instalado
- No requiere librerías adicionales

## 🆘 Resolución de Problemas

**Problema**: Las preguntas no se cargan
- **Solución**: Verifica que el archivo .txt tenga el formato correcto (pregunta, respuesta, línea vacía)

**Problema**: Los caracteres especiales no se ven bien
- **Solución**: Guarda el archivo .txt con codificación UTF-8

**Problema**: La aplicación Python no inicia
- **Solución**: Asegúrate de tener Python instalado y ejecuta desde PowerShell

---

¡Listo para estudiar! 📖✨

## ☁️ Despliegue en Netlify

Puedes desplegar esta versión web directamente en Netlify (sitio estático). Recomendado si quieres una URL pública rápida.

Pasos rápidos:

- 1) Conecta tu repositorio en Netlify (o haz drag & drop del ZIP en app.netlify.com).
- 2) No necesitas comando de build (deja `Build command` vacío).
- 3) Establece `Publish directory` en `.` (raíz del repo). Ya incluimos `netlify.toml`.
- 4) El archivo `1.html` se sirve como entrada principal gracias a la redirección configurada.

Notas:
- Si prefieres mantener la lógica Python (`main.py`), despliega el backend en otra plataforma (Heroku, Render, Railway) y deja la versión web estática en Netlify.
- El contenido está en español; no es necesario cambiar el idioma para Netlify.
