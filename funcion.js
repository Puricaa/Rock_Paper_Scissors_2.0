const choices = ['piedra', 'papel', 'tijera'];
let playerChoice = '';
let computerChoice = '';
let playerHealth = 100;
let computerHealth = 100;
let playerRounds = 0;
let computerRounds = 0;



// Función para que el jugador elija una opción
function playerChoose(choice) {
	playerChoice = choice;
	updateImage('player-img', choice);
	computerPlay();
	displayResult();
	// document.getElementById('player-choice').innerText = choice.charAt(0).toUpperCase() + choice.slice(1);
}

// Función para que la computadora elija aleatoriamente
function computerPlay() {
	const randomIndex = Math.floor(Math.random() * choices.length);
	computerChoice = choices[randomIndex];
	updateImage('computer-img', computerChoice);
	// document.getElementById('computer-choice').innerText = computerChoice.charAt(0).toUpperCase() + computerChoice.slice(1);
}

// Función para que las imagenes se muestren en las casillas del Jugador y Computadora
function updateImage(imgId, choice) {
	const imgElement = document.getElementById(imgId);
	imgElement.src = `assets/${choice}.png`;
	imgElement.alt = choice;
}

// Función para mostrar el resultado
function displayResult() {
	const playerCard = document.querySelector("#player-choice");
	const computerCard = document.querySelector("#computer-choice");

	playerCard.className = "choice";
	computerCard.className = "choice";

	let resultMessage = '';

	if (playerChoice === computerChoice) {
			resultMessage = '¡Empate!';
			playerCard.classList.add('tie');
			computerCard.classList.add('tie');
	} else if (
			(playerChoice === 'piedra' && computerChoice === 'tijera') ||
			(playerChoice === 'papel' && computerChoice === 'piedra') ||
			(playerChoice === 'tijera' && computerChoice === 'papel')
	) {
			resultMessage = '¡Ganaste!';
			playerCard.classList.add('winner');
			computerCard.classList.add('loser');
			computerHealth = Math.max(computerHealth - 20, 0);
	} else {
			resultMessage = 'Perdiste...';
			playerCard.classList.add('loser');
			computerCard.classList.add('winner');
			playerHealth = Math.max(playerHealth - 20, 0);
	}

	updateHealthBars();

	if (playerHealth === 0 || computerHealth === 0) {
			setTimeout(() => {
					let finalMessage;
					if (playerHealth === 0) {
							finalMessage = '¡Perdiste la ronda!';
							computerRounds++;
					} else {
							finalMessage = '¡Ganaste la ronda!';
							playerRounds++;
					}

					updateRoundCounters();
					alert(finalMessage);
					startNextRound(); // ← Reinicia solo la ronda, no el juego completo
			}, 600);
	}

	document.getElementById('result').innerHTML = `<h2>${resultMessage}</h2>`;
}


// Función para aplicar las animación de la barra de vida
function updateHealthBars() {
	const playerFill = document.getElementById("health-player");
	const computerFill = document.getElementById("health-computer");

	playerFill.style.width = playerHealth + "%";
	computerFill.style.width = computerHealth + "%";

	playerFill.classList.toggle("critical", playerHealth === 0);
	computerFill.classList.toggle("critical", computerHealth === 0);
}


function updateRoundCounters() {
	document.getElementById("player-rounds").textContent = `Rondas ganadas: ${playerRounds}`;
	document.getElementById("computer-rounds").textContent = `Rondas ganadas: ${computerRounds}`;
}

function startNextRound() {
	playerHealth = 100;
	computerHealth = 100;
	updateHealthBars();
	document.getElementById('result').innerHTML = '¡Nueva ronda! Elige tu jugada.';
	resetVisuals();
}

function resetVisuals() {
	document.querySelector("#player-choice").className = "choice";
	document.querySelector("#computer-choice").className = "choice";
	document.querySelector("#player-choice").innerHTML = '';
	document.querySelector("#computer-choice").innerHTML = '';
}


// function resetGame() {
// 	playerHealth = 100;
// 	computerHealth = 100;
// 	updateHealthBars();
// 	document.getElementById('result').innerHTML = '';
// }

// boton de Nueva Partida
document.getElementById("new-game-btn").addEventListener("click", startNewGame);

function startNewGame() {
    // Restaurar vidas
    playerHealth = 100;
    computerHealth = 100;

    // Restaurar rondas ganadas
    playerRounds = 0;
    computerRounds = 0;

    // Actualizar UI
    updateHealthBars();
    updateRoundCounters();
    resetVisuals();

    // Mensaje de estado
    document.getElementById('result').innerHTML = '🎮 ¡Nueva partida iniciada! Elige tu jugada.';
}


// Función para jugar contra otro jugador online (a futuro)
function multiplayerSetup() {
	// Aquí puedes implementar la lógica de un servidor o un sistema de salas para juego online
	document.getElementById('multiplayer-section').classList.remove('hidden');
}
