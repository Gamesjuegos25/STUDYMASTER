# 📱 StudyMaster en Termux - Guía de Uso

## 🚀 Instalación y Configuración en Termux

### 1. Preparar Termux
```bash
# Actualizar paquetes
pkg update && pkg upgrade

# Instalar navegador web
pkg install lynx w3m

# Para mejor experiencia, instalar Firefox para Termux:
pkg install firefox
```

### 2. Abrir StudyMaster
```bash
# Opción 1: Con navegador de texto (básico)
lynx 1.html
w3m 1.html

# Opción 2: Con Firefox (recomendado)
firefox 1.html

# Opción 3: Abrir en navegador del sistema
am start -a android.intent.action.VIEW -d "file://$(pwd)/1.html"
```

## 📱 Optimizaciones Móviles Incluidas

### ✅ Características Específicas para Móvil:
- **Diseño Responsivo**: Se adapta automáticamente al tamaño de pantalla
- **Botones Táctiles Optimizados**: Tamaño mínimo de 44px para fácil toque
- **Sin Zoom Accidental**: Previene zoom al hacer doble tap
- **Vibración Táctil**: Feedback haptico en botones (si está disponible)
- **Orientación Inteligente**: Se adapta a vertical y horizontal
- **Rendimiento Optimizado**: Animaciones reducidas en Termux

### 🎮 Controles Táctiles:
- **Toque**: Seleccionar opciones y botones
- **Arrastrar y Soltar**: Para subir archivos de estudio
- **Gestos Suaves**: Navegación optimizada para dedos

### 🎯 Sistema de Juego Completo:
- **5 Niveles de Evaluación**: Perfect (+50pts), Correct (+20pts), Partial (+10pts), Incorrect (+2pts), Skip (+1pt)
- **Sistema de Combos**: Hasta x10 multiplicador
- **9 Tipos de Logros**: Desbloqueables con el progreso
- **Estadísticas Avanzadas**: XP, ranking, racha actual
- **Tema Rosa**: Diseño atractivo y relajante

## 🔧 Problemas Comunes y Soluciones

### Si no se ve bien en Termux:
```bash
# 1. Asegurar que tienes un navegador gráfico
pkg install firefox

# 2. Verificar que el archivo existe
ls -la 1.html

# 3. Abrir con ruta completa
firefox "$(pwd)/1.html"
```

### Si hay problemas de rendimiento:
- La app detecta automáticamente Termux y reduce animaciones
- Se optimiza el consumo de memoria
- Las transiciones son más rápidas

### Para mejor experiencia:
1. **Usar Firefox en Termux** para funcionalidad completa
2. **Rotar pantalla** para aprovechar el diseño horizontal
3. **Mantener archivos pequeños** de estudio para mejor rendimiento

## 📂 Estructura de Archivos de Estudio

### Formato TXT recomendado:
```
¿Cuál es la capital de Francia?
París

¿Qué es la fotosíntesis?
Proceso por el cual las plantas convierten luz solar en energía

¿Cuántos planetas hay en el sistema solar?
8 planetas
```

### Consejos para crear contenido:
- Una línea para pregunta, una para respuesta
- Línea en blanco entre pares pregunta-respuesta  
- Usar texto simple sin caracteres especiales
- Archivos de 50-100 preguntas funcionan mejor en móvil

## 🏆 Sistema de Logros Desbloqueables

1. **🚀 Primer Paso**: Responder primera pregunta
2. **🔥 Racha Inicial**: 5 respuestas seguidas correctas
3. **⚡ Velocista**: 10 preguntas en menos de 5 minutos
4. **🎯 Perfeccionista**: 20 evaluaciones "Perfect"
5. **📚 Estudiante Dedicado**: 50 preguntas respondidas
6. **🧠 Genio**: 100 preguntas con 80% Perfect/Correct
7. **💎 Combo Master**: Conseguir combo x10
8. **🌟 Experto**: 500 preguntas respondidas
9. **🏆 Leyenda del Estudio**: 1000 preguntas respondidas

## 💡 Consejos de Uso en Móvil

- **Mantén el teléfono cargado** durante sesiones largas
- **Usa modo horizontal** para mejor disposición de botones
- **Ajusta brillo** para estudios nocturnos
- **Activa "No molestar"** para concentrarte mejor
- **La app funciona offline** una vez cargada

¡Disfruta estudiando con StudyMaster en tu dispositivo móvil! 🎓📱