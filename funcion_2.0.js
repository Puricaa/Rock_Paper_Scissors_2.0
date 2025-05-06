// --- CONSTANTES Y CONFIGURACIÓN ---
const choices = ['piedra', 'papel', 'tijera']; // Opciones posibles en el juego
const maxRounds = 10; // Límite máximo de rondas ganadas para terminar la partida
const initialHealth = 100; // Salud inicial para jugador y computadora
const damagePerHit = 20; // Daño infligido en cada turno perdido

// --- VARIABLES DE ESTADO DEL JUEGO ---
let playerHealth = initialHealth; // Salud actual del jugador
let computerHealth = initialHealth; // Salud actual de la computadora
let playerRoundsWon = 0; // Contador de rondas ganadas por el jugador
let computerRoundsWon = 0; // Contador de rondas ganadas por la computadora
let gameActive = true; // Indica si el juego está en curso (para habilitar/deshabilitar controles)

// --- ELEMENTOS DEL DOM (Interfaz de Usuario) ---
// Se obtienen referencias a los elementos HTML para interactuar con ellos
const playerHealthFill = document.getElementById("health-player");
const computerHealthFill = document.getElementById("health-computer");
const playerRoundsCounter = document.getElementById("player-rounds");
const computerRoundsCounter = document.getElementById("computer-rounds");
const resultDisplay = document.getElementById('result');
const playerChoiceDisplay = document.querySelector("#player-choice");
const computerChoiceDisplay = document.querySelector("#computer-choice");
const playerImg = document.getElementById('player-img');
const computerImg = document.getElementById('computer-img');
const choiceButtons = document.querySelectorAll('.choices button'); // Selecciona todos los botones de elección
const newGameButton = document.getElementById("new-game-btn");

// --- FUNCIONES PRINCIPALES DEL JUEGO ---

/**
 * Inicia una nueva partida completa.
 * Restablece la salud, las rondas ganadas y la interfaz de usuario.
 * Habilita los botones de elección.
 */
function startNewGame() {
    // Restablecer salud
    playerHealth = initialHealth;
    computerHealth = initialHealth;

    // Restablecer rondas ganadas
    playerRoundsWon = 0;
    computerRoundsWon = 0;

    // Actualizar la interfaz de usuario (barras de vida y contadores de rondas)
    updateHealthBars();
    updateRoundCounters();
    resetVisuals(); // Limpia las elecciones y estilos visuales anteriores

    // Mensaje de inicio de partida
    resultDisplay.innerHTML = '🎮 ¡Nueva partida iniciada! Elige tu jugada.';
    gameActive = true; // Marca el juego como activo
    toggleChoiceButtons(true); // Habilita los botones de elección
    console.log("Nueva partida iniciada."); // Mensaje para depuración
}

/**
 * Maneja la elección del jugador, ejecuta la lógica del turno y muestra el resultado.
 * @param {string} playerChoice - La elección del jugador ('piedra', 'papel' o 'tijera').
 */
function handlePlayerChoice(playerChoice) {
    // Si el juego no está activo (por ejemplo, después de que alguien ganó las 10 rondas), no hacer nada
    if (!gameActive) {
        console.log("El juego ha terminado. Inicia una nueva partida.");
        return;
    }

    // 1. Obtener la elección de la computadora
    const computerChoice = getComputerChoice();

    // 2. Actualizar las imágenes mostradas
    updateChoiceImage(playerImg, playerChoice);
    updateChoiceImage(computerImg, computerChoice);

    // 3. Determinar el ganador del turno
    const winner = determineTurnWinner(playerChoice, computerChoice);

    // 4. Actualizar estado y mostrar resultado del turno
    updateGameState(winner);
    displayTurnResult(winner, playerChoice, computerChoice);

    // 5. Comprobar si la ronda actual ha terminado (alguien llegó a 0 de vida)
    checkRoundEnd();
    console.log(`Jugador eligió: ${playerChoice}, Computadora eligió: ${computerChoice}, Ganador del turno: ${winner}`); // Mensaje para depuración
}

/**
 * Genera una elección aleatoria para la computadora.
 * @returns {string} La elección de la computadora ('piedra', 'papel' o 'tijera').
 */
function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

/**
 * Actualiza la imagen mostrada para una elección específica.
 * @param {HTMLImageElement} imgElement - El elemento <img> a actualizar.
 * @param {string} choice - La elección ('piedra', 'papel', 'tijera') para mostrar la imagen correspondiente.
 */
function updateChoiceImage(imgElement, choice) {
    if (!choice) { // Si no hay elección (al reiniciar), limpia la imagen
        imgElement.src = ''; // O una imagen placeholder si prefieres
        imgElement.alt = '';
        imgElement.style.display = 'none'; // Oculta la imagen si no hay elección
    } else {
        imgElement.src = `assets/${choice}.png`; // Asegúrate de que la ruta a tus imágenes sea correcta
        imgElement.alt = choice;
        imgElement.style.display = 'block'; // Muestra la imagen
    }
}


