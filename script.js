// Get HTML elements
const addTimerButton = document.getElementById('add-timer');
const pomodoroButton = document.getElementById('pomodoro-timer');
const themeToggleButton = document.getElementById('theme-toggle');
const stopMusicButton = document.getElementById('stop-music');
const timersList = document.getElementById('timers-list');
const alarmSound = new Audio('aggressive-phonk-phonk-2024-mix-239735.mp3'); // Sound alert for timers

// Function to play sound immediately when time is up
function playSound() {
    alarmSound.play().catch((error) => {
        console.error("Error playing sound:", error);
    });
}

// Function to stop sound if it's playing
function stopSound() {
    alarmSound.pause();
    alarmSound.currentTime = 0; // Reset playback position to start
}

// Function to format time in MM:SS
function formatTime(minutes, seconds) {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Function to create a new timer based on user input
function createTimer(minutes, seconds, timerType) {
    const timerId = Date.now(); // Unique ID for each timer
    const timerDiv = document.createElement('div');
    timerDiv.classList.add('timer');

    // Set the timer type as the title (if none provided, use "Custom Timer")
    const timerTitle = timerType || 'Custom Timer';

    timerDiv.innerHTML = `
        <div class="timer-title">${timerTitle}</div>
        <div id="timer-display-${timerId}" class="timer-display">00:00</div>
        <button class="start-btn">Start</button>
        <button class="stop-btn" disabled>Stop</button>
        <button class="reset-btn" disabled>Reset</button>
        <button class="delete-btn">Delete Timer</button>
    `;
    timersList.appendChild(timerDiv);

    const timerDisplay = timerDiv.querySelector(`#timer-display-${timerId}`);
    const startButton = timerDiv.querySelector('.start-btn');
    const stopButton = timerDiv.querySelector('.stop-btn');
    const resetButton = timerDiv.querySelector('.reset-btn');
    const deleteButton = timerDiv.querySelector('.delete-btn');

    let currentMinutes = minutes;
    let currentSeconds = seconds;
    let timerInterval;

    // Update timer display
    function updateTimerDisplay() {
        if (currentSeconds === 0 && currentMinutes === 0) {
            clearInterval(timerInterval);
            playSound(); // Play sound when timer finishes immediately
            alert('Time is up!');
            resetTimer();
            return;
        }

        if (currentSeconds === 0) {
            currentMinutes--;
            currentSeconds = 59;
        } else {
            currentSeconds--;
        }

        timerDisplay.textContent = formatTime(currentMinutes, currentSeconds);
    }

    // Start Timer
    startButton.addEventListener('click', () => {
        timerInterval = setInterval(updateTimerDisplay, 1000);
        startButton.disabled = true;
        stopButton.disabled = false;
        resetButton.disabled = false;
    });

    // Stop Timer
    stopButton.addEventListener('click', () => {
        clearInterval(timerInterval);
        startButton.disabled = false;
        stopButton.disabled = true;
    });

    // Reset Timer
    resetButton.addEventListener('click', () => {
        clearInterval(timerInterval);
        currentMinutes = minutes;
        currentSeconds = seconds;
        timerDisplay.textContent = formatTime(currentMinutes, currentSeconds);
        startButton.disabled = false;
        stopButton.disabled = true;
        resetButton.disabled = true;
    });

    // Delete Timer
    deleteButton.addEventListener('click', () => {
        timersList.removeChild(timerDiv); // Remove the timer from the DOM
        clearInterval(timerInterval); // Clear the interval if the timer is deleted
    });
}

// Add multiple timers by user input
addTimerButton.addEventListener('click', () => {
    const minutes = parseInt(document.getElementById('minutes-input').value) || 0;
    const seconds = parseInt(document.getElementById('seconds-input').value) || 0;
    const timerType = document.getElementById('timer-type-input').value.trim();

    if (minutes > 0 || seconds > 0) {
        createTimer(minutes, seconds, timerType);
    } else {
        alert('Please enter a valid time.');
    }
});

// Pomodoro Timer functionality
pomodoroButton.addEventListener('click', () => {
    // Create a work timer (25 minutes)
    createTimer(25, 0, 'Pomodoro Timer'); // Pomodoro work timer is always 25 minutes

    // After 25 minutes, trigger break timer (5 minutes)
    setTimeout(() => {
        alert('Time to take a break!');
        createTimer(5, 0, 'Break Timer'); // Break timer is always 5 minutes
    }, 25 * 60 * 1000); // 25 minutes in milliseconds
});

// Toggle light/dark mode
themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Stop the music (alarm sound) when the "Stop Music" button is clicked
stopMusicButton.addEventListener('click', () => {
    stopSound();
});
