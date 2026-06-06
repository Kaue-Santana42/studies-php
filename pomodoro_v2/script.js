// ================================================
// DOM SELECTION (HTML Elements)
// ================================================

const theTimer          = document.getElementById('theTimer');
const btnPlayPause      = document.getElementById('btnPlayPause');
const btnReset          = document.getElementById('btnReset');
const modesPanel        = document.getElementById('modesMenu');
const btnToggleMenu     = document.getElementById('btnToggleMenu');
const modesList         = document.querySelector('.modes-list'); // It will get the first element, instead of all elements as getElementByClassName()

// ================================================
// APPLICATION STATE
// ================================================

let timerInterval   = null;
let isRunning       = false;
let currentMode     = 1; // 1 = Focus, 2 = Short Break, 3 = Long Break
let timeLeft        = 25 * 60; // 25 minutes in seconds (standard)

// Time Settings to each mode (in seconds)
const modeConfigurations = {
    1: 25 * 60, // Focus: 25 min
    2: 5 * 60, // Short Break: 5 min
    3: 15 * 60 // Long Break: 15 min
};

// ================================================
//  UTILITY HELPERS
// ================================================

function formatTime (totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// ================================================
// INTERFACE CONTROLLERS (UI Actions)
// ================================================

/**
 * Turn on/off the class 'collapsed' to open and close the modes panel
 */
function toggleModesMenu() {
    modesPanel.classList.toggle('collapsed');
}

/**
 * Controls the mode swapping (Focus, Short Break, Long Break)
 * Uses the accent colors and updates the timer state
 * @param {MouseEvent} event - click on the mode
 */
function changeMode(event) {
    const targetButton = event.target;

    // If user clicked on the background of the list and it is not a button, ignores it
    if (!targetButton.classList.contains('mode-option')) return;

    // Extracts the mode number by using dataset
    const selectedMode = parseInt(targetButton.dataset.mode);

    // If the mode clicked is already activated, returns
    if (selectedMode === currentMode) return;

    // Updates the state
    currentMode = selectedMode;
    timeLeft = modeConfigurations[currentMode]; // Get the seconds from the object

    // Stop the timer if it is running (security and optimization)
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false
        btnPlayPause.innerHTML = '<i class="fa-solid fa-play"></i>'
    }

    // Update the UI
    updateUiColors(currentMode);
    updateTimerDisplay();

    // Close the bottom sheet automatically after the choice (better mobile UX)
    modesPanel.classList.add('collapsed');
}

/**
 * Dynamically changes CSS variables (:root) based on the active mode
 * @param {number} mode - The current option mode
 */
function updateUiColors(mode) {
    let newHexColor = '#ff6b6b'; // Standard: Focus
    let newRgbColor = '255, 107, 107';

    if (mode === 2) {
        newHexColor = '#4dadf7'; // Short Break
        newRgbColor = '77, 173, 247';
    } else if (mode === 3) {
        newHexColor = '#9775fa'; // Long Break
        newRgbColor = '151, 117, 250';
    }

    // Injects the new colors directly into the global CSS variables
    document.documentElement.style.setProperty('--accent-color', newHexColor);
    document.documentElement.style.setProperty('--accent-color-rgb', newRgbColor);

    // Update the class 'active' in the buttons' mode
    const buttons = document.querySelectorAll('.mode-option');
    buttons.forEach(btn => {
        if (parseInt(btn.dataset.mode) === mode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

/**
 * Updates the timer text on the screen
 */
function updateTimerDisplay() {
    theTimer.textContent = formatTime(timeLeft);
}

// ================================================
// EVENT LISTENERS & INITIALIZATION
// ================================================

function initializeApp() {
    // Arrow Menu Listener
    btnToggleMenu.addEventListener('click', toggleModesMenu);

    modesList.addEventListener('click', changeMode);
}

// Triggers the initialization as soon as the script is read.
initializeApp();