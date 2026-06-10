// ================================================
// DOM SELECTION (HTML Elements)
// ================================================

// Header
const headerOptions     = document.querySelector('.header-options');

// Main Section
const theTimer          = document.getElementById('theTimer');
const btnPlayPause      = document.getElementById('btnPlayPause');
const btnReset          = document.getElementById('btnReset');
const modesPanel        = document.getElementById('modesMenu');
const btnToggleMenu     = document.getElementById('btnToggleMenu');
const modesList         = document.querySelector('.modes-list'); // It will get the first element, instead of all elements as getElementByClassName()

const circleProgress = document.querySelector('.progress-ring__circle');

// ================================================
// STORAGE HANDLER
// ================================================

/**
 * Get the object containing the user's time preferences, converts to JSON and save it in local storage
 * @param {object} timeConfigured - User's time preferences
 */
function syncSettingsStorage(timeConfigured) {
    localStorage.setItem('savedTimeSettings', JSON.stringify(timeConfigured));
}

/**
 * Get the user's preferences from the local storage.
 * If doesn't find it, returns a default time settings
 * @returns {object} - Time of each mode
 */
function loadSettingsStorage() {
    const timeSettingsSaved = localStorage.getItem('userTimerSettings');

    if (timeSettingsSaved) {
        return JSON.parse(timeSettingsSaved);
    } else {
        return {
            1: 25 * 60, // Focus: 25 min
            2: 5 * 60, // Short Break: 5 min
            3: 15 * 60 // Long Break: 15 min
        }
    }
}

// ================================================
// APPLICATION STATE
// ================================================

/**
 * Time Settings to each mode (in seconds)
 */
let modeConfigurations = loadSettingsStorage();

let timerInterval   = null;
let isRunning       = false;
/**
 * 1 = Focus, 2 = Short Break, 3 = Long Break
 */
let currentMode     = 1;
let timeLeft        = modeConfigurations[currentMode];

const totalCircumference = 848.23;

// ================================================
//  UTILITY HELPERS
// ================================================

/**
 * Get the total seconds and converts to minutes : seconds
 * @param {number} totalSeconds 
 * @returns {string} - formatted string time 00:00
 */
function formatTime (totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// ================================================
// TIMER AND INTERFACE CONTROLLERS (UI Actions)
// ================================================

function openSettingsPanel() {
    
}

/**
 * Controls button main play/pause, and it starts the timer
 */
function handlePlayPause() {
    if (isRunning) {
        // if the timer is running, it will stop
        clearInterval(timerInterval);
        isRunning = false;
        btnPlayPause.innerHTML = '<i class="fa-solid fa-play"></i>';
    } else {
        // if the timer is stopped, it will start
        isRunning = true;
        btnPlayPause.innerHTML = '<i class="fa-solid fa-pause"></i>';

        // Creates the interval which runs each 1 second (1000ms)
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
                updateProgressCircle();
            } else {
                // Time's up
                handleTimerFinished();
            }
        }, 1000);
    }
}

/**
 * Do the math to shrink the SVG bar as time passes
 */
function updateProgressCircle() {
    // Finds the current mode total time
    const maxTime = modeConfigurations[currentMode];

    // Calculates the time passed proportion (0 to 1)
    const timePassedFraction = (maxTime - timeLeft) / maxTime;

    // Finds out how many pixels must "push" the line off (offset)
    const offset = timePassedFraction * totalCircumference;

    // Injects the value in the SVG's CSS
    circleProgress.style.strokeDashoffset = offset;
}

/**
 * Reset the timer to current mode initial state
 */
function resetTimer() {
    // Stops any running interval
    clearInterval(timerInterval);
    isRunning = false;

    // Buttons and states go back to default settings
    btnPlayPause.innerHTML = '<i class="fa-solid fa-play"></i>';
    timeLeft = modeConfigurations[currentMode];

    // Forces the screen to refresh
    updateTimerDisplay();

    // Reset the circle to be 100% filled (offset zero)
    circleProgress.style.strokeDashoffset = 0;
}

/**
 * Function triggered when the timer reaches zero
 */
function handleTimerFinished() {
    clearInterval(timerInterval);
    isRunning = false;
    btnPlayPause.innerHTML = '<i class="fa-solid fa-play"></i>';

    // Simple feedback for now
    alert('Time completed! Well done!');

    resetTimer();
}

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
 * Dynamically changes CSS variables (:root) based on the active mode, and changes activated button class
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

/**
 * Saves the event listeners and it is called when the script is read
 */
function initializeApp() {
    // Arrow Menu Listener
    btnToggleMenu.addEventListener('click', toggleModesMenu);

    // Mode Buttons
    modesList.addEventListener('click', changeMode);

    // Timer trigger buttons
    btnPlayPause.addEventListener('click', handlePlayPause);
    btnReset.addEventListener('click', resetTimer);

    // Initial circle settings (Ensures that starts filled)
    circleProgress.style.strokeDasharray = totalCircumference;
    circleProgress.style.strokeDashoffset = 0;

    updateTimerDisplay();
}

// Triggers the initialization as soon as the script is read.
initializeApp();