// Variables del juego
let gameData = {
    level: 1,
    points: 0,
    experience: 0,
    streak: 0,
    maxStreak: 0,
    lives: 5,
    maxLives: 5,
    combo: 1,
    comboCount: 0,
    maxCombo: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    partialAnswers: 0,
    perfectAnswers: 0,
    skippedAnswers: 0,
    achievements: [],
    sessionStartTime: null
};

let questions = [];
let currentIndex = 0;
let answerVisible = false;
let isProcessingFile = false;
let questionEvaluated = false;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadGameData();
    updateGameStats();
    setupFileUpload();
    autoLoadQuestions(); // Cargar preguntas automáticamente
});

// Sistema de archivos
function setupFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const fileUpload = document.getElementById('fileUpload');

    console.log('🔧 Configurando subida de archivos...');

    if (!fileInput || !fileUpload) {
        console.error('❌ No se encontraron los elementos de archivo');
        return;
    }

    fileUpload.addEventListener('click', (e) => {
        console.log('📁 Click en área de subida');
        isProcessingFile = false; // Resetear para permitir nueva carga
        fileInput.click();
    });
    
    fileInput.addEventListener('change', (e) => {
        console.log('📄 Archivo seleccionado:', e.target.files);
        isProcessingFile = false; // Resetear antes del procesamiento
        handleFileSelect(e);
    });
    
    // Drag & Drop
    fileUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUpload.style.transform = 'translateY(-3px) scale(1.02)';
    });
    
    fileUpload.addEventListener('dragleave', () => {
        fileUpload.style.transform = '';
    });
    
    fileUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUpload.style.transform = '';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
}

// Cargar automáticamente el archivo estudioBD.txt
function autoLoadQuestions() {
    console.log('🔄 Cargando preguntas automáticamente...');
    
    // Intentar cargar el archivo estudioBD.txt usando fetch
    fetch('./estudioBD.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar estudioBD.txt');
            }
            return response.text();
        })
        .then(content => {
            console.log('✅ Archivo estudioBD.txt cargado exitosamente');
            console.log('📄 Contenido:', content.substring(0, 100) + '...');
            
            questions = parseQuestions(content);
            console.log('❓ Preguntas parseadas:', questions.length);
            
            if (questions.length > 0) {
                // Ocultar área de carga y mostrar botón para empezar
                document.getElementById('fileUpload').style.display = 'none';
                showStartButton();
            } else {
                console.log('⚠️ No se encontraron preguntas válidas, mostrando carga manual');
            }
        })
        .catch(error => {
            console.log('❌ Error cargando archivo automático:', error);
            console.log('📁 Mostrando interfaz de carga manual');
            // Si falla la carga automática, mostrar interfaz normal
        });
}

function showStartButton() {
    const fileUpload = document.getElementById('fileUpload');
    const startArea = document.getElementById('startArea');

    // Renderizar botón de inicio en el área superior
    startArea.innerHTML = `
        <div class="start-area">
            <button class="start-btn" onclick="startStudySession()">🚀 ¡Comenzar Estudio! (${questions.length})</button>
        </div>
        <div style="text-align:center; margin-top:8px; color:#666;">📚 ${questions.length} preguntas cargadas</div>
        
    `;

    startArea.style.display = 'block';
    fileUpload.style.display = 'none';
}

function showManualUpload() {
    location.reload(); // Recargar para mostrar interfaz original
}

function handleFileSelect(event) {
    console.log('📂 HandleFileSelect ejecutado');
    console.log('event:', event);
    console.log('files:', event.target.files);
    
    const file = event.target.files[0];
    if (file) {
        console.log('📄 Archivo encontrado:', file.name, file.size, 'bytes');
        handleFile(file);
    } else {
        console.log('❌ No hay archivo seleccionado');
    }
}