/**
 * Determina el ganador de un turno basado en las elecciones.
 * @param {string} playerChoice - Elección del jugador.
 * @param {string} computerChoice - Elección de la computadora.
 * @returns {string} 'player', 'computer' o 'tie' (empate).
 */
function determineTurnWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'tie'; // Empate
    } else if (
        (playerChoice === 'piedra' && computerChoice === 'tijera') ||
        (playerChoice === 'papel' && computerChoice === 'piedra') ||
        (playerChoice === 'tijera' && computerChoice === 'papel')
    ) {
        return 'player'; // Jugador gana
    } else {
        return 'computer'; // Computadora gana
    }
}

/**
 * Actualiza la salud basada en el ganador del turno.
 * @param {string} winner - Quién ganó el turno ('player', 'computer' o 'tie').
 */
function updateGameState(winner) {
    if (winner === 'player') {
        // Si gana el jugador, reduce la salud de la computadora
        computerHealth = Math.max(computerHealth - damagePerHit, 0); // Evita salud negativa
    } else if (winner === 'computer') {
        // Si gana la computadora, reduce la salud del jugador
        playerHealth = Math.max(playerHealth - damagePerHit, 0); // Evita salud negativa
    }
    // Si es empate ('tie'), no cambia la salud
    updateHealthBars(); // Actualiza visualmente las barras de vida
}

/**
 * Muestra el resultado del turno en la interfaz (mensaje y estilos visuales).
 * @param {string} winner - Quién ganó el turno ('player', 'computer' o 'tie').
 * @param {string} pChoice - Elección del jugador.
 * @param {string} cChoice - Elección de la computadora.
 */
function displayTurnResult(winner, pChoice, cChoice) {
    // Limpia clases anteriores de los contenedores de elección
    playerChoiceDisplay.className = "choice";
    computerChoiceDisplay.className = "choice";

    let resultMessage = '';

    // Asigna mensaje y clases CSS según el resultado
    if (winner === 'tie') {
        resultMessage = '¡Empate!';
        playerChoiceDisplay.classList.add('tie');
        computerChoiceDisplay.classList.add('tie');
    } else if (winner === 'player') {
        resultMessage = '¡Ganaste el turno!';
        playerChoiceDisplay.classList.add('winner');
        computerChoiceDisplay.classList.add('loser');
    } else { // winner === 'computer'
        resultMessage = 'Perdiste el turno...';
        playerChoiceDisplay.classList.add('loser');
        computerChoiceDisplay.classList.add('winner');
    }

    // Muestra el mensaje del resultado del turno
    resultDisplay.innerHTML = `<h2>${resultMessage}</h2>`;

    // Actualiza también el contenido de las 'cartas' (opcional, si quieres mostrar texto además de imagen)
    // playerChoiceDisplay.textContent = pChoice; // Descomentar si quieres mostrar texto
    // computerChoiceDisplay.textContent = cChoice; // Descomentar si quieres mostrar texto
}

/**
 * Comprueba si un jugador ha llegado a 0 de salud para finalizar la ronda actual.
 * Si la ronda termina, actualiza contadores y verifica si el juego ha terminado.
 */
function checkRoundEnd() {
    // Si ninguno ha llegado a 0, la ronda continúa
    if (playerHealth > 0 && computerHealth > 0) {
        return;
    }

    // Si alguien llegó a 0, la ronda termina
    gameActive = false; // Desactiva temporalmente los controles durante el mensaje
    toggleChoiceButtons(false); // Deshabilita botones

    let roundEndMessage = '';
    if (playerHealth === 0) {
        roundEndMessage = '¡Perdiste la ronda!';
        computerRoundsWon++; // Incrementa rondas ganadas por la computadora
    } else { // computerHealth === 0
        roundEndMessage = '¡Ganaste la ronda!';
        playerRoundsWon++; // Incrementa rondas ganadas por el jugador
    }

    updateRoundCounters(); // Actualiza los contadores en la UI

    // Muestra el mensaje de fin de ronda después de un breve retraso
    setTimeout(() => {
        resultDisplay.innerHTML = `<h2>${roundEndMessage}</h2>`; // Muestra el mensaje en el área de resultados

        // Comprueba si alguien ha alcanzado el límite de rondas ganadas
        if (checkGameEnd()) {
             // Si el juego terminó, checkGameEnd ya mostró el mensaje final y desactivó el juego.
             console.log("El juego ha terminado (límite de rondas alcanzado).");
        } else {
            // Si el juego no ha terminado, prepara la siguiente ronda después de otro retraso
            setTimeout(() => {
                startNextRound();
                gameActive = true; // Reactiva el juego para la nueva ronda
                toggleChoiceButtons(true); // Habilita botones de nuevo
            }, 1500); // Espera 1.5 segundos antes de iniciar la siguiente ronda
        }
    }, 1000); // Espera 1 segundo para mostrar el mensaje de fin de ronda
}

/**
 * Comprueba si algún jugador ha alcanzado el límite de rondas ganadas.
 * Si es así, muestra el mensaje final y desactiva el juego.
 * @returns {boolean} `true` si el juego ha terminado, `false` en caso contrario.
 */
