// StudyMaster - Sistema de gestión de preguntas y respuestas
class StudyMaster {
    constructor() {
        this.questions = [];
        this.currentIndex = 0;
        this.difficultQuestions = [];
        this.studyMode = false;
        this.currentFileName = '';
        this.studyStats = {
            questionsAnswered: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            sessionTime: 0,
            startTime: null,
            answeredQuestions: new Set()
        };
        this.questionResults = {};
        
        this.initNotificationStyles();
        this.initEventListeners();
        this.startAutoSave();
    }

    // Inicializar estilos para notificaciones
    initNotificationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes notificationSlideDown {
                from { transform: translateX(-50%) translateY(-100px); opacity: 0; scale: 0.8; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; scale: 1; }
            }
            @keyframes notificationSlideUp {
                from { transform: translateX(-50%) translateY(0); opacity: 1; scale: 1; }
                to { transform: translateX(-50%) translateY(-100px); opacity: 0; scale: 0.8; }
            }
        `;
        document.head.appendChild(style);
    }

    // Inicializar event listeners
    initEventListeners() {
        document.addEventListener('keydown', (event) => this.handleKeyPress(event));
        
        // Progress input listener
        const progressInput = document.getElementById('progressInput');
        if (progressInput) {
            progressInput.addEventListener('change', (event) => this.handleProgressFile(event));
        }
    }

    // Manejar atajos de teclado
    handleKeyPress(event) {
        if (!this.studyMode) return;
        
        switch(event.key) {
            case ' ':
            case 'Enter':
                event.preventDefault();
                const answerEl = document.getElementById('answerText');
                if (answerEl && !answerEl.classList.contains('hidden')) {
                    this.nextQuestion();
                } else {
                    this.showAnswer();
                }
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.previousQuestion();
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.nextQuestion();
                break;
            case 's':
            case 'S':
                event.preventDefault();
                this.shuffleQuestions();
                break;
        }
    }

    // Guardar datos en localStorage
    saveToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Cargar datos de localStorage
    loadFromLocalStorage(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    // Cargar archivo de preguntas
    loadFile(file) {
        if (!file.name.endsWith('.txt')) {
            this.showNotification('❌ Por favor, selecciona un archivo .txt', 'error');
            return;
        }
        
        this.currentFileName = file.name.replace('.txt', '');
        const reader = new FileReader();
        reader.onload = (e) => {
            this.parseQuestions(e.target.result);
            this.loadSavedProgress();
        };
        reader.readAsText(file, 'UTF-8');
    }

    // Parsear preguntas del archivo
    parseQuestions(text) {
        const lines = text.split('\n').map(line => line.trim());
        this.questions = [];
        
        for (let i = 0; i < lines.length; i++) {
            if (lines[i] && lines[i + 1]) {
                this.questions.push({
                    question: lines[i],
                    answer: lines[i + 1],
                    id: this.questions.length
                });
                i += 2;
            }
        }
        
        if (this.questions.length > 0) {
            this.saveToLocalStorage('studymaster_questions', this.questions);
            this.saveToLocalStorage('studymaster_filename', this.currentFileName);
            this.showNotification(`✅ ${this.questions.length} preguntas cargadas correctamente`);
        } else {
            this.showNotification('❌ No se pudieron cargar preguntas. Verifica el formato del archivo.', 'error');
        }
    }

    // Generar hash de preguntas para verificación
    generateQuestionsHash() {
        if (!this.questions || this.questions.length === 0) return '';
        
        let hashString = this.questions.map(q => q.question + q.answer).join('');
        let hash = 0;
        for (let i = 0; i < hashString.length; i++) {
            const char = hashString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    // Guardar progreso
    saveProgress() {
        if (!this.currentFileName || this.questions.length === 0) return;
        
        const progressData = {
            fileName: this.currentFileName,
            currentIndex: this.currentIndex,
            difficultQuestions: this.difficultQuestions,
            studyStats: {
                ...this.studyStats,
                answeredQuestions: Array.from(this.studyStats.answeredQuestions || [])
            },
            questionResults: this.questionResults,
            questionsHash: this.generateQuestionsHash(),
            saveDate: new Date().toISOString()
        };
        
        const key = `studymaster_progress_${this.currentFileName}`;
        this.saveToLocalStorage(key, progressData);
    }

    // Cargar progreso guardado
    loadSavedProgress() {
        if (!this.currentFileName) return;
        
        const key = `studymaster_progress_${this.currentFileName}`;
        const saved = this.loadFromLocalStorage(key);
        
        if (saved && saved.questionsHash === this.generateQuestionsHash()) {
            this.currentIndex = saved.currentIndex || 0;
            this.difficultQuestions = saved.difficultQuestions || [];
            this.studyStats = saved.studyStats || this.studyStats;
            this.questionResults = saved.questionResults || {};
            
            if (this.studyStats.answeredQuestions && Array.isArray(this.studyStats.answeredQuestions)) {
                this.studyStats.answeredQuestions = new Set(this.studyStats.answeredQuestions);
            }
            
            const saveDate = new Date(saved.saveDate).toLocaleDateString();
            this.showNotification(`📚 Progreso cargado (guardado: ${saveDate})`);
        }
    }

    // Inicializar estudio
    startStudy() {
        if (this.questions.length === 0) {
            this.showNotification('❌ Primero carga un archivo de preguntas', 'error');
            return;
        }
        
        this.studyMode = true;
        this.studyStats.startTime = new Date();
        this.showNotification('🎯 Sesión de estudio iniciada');
        
        // Redirigir a página de estudio si estamos en index
        if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
            window.location.href = 'study.html';
        }
    }

    // Marcar respuesta como correcta/incorrecta
    markAnswer(isCorrect) {
        const question = this.questions[this.currentIndex];
        const questionId = question.id;
        
        this.questionResults[questionId] = isCorrect;
        
        if (!this.studyStats.answeredQuestions.has(questionId)) {
            this.studyStats.questionsAnswered++;
            if (isCorrect) {
                this.studyStats.correctAnswers++;
            } else {
                this.studyStats.incorrectAnswers++;
            }
            this.studyStats.answeredQuestions.add(questionId);
        } else {
            const previousAnswer = this.questionResults[questionId];
            if (previousAnswer !== isCorrect) {
                if (isCorrect) {
                    this.studyStats.correctAnswers++;
                    this.studyStats.incorrectAnswers--;
                } else {
                    this.studyStats.correctAnswers--;
                    this.studyStats.incorrectAnswers++;
                }
            }
        }
        
        this.saveProgress();
        
        // Mostrar resultado y actualizar UI si estamos en página de estudio
        if (typeof showResultIndicator === 'function') {
            showResultIndicator(isCorrect);
        }
    }

    // Saltar evaluación
    skipEvaluation() {
        const question = this.questions[this.currentIndex];
        this.questionResults[question.id] = 'skipped';
        this.saveProgress();
        
        if (typeof showResultIndicator === 'function') {
            showResultIndicator('skipped');
        }
    }

    // Marcar pregunta como difícil
    markDifficult() {
        const question = this.questions[this.currentIndex];
        const index = this.difficultQuestions.indexOf(question.id);
        
        if (index > -1) {
            this.difficultQuestions.splice(index, 1);
            this.showNotification('✅ Pregunta desmarcada como difícil');
        } else {
            this.difficultQuestions.push(question.id);
            this.showNotification('⭐ Pregunta marcada como difícil');
        }
        
        this.saveProgress();
    }

    // Mezclar preguntas
    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
        
        this.showNotification('🔀 Preguntas mezcladas correctamente');
        this.saveProgress();
    }

    // Exportar progreso
    exportProgress() {
        if (!this.currentFileName) {
            this.showNotification('❌ Primero carga un archivo de preguntas', 'error');
            return;
        }
        
        const progressData = {
            fileName: this.currentFileName,
            currentIndex: this.currentIndex,
            difficultQuestions: this.difficultQuestions,
            studyStats: {
                ...this.studyStats,
                answeredQuestions: Array.from(this.studyStats.answeredQuestions || [])
            },
            questionResults: this.questionResults,
            questionsHash: this.generateQuestionsHash(),
            saveDate: new Date().toISOString(),
            exportVersion: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(progressData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `progreso_${this.currentFileName}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('📤 Progreso exportado como archivo JSON');
    }

    // Manejar archivo de progreso
    handleProgressFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const progressData = JSON.parse(e.target.result);
                
                if (progressData.questionsHash && this.questions.length > 0 && 
                    progressData.questionsHash === this.generateQuestionsHash()) {
                    
                    this.currentIndex = progressData.currentIndex || 0;
                    this.difficultQuestions = progressData.difficultQuestions || [];
                    this.studyStats = progressData.studyStats || this.studyStats;
                    this.questionResults = progressData.questionResults || {};
                    
                    if (this.studyStats.answeredQuestions && Array.isArray(this.studyStats.answeredQuestions)) {
                        this.studyStats.answeredQuestions = new Set(this.studyStats.answeredQuestions);
                    }
                    
                    this.showNotification('📁 Progreso cargado desde archivo');
                } else {
                    this.showNotification('❌ El progreso no coincide con las preguntas actuales', 'error');
                }
            } catch (e) {
                this.showNotification('❌ Error al leer el archivo de progreso', 'error');
            }
        };
        reader.readAsText(file);
    }

    // Reiniciar progreso
    resetProgress() {
        if (!confirm('¿Estás seguro de que quieres reiniciar todo el progreso? Esta acción no se puede deshacer.')) {
            return;
        }
        
        this.currentIndex = 0;
        this.studyMode = false;
        this.difficultQuestions = [];
        this.questionResults = {};
        this.studyStats = {
            questionsAnswered: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            sessionTime: 0,
            startTime: null,
            answeredQuestions: new Set()
        };
        
        if (this.currentFileName) {
            const key = `studymaster_progress_${this.currentFileName}`;
            localStorage.removeItem(key);
        }
        
        this.showNotification('🔄 Progreso reiniciado y borrado completamente');
    }

    // Calcular precisión
    calculateAccuracy() {
        const total = this.studyStats.correctAnswers + this.studyStats.incorrectAnswers;
        if (total === 0) return 0;
        return Math.round((this.studyStats.correctAnswers / total) * 100);
    }

    // Filtrar preguntas por tipo
    filterQuestionsByType(type) {
        let filteredQuestions = [];
        
        if (type === 'incorrect') {
            for (let questionId in this.questionResults) {
                if (this.questionResults[questionId] === false) {
                    const question = this.questions.find(q => q.id == questionId);
                    if (question) filteredQuestions.push(question);
                }
            }
        } else if (type === 'difficult') {
            filteredQuestions = this.questions.filter(q => this.difficultQuestions.includes(q.id));
        } else if (type === 'unanswered') {
            filteredQuestions = this.questions.filter(q => this.questionResults[q.id] === undefined);
        }
        
        if (filteredQuestions.length === 0) {
            let messages = {
                'incorrect': '🎉 ¡No tienes preguntas incorrectas!',
                'difficult': '🎉 ¡No tienes preguntas marcadas como difíciles!',
                'unanswered': '🎉 ¡Has respondido todas las preguntas!'
            };
            this.showNotification(messages[type]);
            return;
        }
        
        // Guardar preguntas filtradas y navegar
        this.saveToLocalStorage('studymaster_filtered_questions', filteredQuestions);
        this.saveToLocalStorage('studymaster_filter_type', type);
        this.showNotification(`📚 Estudiando solo preguntas ${type === 'incorrect' ? 'incorrectas' : type === 'difficult' ? 'difíciles' : 'sin responder'} (${filteredQuestions.length})`);
        
        window.location.href = 'study.html';
    }

    // Mostrar notificación
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        
        let bgColor, shadowColor, borderColor;
        switch(type) {
            case 'error':
                bgColor = 'linear-gradient(135deg, #f44336, #e57373, #ffcdd2)';
                shadowColor = 'rgba(244, 67, 54, 0.5)';
                borderColor = 'rgba(244, 67, 54, 0.3)';
                break;
            case 'warning':
                bgColor = 'linear-gradient(135deg, #ff9800, #ffb74d, #ffcc80)';
                shadowColor = 'rgba(255, 152, 0, 0.5)';
                borderColor = 'rgba(255, 152, 0, 0.3)';
                break;
            default:
                bgColor = 'linear-gradient(135deg, #e91e63, #f06292, #f8bbd9)';
                shadowColor = 'rgba(233, 30, 99, 0.5)';
                borderColor = 'rgba(233, 30, 99, 0.3)';
        }
        
        notification.style.cssText = `
            position: fixed; top: 25px; left: 50%; transform: translateX(-50%);
            background: ${bgColor}; color: white; padding: 20px 30px; border-radius: 25px;
            box-shadow: 0 15px 35px ${shadowColor}, inset 0 1px 0 rgba(255, 255, 255, 0.3);
            z-index: 1000; font-weight: 700; font-size: 1.1rem;
            animation: notificationSlideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 400px; text-align: center; border: 2px solid ${borderColor};
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); backdrop-filter: blur(10px);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'notificationSlideUp 0.5s ease-out';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 500);
        }, 4000);
    }

    // Auto-guardar cada 30 segundos
    startAutoSave() {
        setInterval(() => {
            if (this.currentFileName && this.questions.length > 0) {
                this.saveProgress();
            }
        }, 30000);
    }

    // Navegación entre preguntas
    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
        }
        this.saveProgress();
    }

    previousQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        }
    }

    // Mostrar respuesta
    showAnswer() {
        // Esta función será implementada en cada página específica
    }

    // Cargar datos para la página actual
    loadCurrentData() {
        // Cargar preguntas guardadas
        const savedQuestions = this.loadFromLocalStorage('studymaster_questions');
        const savedFilename = this.loadFromLocalStorage('studymaster_filename');
        
        if (savedQuestions && savedFilename) {
            this.questions = savedQuestions;
            this.currentFileName = savedFilename;
            this.loadSavedProgress();
        }
        
        // Cargar preguntas filtradas si existen
        const filteredQuestions = this.loadFromLocalStorage('studymaster_filtered_questions');
        if (filteredQuestions && window.location.pathname.includes('study.html')) {
            this.questions = filteredQuestions;
            this.currentIndex = 0;
            localStorage.removeItem('studymaster_filtered_questions');
        }
    }
}

// Instancia global de StudyMaster
const studyMaster = new StudyMaster();

// Funciones globales para compatibilidad con HTML
function loadFile(file) { studyMaster.loadFile(file); }
function startStudy() { studyMaster.startStudy(); }
function markAnswer(isCorrect) { studyMaster.markAnswer(isCorrect); }
function skipEvaluation() { studyMaster.skipEvaluation(); }
function markDifficult() { studyMaster.markDifficult(); }
function shuffleQuestions() { studyMaster.shuffleQuestions(); }
function exportProgress() { studyMaster.exportProgress(); }
function loadProgress() { document.getElementById('progressInput')?.click(); }
function resetProgress() { studyMaster.resetProgress(); }
function filterQuestionsByType(type) { studyMaster.filterQuestionsByType(type); }
function nextQuestion() { studyMaster.nextQuestion(); }
function previousQuestion() { studyMaster.previousQuestion(); }
function saveProgress() { studyMaster.saveProgress(); }

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    studyMaster.loadCurrentData();
});