function handleFile(file) {
    console.log('🔍 Procesando archivo:', file.name);
    
    // Evitar procesamiento doble
    if (isProcessingFile) {
        console.log('⚠️ Ya se está procesando un archivo, ignorando...');
        return;
    }
    
    if (!file.name.endsWith('.txt')) {
        console.log('❌ Archivo no es .txt');
        showMessage('❌ Por favor selecciona un archivo .txt', 'error');
        isProcessingFile = false; // Resetear si archivo inválido
        return;
    }

    console.log('✅ Archivo .txt válido, leyendo contenido...');
    isProcessingFile = true; // Marcar como en proceso
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        console.log('📖 Contenido leído, longitud:', e.target.result.length);
        const content = e.target.result;
        questions = parseQuestions(content);
        console.log('❓ Preguntas parseadas:', questions.length);
        
        if (questions.length > 0) {
            // Mostrar el botón de inicio en lugar de arrancar la sesión automáticamente
            showStartButton();
        } else {
            isProcessingFile = false; // Resetear si no hay preguntas
        }
    };
    
    reader.onerror = function(e) {
        console.error('❌ Error leyendo archivo:', e);
        showMessage('❌ Error leyendo el archivo', 'error');
        isProcessingFile = false; // Resetear en caso de error
    };
    
    reader.readAsText(file, 'UTF-8');
}

function parseQuestions(text) {
    console.log('🔧 Parseando texto...');
    
    if (!text || text.trim().length === 0) {
        console.log('❌ Texto vacío');
        showMessage('❌ El archivo está vacío', 'error');
        return [];
    }

    // Dividir por líneas y limpiar
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
    console.log('📝 Líneas encontradas:', lines.length);
    console.log('Primeras 5 líneas:', lines.slice(0, 5));
    
    const parsedQuestions = [];
    
    // Intentar diferentes métodos de parseo
    if (lines.length % 2 === 0) {
        // Método 1: Pregunta-respuesta alternadas
        for (let i = 0; i < lines.length; i += 2) {
            if (i + 1 < lines.length) {
                parsedQuestions.push({
                    question: lines[i],
                    answer: lines[i + 1]
                });
            }
        }
    } else {
        // Método 2: Buscar patrones de pregunta (con ?)
        let currentQuestion = '';
        let currentAnswer = '';
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line.includes('?') || line.toLowerCase().startsWith('qué') || 
                line.toLowerCase().startsWith('cuál') || line.toLowerCase().startsWith('cómo')) {
                // Es una pregunta
                if (currentQuestion && currentAnswer) {
                    parsedQuestions.push({
                        question: currentQuestion,
                        answer: currentAnswer
                    });
                }
                currentQuestion = line;
                currentAnswer = '';
            } else {
                // Es una respuesta
                if (currentAnswer) {
                    currentAnswer += ' ' + line;
                } else {
                    currentAnswer = line;
                }
            }
        }
        
        // Agregar la última pregunta-respuesta
        if (currentQuestion && currentAnswer) {
            parsedQuestions.push({
                question: currentQuestion,
                answer: currentAnswer
            });
        }
    }
    
    console.log('✅ Preguntas parseadas:', parsedQuestions.length);
    if (parsedQuestions.length === 0) {
        showMessage('❌ No se encontraron preguntas válidas en el archivo', 'error');
    }
    
    return parsedQuestions;
}

function startStudySession() {
    if (questions.length === 0) {
        showMessage('❌ No se encontraron preguntas válidas', 'error');
        isProcessingFile = false; // Resetear si no hay preguntas
        return;
    }

    gameData.sessionStartTime = new Date();
    currentIndex = 0;
    answerVisible = false;
    isProcessingFile = false; // Procesamiento completado exitosamente
    
    document.getElementById('fileUpload').style.display = 'none';
    const startArea = document.getElementById('startArea');
    if (startArea) { startArea.innerHTML = ''; startArea.style.display = 'none'; }
    document.getElementById('progressContainer').style.display = 'block';
    document.getElementById('questionCard').style.display = 'block';
    
    showQuestion();
    showMessage(`📚 ¡${questions.length} preguntas cargadas!`, 'success');
    
    // Resetear input para evitar eventos duplicados
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = '';
}