function checkGameEnd() {
    if (playerRoundsWon >= maxRounds || computerRoundsWon >= maxRounds) {
        gameActive = false; // El juego termina definitivamente hasta "Nueva Partida"
        toggleChoiceButtons(false); // Deshabilita los botones de elección permanentemente

        let finalMessage = '';
        if (playerRoundsWon >= maxRounds) {
            finalMessage = `🏆 ¡Felicidades! ¡Ganaste la partida ${playerRoundsWon} a ${computerRoundsWon}! 🏆`;
        } else {
            finalMessage = ` G ¡La computadora ganó la partida ${computerRoundsWon} a ${playerRoundsWon}! Mejor suerte la próxima. G`;
        }
        resultDisplay.innerHTML = `<h2>${finalMessage}</h2>`; // Muestra el mensaje final
        return true; // Indica que el juego ha terminado
    }
    return false; // Indica que el juego continúa
}


/**
 * Prepara el inicio de la siguiente ronda (no reinicia las rondas ganadas).
 * Restablece la salud y los elementos visuales del turno.
 */
function startNextRound() {
    playerHealth = initialHealth; // Restaura salud del jugador
    computerHealth = initialHealth; // Restaura salud de la computadora
    updateHealthBars(); // Actualiza las barras de vida visualmente
    resultDisplay.innerHTML = '¡Siguiente ronda! Elige tu jugada.'; // Mensaje para la nueva ronda
    resetVisuals(); // Limpia las elecciones visuales del turno anterior
    console.log("Iniciando siguiente ronda."); // Mensaje para depuración
}


// --- FUNCIONES AUXILIARES DE UI ---

/**
 * Actualiza el ancho de las barras de vida en la interfaz.
 * Añade una clase 'critical' si la vida es baja (opcional, requiere CSS).
 */
function updateHealthBars() {
    playerHealthFill.style.width = playerHealth + "%";
    computerHealthFill.style.width = computerHealth + "%";

    // Opcional: Añadir clase si la vida es 0 (o baja) para un efecto visual
    playerHealthFill.classList.toggle("critical", playerHealth === 0);
    computerHealthFill.classList.toggle("critical", computerHealth === 0);
}

/**
 * Actualiza los contadores de rondas ganadas en la interfaz.
 */
function updateRoundCounters() {
    playerRoundsCounter.textContent = `Rondas ganadas: ${playerRoundsWon}`;
    computerRoundsCounter.textContent = `Rondas ganadas: ${computerRoundsWon}`;
}

/**
 * Restablece los elementos visuales del turno (clases CSS, imágenes).
 */
function resetVisuals() {
    // Quita las clases de resultado (winner, loser, tie)
    playerChoiceDisplay.className = "choice";
    computerChoiceDisplay.className = "choice";

    // Limpia las imágenes de las elecciones anteriores
    updateChoiceImage(playerImg, null); // Pasa null para limpiar la imagen
    updateChoiceImage(computerImg, null); // Pasa null para limpiar la imagen

    // Opcional: Limpiar el contenido de texto si lo usas
    // playerChoiceDisplay.textContent = '';
    // computerChoiceDisplay.textContent = '';
}

/**
 * Habilita o deshabilita los botones de elección del jugador.
 * @param {boolean} enable - `true` para habilitar, `false` para deshabilitar.
 */
function toggleChoiceButtons(enable) {
    choiceButtons.forEach(button => {
        button.disabled = !enable;
        // Opcional: Cambiar estilo visual para indicar si están deshabilitados
        button.style.opacity = enable ? 1 : 0.5;
        button.style.cursor = enable ? 'pointer' : 'not-allowed';
    });
}


// --- INICIALIZACIÓN Y EVENT LISTENERS ---

/**
 * Función que se ejecuta cuando el DOM está completamente cargado.
 * Configura los event listeners iniciales.
 */
function initializeGame() {
    // Añade un event listener a cada botón de elección ('piedra', 'papel', 'tijera')
    choiceButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Cuando se hace clic, obtiene la elección del atributo 'data-choice' del botón
            const choice = button.dataset.choice; // Asegúrate de que tus botones HTML tengan `data-choice="piedra"`, etc.
            handlePlayerChoice(choice); // Llama a la función principal para manejar el turno
        });
    });

    // Añade event listener al botón de "Nueva Partida"
    newGameButton.addEventListener("click", startNewGame);

    // Inicia la primera partida al cargar la página
    startNewGame();
    console.log("Juego inicializado."); // Mensaje para depuración
}

// Ejecuta initializeGame cuando el contenido del DOM esté listo
document.addEventListener('DOMContentLoaded', initializeGame);

// La función multiplayerSetup se mantiene como placeholder para futuro desarrollo
function multiplayerSetup() {
    // Lógica futura para multijugador
    console.warn("La funcionalidad multijugador aún no está implementada.");
    // document.getElementById('multiplayer-section').classList.remove('hidden');
}

