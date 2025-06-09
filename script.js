document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const popupOverlay = document.getElementById('popup-overlay');
    const startButton = document.getElementById('start-button');
    const gameContainer = document.getElementById('game-container');
    const timerDisplay = document.getElementById('timer');
    const mathQuestionElement = document.getElementById('math-question');
    const answerInput = document.getElementById('answer-input');
    const submitButton = document.getElementById('submit-button');
    const feedbackText = document.getElementById('feedback-text');
    const statsArea = document.getElementById('stats-area');
    const correctCountDisplay = document.getElementById('correct-count');
    const wrongCountDisplay = document.getElementById('wrong-count');
    const restartButton = document.getElementById('restart-button');

    // Game Variables
    let timer;
    const GAME_DURATION_SECONDS = 3 * 60; // 3 minutes
    let timeLeft = GAME_DURATION_SECONDS;
    let currentQuestion = {};
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let lives = 1; // Gives one chance to correct a wrong answer

    // --- Helper Functions ---

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateMathQuestion() {
        const type = Math.random() < 0.5 ? 'subtraction' : 'addition';
        let question = {};

        if (type === 'subtraction') {
            const minuend = getRandomInt(20, 29); // 20-29
            const subtrahend = getRandomInt(1, 9); // single digit
            question = {
                text: `${minuend} - ${subtrahend} = ?`,
                answer: minuend - subtrahend,
                type: 'subtraction'
            };
        } else { // addition
            const addend1 = getRandomInt(10, 29); // 10-29
            const addend2 = getRandomInt(1, 9); // single digit
            question = {
                text: `${addend1} + ${addend2} = ?`,
                answer: addend1 + addend2,
                type: 'addition'
            };
        }
        return question;
    }

    function displayQuestion() {
        currentQuestion = generateMathQuestion();
        mathQuestionElement.textContent = currentQuestion.text;
        answerInput.value = ''; // Clear previous answer
        feedbackText.textContent = ''; // Clear feedback
        answerInput.focus(); // Focus the input field for immediate typing
        lives = 1; // Reset lives for new question
    }

    function startGame() {
        popupOverlay.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        correctAnswers = 0;
        wrongAnswers = 0;
        timeLeft = GAME_DURATION_SECONDS;
        updateTimerDisplay();
        displayQuestion();
        startTimer();
    }

    function endGame() {
        clearInterval(timer);
        gameContainer.classList.add('hidden');
        statsArea.classList.remove('hidden');
        correctCountDisplay.textContent = correctAnswers;
        wrongCountDisplay.textContent = wrongAnswers;
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    function checkAnswer() {
        const userAnswer = parseInt(answerInput.value, 10);

        if (isNaN(userAnswer)) {
            feedbackText.textContent = "Bitte gib eine Zahl ein.";
            feedbackText.className = 'feedback-text wrong'; // Red text
            return;
        }

        if (userAnswer === currentQuestion.answer) {
            feedbackText.textContent = "Korrekt!";
            feedbackText.className = 'feedback-text correct'; // Green text
            correctAnswers++;
            setTimeout(() => displayQuestion(), 700); // Display next question after a short delay
        } else {
            if (lives > 0) {
                feedbackText.textContent = "Falsch. Versuch es nochmal!";
                feedbackText.className = 'feedback-text wrong'; // Red text
                lives--;
                answerInput.focus(); // Keep focus on input
            } else {
                feedbackText.textContent = `Falsch. Die richtige Antwort war ${currentQuestion.answer}.`;
                feedbackText.className = 'feedback-text wrong'; // Red text
                wrongAnswers++;
                setTimeout(() => displayQuestion(), 1500); // Display next question after a longer delay
            }
        }
    }

    function resetGame() {
        statsArea.classList.add('hidden');
        popupOverlay.classList.remove('hidden');
        // Game will be reset when startGame is called again from the popup.
    }

    // --- Event Listeners ---
    startButton.addEventListener('click', startGame);
    submitButton.addEventListener('click', checkAnswer);
    restartButton.addEventListener('click', resetGame);

    // Allow pressing Enter to submit answer
    answerInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission behavior if any
            checkAnswer();
        }
    });

    // Initial state: hide game and stats, show popup
    gameContainer.classList.add('hidden');
    statsArea.classList.add('hidden');
    popupOverlay.classList.remove('hidden'); // Ensure popup is visible on load
});