function showQuestion() {
    if (currentIndex >= questions.length) {
        endSession();
        return;
    }

    const question = questions[currentIndex];
    document.getElementById('questionNumber').textContent = `Pregunta ${currentIndex + 1} de ${questions.length}`;
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('answerText').style.display = 'none';
    document.getElementById('evaluationButtons').style.display = 'none';
    document.getElementById('showAnswerBtn').style.display = 'inline-block';
    document.getElementById('nextBtn').style.display = 'none';
    
    answerVisible = false;
    questionEvaluated = false; // Resetear para nueva pregunta
    updateProgress();
}

function showAnswer() {
    const question = questions[currentIndex];
    document.getElementById('answerText').textContent = question.answer;
    document.getElementById('answerText').style.display = 'block';
    document.getElementById('evaluationButtons').style.display = 'flex';
    document.getElementById('showAnswerBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'inline-block';
    
    answerVisible = true;
}

function evaluateAnswer(evaluation) {
    // Prevenir evaluaciones múltiples de la misma pregunta
    if (questionEvaluated) {
        showMessage('⚠️ Esta pregunta ya fue evaluada', 'warning');
        return;
    }
    
    // Validar que la respuesta esté visible antes de evaluar
    if (!answerVisible) {
        showMessage('❌ Primero debes ver la respuesta', 'error');
        return;
    }
    
    let basePoints = 0;
    let experience = 0;
    let message = '';
    
    // Sistema progresivo: los puntos aumentan con el nivel
    const levelMultiplier = 1 + (gameData.level - 1) * 0.2; // +20% por nivel

    switch(evaluation) {
        case 'perfect':
            basePoints = Math.floor(50 * levelMultiplier);
            experience = Math.floor(25 * levelMultiplier);
            gameData.perfectAnswers++;
            gameData.streak++;
            gameData.comboCount++;
            message = `Perfect +${basePoints} pts ⭐`;
            break;
            
        case true:
            basePoints = Math.floor(20 * levelMultiplier);
            experience = Math.floor(10 * levelMultiplier);
            gameData.correctAnswers++;
            gameData.streak++;
            gameData.comboCount++;
            message = `Correcto +${basePoints} pts ✅`;
            break;
            
        case 'partial':
            basePoints = Math.floor(10 * levelMultiplier);
            experience = Math.floor(5 * levelMultiplier);
            gameData.partialAnswers++;
            gameData.streak++;
            gameData.comboCount++;
            message = `Parcial +${basePoints} pts ⚡`;
            break;
            
        case false:
            basePoints = -10;
            experience = 0;
            gameData.incorrectAnswers++;
            gameData.streak = 0;
            gameData.comboCount = 0; // Romper combo
            gameData.lives--; // Perder vida
            message = `Incorrecto -10 pts 😢 (Vida perdida)`;
            break;
            
        case 'skip':
            basePoints = -5;
            experience = 0;
            gameData.skippedAnswers++;
            gameData.streak = Math.max(0, gameData.streak - 1);
            gameData.comboCount = 0; // Romper combo
            message = `Saltado -5 pts ⏭️`;
            break;
            
        case 'no_recuerdo':
            basePoints = -50;
            experience = 0;
            gameData.incorrectAnswers++;
            gameData.streak = 0;
            gameData.comboCount = 0; // Romper combo
            gameData.lives -= 2; // Perder 2 vidas por no recordar
            message = `No Recuerdo -50 pts 😵 (2 Vidas perdidas)`;
            break;
    }

    // Aplicar multiplicador de combo para respuestas positivas
    let finalPoints = basePoints;
    if (basePoints > 0 && gameData.comboCount > 1) {
        const comboMultiplier = Math.min(1 + (gameData.comboCount * 0.1), 3); // Máximo x3
        finalPoints = Math.floor(basePoints * comboMultiplier);
        message += ` (Combo x${comboMultiplier.toFixed(1)})`;
    }

    // Asegurar que los puntos no sean negativos
    gameData.points = Math.max(0, gameData.points + finalPoints);
    gameData.experience += experience;
    gameData.totalQuestions++;
    gameData.maxStreak = Math.max(gameData.maxStreak, gameData.streak);
    gameData.maxCombo = Math.max(gameData.maxCombo, gameData.comboCount);

    // Asegurar que las vidas no sean negativas
    gameData.lives = Math.max(0, gameData.lives);

    // Verificar Game Over
    if (gameData.lives <= 0) {
        showMessage('💀 GAME OVER - ¡No tienes más vidas!', 'error');
        setTimeout(() => {
            if (confirm('💀 GAME OVER\n\n¿Quieres reiniciar y obtener 5 vidas nuevas?')) {
                gameData.lives = 5;
                gameData.points = Math.floor(gameData.points * 0.5); // Perder 50% de puntos
                showMessage('🔄 Reiniciado con 5 vidas. Perdiste 50% de tus puntos.', 'info');
                updateGameStats();
                saveGameData();
            } else {
                endSession();
                return;
            }
        }, 1000);
    }

    // Verificar level up
    let experienceNeeded = gameData.level * 50;
    if (gameData.experience >= experienceNeeded) {
        gameData.level++;
        gameData.experience -= experienceNeeded;
        // Recuperar 1 vida al subir de nivel (máximo 5)
        if (gameData.lives < gameData.maxLives) {
            gameData.lives++;
            showMessage(`🎉 ¡Nivel ${gameData.level}! +1 Vida recuperada ❤️`, 'success');
        } else {
            showMessage(`🎉 ¡Subiste al nivel ${gameData.level}!`, 'success');
        }
    }

    showMessage(message, basePoints >= 0 ? 'success' : 'error');
    
    // Marcar pregunta como evaluada y ocultar botones
    questionEvaluated = true;
    document.getElementById('evaluationButtons').style.display = 'none';
    
    updateGameStats();
    updateComboIndicator();
    saveGameData();
    
    setTimeout(() => {
        nextQuestion();
    }, 1500);
}

function nextQuestion() {
    currentIndex++;
    showQuestion();
}

function endSession() {
    const totalCorrect = gameData.correctAnswers + gameData.perfectAnswers + gameData.partialAnswers;
    const accuracy = Math.round((totalCorrect / gameData.totalQuestions) * 100);
    
    showMessage(`🎓 ¡Sesión completada! Precisión: ${accuracy}%`, 'success');
    
    // Ocultar tarjeta de pregunta y mostrar area de carga
    document.getElementById('questionCard').style.display = 'none';
    document.getElementById('progressContainer').style.display = 'none';
    document.getElementById('fileUpload').style.display = 'block';
    const startArea = document.getElementById('startArea');
    if (startArea) startArea.style.display = 'none';
    
    // Reiniciar para nueva sesión
    questions = [];
    currentIndex = 0;
    isProcessingFile = false; // Permitir cargar nuevo archivo
}

function updateGameStats() {
    // Asegurar que los puntos no sean NaN
    const points = isNaN(gameData.points) ? 0 : gameData.points;
    document.getElementById('pointsDisplay').textContent = points.toLocaleString();
    
    document.getElementById('levelDisplay').textContent = gameData.level;
    document.getElementById('streakDisplay').textContent = gameData.streak;
    
    // Actualizar vidas
    document.getElementById('livesDisplay').textContent = gameData.lives;
    
    // Mostrar vidas visualmente
    let livesVisual = '';
    for (let i = 0; i < gameData.maxLives; i++) {
        if (i < gameData.lives) {
            livesVisual += '❤️';
        } else {
            livesVisual += '🖤'; // Corazón vacío para vidas perdidas
        }
    }
    document.getElementById('livesVisual').textContent = livesVisual;
    
    const totalCorrect = gameData.correctAnswers + gameData.perfectAnswers + gameData.partialAnswers;
    const accuracy = gameData.totalQuestions > 0 ? 
        Math.round((totalCorrect / gameData.totalQuestions) * 100) : 0;
    document.getElementById('accuracyDisplay').textContent = accuracy + '%';
}

function updateProgress() {
    if (questions.length === 0) return;
    
    const progress = ((currentIndex + 1) / questions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

function updateComboIndicator() {
    const comboIndicator = document.getElementById('comboIndicator');
    const comboMultiplier = document.getElementById('comboMultiplier');
    
    if (gameData.comboCount > 1) {
        const multiplier = Math.min(1 + (gameData.comboCount * 0.1), 3);
        comboIndicator.style.display = 'block';
        comboMultiplier.textContent = multiplier.toFixed(1);
    } else {
        comboIndicator.style.display = 'none';
    }
}

function saveGameData() {
    // Validar datos antes de guardar
    if (isNaN(gameData.points)) gameData.points = 0;
    if (isNaN(gameData.experience)) gameData.experience = 0;
    if (isNaN(gameData.level)) gameData.level = 1;
    if (isNaN(gameData.streak)) gameData.streak = 0;
    if (isNaN(gameData.lives)) gameData.lives = 5;
    if (isNaN(gameData.maxLives)) gameData.maxLives = 5;
    
    try {
        localStorage.setItem('studymaster_game_data', JSON.stringify(gameData));
    } catch (e) {
        console.log('Error guardando datos:', e);
    }
}

function loadGameData() {
    const saved = localStorage.getItem('studymaster_game_data');
    if (saved) {
        try {
            const loadedData = JSON.parse(saved);
            gameData = { ...gameData, ...loadedData };
            
            // Validar y corregir valores NaN
            gameData.points = isNaN(gameData.points) ? 0 : gameData.points;
            gameData.experience = isNaN(gameData.experience) ? 0 : gameData.experience;
            gameData.level = isNaN(gameData.level) ? 1 : gameData.level;
            gameData.streak = isNaN(gameData.streak) ? 0 : gameData.streak;
            gameData.lives = isNaN(gameData.lives) ? 5 : gameData.lives;
            gameData.maxLives = isNaN(gameData.maxLives) ? 5 : gameData.maxLives;
            gameData.comboCount = isNaN(gameData.comboCount) ? 0 : gameData.comboCount;
        } catch (e) {
            // Si hay error, reiniciar datos
            gameData.points = 0;
            gameData.experience = 0;
            gameData.level = 1;
        }
    }
}

// Sistema de Reinicio
function showResetConfirmation() {
    const modal = document.createElement('div');
    modal.className = 'reset-modal';
    modal.innerHTML = `
        <div class="reset-modal-content">
            <h3>⚠️ Confirmar Reinicio</h3>
            <p>¿Estás seguro de que quieres reiniciar todo tu progreso?</p>
            <p><strong>Se perderán:</strong><br>
            • Todos los puntos (${gameData.points})<br>
            • Nivel ${gameData.level} y experiencia<br>
            • Estadísticas y rachas</p>
            <div class="reset-modal-buttons">
                <button class="confirm-btn" onclick="confirmReset()">
                    🗑️ Sí, Reiniciar
                </button>
                <button class="cancel-btn" onclick="cancelReset()">
                    ❌ Cancelar
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function confirmReset() {
    // Reiniciar todos los datos
    gameData = {
        level: 1,
        points: 0,
        experience: 0,
        streak: 0,
        maxStreak: 0,
        lives: 5,
        maxLives: 5,
        combo: 1,
        comboCount: 0,
        maxCombo: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        partialAnswers: 0,
        perfectAnswers: 0,
        skippedAnswers: 0,
        achievements: [],
        sessionStartTime: new Date()
    };
    
    localStorage.removeItem('studymaster_game_data');
    updateGameStats();
    cancelReset();
    showMessage('🔄 Progreso reiniciado completamente', 'success');
}

function cancelReset() {
    const modal = document.querySelector('.reset-modal');
    if (modal) modal.remove();
}

function showMessage(text, type = 'info') {
    const popup = document.createElement('div');
    popup.className = 'message-popup';
    popup.textContent = text;
    
    if (type === 'error') {
        popup.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
    } else if (type === 'success') {
        popup.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
    }
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 3000);
}

// Debug
function debugGameData() {
    console.log('🔍 DEBUG - Estado del juego:', gameData);
}
        
window.debugGameData = debugGameData;
