document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM - Pantallas
    const mainMenu = document.getElementById('main-menu');
    const gameScreen = document.getElementById('game-screen');
    const settingsScreen = document.getElementById('settings-screen');
    
    // Elementos del DOM - Juego
    const gameBoard = document.getElementById('game-board');
    const resetBtn = document.getElementById('reset-btn');
    const movesDisplay = document.getElementById('moves');
    const timerDisplay = document.getElementById('timer');
    const timeLimitDisplay = document.getElementById('time-limit-display');
    const timeLimitText = document.getElementById('time-limit');
    
    // Elementos del DOM - Menú Principal
    const playBtn = document.getElementById('play-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    
    // Elementos del DOM - Configuración
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    const gameModeBtns = document.querySelectorAll('.game-mode-btn');
    const backFromSettingsBtn = document.getElementById('back-from-settings-btn');
    
    // Elementos del DOM - Modales
    const winModal = document.getElementById('win-modal');
    const loseModal = document.getElementById('lose-modal');
    const finalTimeDisplay = document.getElementById('final-time');
    const finalMovesDisplay = document.getElementById('final-moves');
    const foundPairsDisplay = document.getElementById('found-pairs');
    const totalPairsDisplay = document.getElementById('total-pairs');
    const playAgainBtn = document.getElementById('play-again');
    const tryAgainBtn = document.getElementById('try-again');
    const backToMenuFromWinBtn = document.getElementById('back-to-menu-from-win');
    const backToMenuFromLoseBtn = document.getElementById('back-to-menu-from-lose');

    // Variables del juego
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let matchedPairs = 0;
    let totalPairs = 8; // Por defecto, puede cambiar según dificultad
    let gameStarted = false;
    let timerInterval;
    let timeLimitInterval;
    let seconds = 0;
    let minutes = 0;
    let gameMode = 'normal'; // normal o timed
    let timeLimit = 120; // 2 minutos por defecto

    // Iconos para las cartas (usando emojis para simplicidad)
    const cardIcons = [
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
        '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔'
    ];

    // Inicializar el juego
    function initGame() {
        resetGame();
        createCards();
        shuffleCards();
        renderCards();
        
        // Actualizar el display del límite de tiempo si es modo contrarreloj
        if (gameMode === 'timed') {
            timeLimitDisplay.classList.remove('hidden');
            updateTimeLimitDisplay();
        } else {
            timeLimitDisplay.classList.add('hidden');
        }
        
        // Actualizar el display de pares totales en el modal de derrota
        totalPairsDisplay.textContent = totalPairs;
    }

    // Crear las cartas según la dificultad
    function createCards() {
        // Seleccionar iconos según la cantidad de pares
        const selectedIcons = cardIcons.slice(0, totalPairs);
        
        // Crear pares de cartas
        cards = [...selectedIcons, ...selectedIcons].map((icon, index) => ({
            id: index,
            icon: icon,
            isFlipped: false,
            isMatched: false
        }));
    }

    // Mezclar las cartas
    function shuffleCards() {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }

    // Renderizar las cartas en el tablero
    function renderCards() {
        gameBoard.innerHTML = '';
        
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.id = card.id;
            
            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-front flex items-center justify-center text-4xl">
                        ${card.icon}
                    </div>
                    <div class="card-back flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            `;
            
            cardElement.addEventListener('click', flipCard);
            gameBoard.appendChild(cardElement);
        });
    }

    // Voltear una carta
    function flipCard() {
        if (lockBoard) return;
        if (!gameStarted) startGame();
        
        const selectedCard = this;
        const cardId = parseInt(selectedCard.dataset.id);
        const card = cards.find(c => c.id === cardId);
        
        // Evitar hacer clic en la misma carta o en cartas ya emparejadas
        if (selectedCard === firstCard || card.isMatched) return;
        
        // Voltear la carta visualmente
        selectedCard.classList.add('flipped');
        card.isFlipped = true;
        
        if (!hasFlippedCard) {
            // Primera carta volteada
            hasFlippedCard = true;
            firstCard = selectedCard;
        } else {
            // Segunda carta volteada
            secondCard = selectedCard;
            checkForMatch();
        }
    }

    // Comprobar si hay coincidencia
    function checkForMatch() {
        moves++;
        movesDisplay.textContent = moves;
        
        const firstCardId = parseInt(firstCard.dataset.id);
        const secondCardId = parseInt(secondCard.dataset.id);
        
        const firstCardObj = cards.find(c => c.id === firstCardId);
        const secondCardObj = cards.find(c => c.id === secondCardId);
        
        // Comprobar si las cartas coinciden
        if (firstCardObj.icon === secondCardObj.icon) {
            // Es una coincidencia
            disableCards();
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            firstCardObj.isMatched = true;
            secondCardObj.isMatched = true;
            matchedPairs++;
            
            // Comprobar si se han encontrado todos los pares
            if (matchedPairs === totalPairs) {
                setTimeout(() => {
                    endGame();
                }, 500);
            }
        } else {
            // No es una coincidencia
            unflipCards();
        }
    }

    // Deshabilitar cartas coincidentes
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    // Voltear de nuevo las cartas que no coinciden
    function unflipCards() {
        lockBoard = true;
        
        // Añadir animación de sacudida
        firstCard.classList.add('shake');
        secondCard.classList.add('shake');
        
        setTimeout(() => {
            firstCard.classList.remove('flipped', 'shake');
            secondCard.classList.remove('flipped', 'shake');
            
            // Actualizar el estado de las cartas
            const firstCardId = parseInt(firstCard.dataset.id);
            const secondCardId = parseInt(secondCard.dataset.id);
            
            cards.find(c => c.id === firstCardId).isFlipped = false;
            cards.find(c => c.id === secondCardId).isFlipped = false;
            
            resetBoard();
        }, 1000);
    }

    // Resetear variables para la siguiente jugada
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    // Iniciar el juego y el temporizador
    function startGame() {
        if (gameStarted) return;
        gameStarted = true;
        startTimer();
        
        // Iniciar el temporizador de límite si es modo contrarreloj
        if (gameMode === 'timed') {
            startTimeLimitCountdown();
        }
    }

    // Iniciar el temporizador
    function startTimer() {
        timerInterval = setInterval(() => {
            seconds++;
            if (seconds === 60) {
                minutes++;
                seconds = 0;
            }
            updateTimerDisplay();
        }, 1000);
    }
    
    // Iniciar el temporizador de límite de tiempo (modo contrarreloj)
    function startTimeLimitCountdown() {
        let remainingSeconds = timeLimit;
        
        updateTimeLimitDisplay(remainingSeconds);
        
        timeLimitInterval = setInterval(() => {
            remainingSeconds--;
            updateTimeLimitDisplay(remainingSeconds);
            
            if (remainingSeconds <= 0) {
                endGameWithTimeout();
            }
        }, 1000);
    }
    
    // Actualizar la visualización del límite de tiempo
    function updateTimeLimitDisplay(remainingSeconds = timeLimit) {
        const mins = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        const formattedMins = mins.toString().padStart(2, '0');
        const formattedSecs = secs.toString().padStart(2, '0');
        timeLimitText.textContent = `${formattedMins}:${formattedSecs}`;
        
        // Cambiar el color cuando queda poco tiempo
        if (remainingSeconds <= 30) {
            timeLimitText.classList.add('text-red-500');
            timeLimitText.classList.add('font-bold');
            
            if (remainingSeconds <= 10) {
                timeLimitDisplay.classList.add('animate-pulse');
            }
        } else {
            timeLimitText.classList.remove('text-red-500');
            timeLimitText.classList.remove('font-bold');
            timeLimitDisplay.classList.remove('animate-pulse');
        }
    }

    // Actualizar la visualización del temporizador
    function updateTimerDisplay() {
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
    }

    // Detener el temporizador
    function stopTimer() {
        clearInterval(timerInterval);
        if (gameMode === 'timed') {
            clearInterval(timeLimitInterval);
        }
    }

    // Finalizar el juego con victoria
    function endGame() {
        stopTimer();
        finalTimeDisplay.textContent = timerDisplay.textContent;
        finalMovesDisplay.textContent = moves;
        winModal.classList.remove('hidden');
    }
    
    // Finalizar el juego por tiempo agotado
    function endGameWithTimeout() {
        stopTimer();
        foundPairsDisplay.textContent = matchedPairs;
        totalPairsDisplay.textContent = totalPairs;
        loseModal.classList.remove('hidden');
    }

    // Resetear el juego
    function resetGame() {
        stopTimer();
        cards = [];
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
        moves = 0;
        matchedPairs = 0;
        gameStarted = false;
        seconds = 0;
        minutes = 0;
        
        movesDisplay.textContent = '0';
        timerDisplay.textContent = '00:00';
        winModal.classList.add('hidden');
        loseModal.classList.add('hidden');
        
        // Resetear estilos del límite de tiempo
        timeLimitText.classList.remove('text-red-500');
        timeLimitText.classList.remove('font-bold');
        timeLimitDisplay.classList.remove('animate-pulse');
    }
    
    // Cambiar a la pantalla de juego
    function showGameScreen() {
        mainMenu.classList.add('hidden');
        settingsScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
    }
    
    // Cambiar a la pantalla de menú principal
    function showMainMenu() {
        gameScreen.classList.add('hidden');
        settingsScreen.classList.add('hidden');
        mainMenu.classList.remove('hidden');
        resetGame();
    }
    
    // Cambiar a la pantalla de configuración
    function showSettingsScreen() {
        mainMenu.classList.add('hidden');
        gameScreen.classList.add('hidden');
        settingsScreen.classList.remove('hidden');
    }
    
    // Actualizar la dificultad seleccionada
    function updateDifficulty(pairs) {
        totalPairs = pairs;
        
        // Actualizar la selección visual
        difficultyBtns.forEach(btn => {
            if (parseInt(btn.dataset.pairs) === pairs) {
                btn.classList.add('selected');
                btn.classList.add('font-bold');
            } else {
                btn.classList.remove('selected');
                btn.classList.remove('font-bold');
            }
        });
    }
    
    // Actualizar el modo de juego seleccionado
    function updateGameMode(mode) {
        gameMode = mode;
        
        if (mode === 'timed') {
            timeLimit = 120; // 2 minutos
        }
        
        // Actualizar la selección visual
        gameModeBtns.forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('selected');
                btn.classList.add('font-bold');
            } else {
                btn.classList.remove('selected');
                btn.classList.remove('font-bold');
            }
        });
    }

    // Event Listeners - Menú Principal
    playBtn.addEventListener('click', () => {
        showGameScreen();
        initGame();
        startGame();
    });
    
    settingsBtn.addEventListener('click', () => {
        showSettingsScreen();
    });
    
    // Event Listeners - Pantalla de Juego
    resetBtn.addEventListener('click', () => {
        initGame();
    });
    
    backToMenuBtn.addEventListener('click', () => {
        showMainMenu();
    });
    
    // Event Listeners - Pantalla de Configuración
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            updateDifficulty(parseInt(btn.dataset.pairs));
        });
    });
    
    gameModeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            updateGameMode(btn.dataset.mode);
        });
    });
    
    backFromSettingsBtn.addEventListener('click', () => {
        showMainMenu();
    });
    
    // Event Listeners - Modales
    playAgainBtn.addEventListener('click', () => {
        winModal.classList.add('hidden');
        initGame();
        startGame();
    });
    
    tryAgainBtn.addEventListener('click', () => {
        loseModal.classList.add('hidden');
        initGame();
        startGame();
    });
    
    backToMenuFromWinBtn.addEventListener('click', () => {
        winModal.classList.add('hidden');
        showMainMenu();
    });
    
    backToMenuFromLoseBtn.addEventListener('click', () => {
        loseModal.classList.add('hidden');
        showMainMenu();
    });

    // Inicializar el juego
    // Mostrar el menú principal al cargar la página
    showMainMenu();
});