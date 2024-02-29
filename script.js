document.addEventListener('DOMContentLoaded', function() {
    const currentPhaseLabel = document.getElementById('current-phase');
    const timerDisplay = document.getElementById('timer-display');
    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');
    const resetButton = document.getElementById('reset-button');
    const prepareDurationInput = document.getElementById('prepare-duration');
    const restDurationInput = document.getElementById('rest-duration');
    const workDurationInput = document.getElementById('work-duration');
    const cyclesInput = document.getElementById('cycles');
    const tabatasInput = document.getElementById('tabatas');

    let currentSeconds = 0;
    let intervalId = null;
    let currentCycle = 0;
    let currentTabata = 0;
    let isWorkPhase = false;

    // Audio element for beep sound
    const beepAudio = new Audio('beep.mp3'); // Replace 'beep.mp3' with the actual audio file path

    function updateTimerDisplay() {
        const minutes = Math.floor(currentSeconds / 60);
        const seconds = currentSeconds % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function decrementTimer() {
        if (currentSeconds > 0) {
            currentSeconds--;
            updateTimerDisplay();
        } else {
            // Play beep sound on important task changes (start, rest, work)
            if (isWorkPhase && currentSeconds === 0) {
                beepAudio.play();
            }

            if (currentSeconds === 0 && currentCycle === cyclesInput.value - 1 && currentTabata === tabatasInput.value - 1) {
                // All cycles and tabatas completed, stop timer
                clearInterval(intervalId);
                intervalId = null;
                startButton.disabled = false;
                stopButton.disabled = true;
                resetButton.disabled = false;
            } else if (currentSeconds === 0) {
                // Switch to next phase/cycle/tabata
                if (isWorkPhase) {
                    currentPhaseLabel.textContent = 'Rest'; // Update current phase label
                    currentSeconds = restDurationInput.value;
                    isWorkPhase = false;
                    document.body.style.backgroundColor = '#0099cc'; // Change background color for rest
                } else {
                    if (currentCycle === cyclesInput.value - 1) {
                        currentTabata++;
                        currentCycle = 0;
                    } else {
                        currentCycle++;
                    }
                    currentPhaseLabel.textContent = 'Work'; // Update current phase label
                    currentSeconds = workDurationInput.value;
                    isWorkPhase = true;
                    document.body.style.backgroundColor = '#ff4444'; // Change background color for work
                    beepAudio.play(); // Play beep sound for work start
                }
            }
        }
    }

    function startTimer() {
        if (!intervalId) {
            currentSeconds = prepareDurationInput.value;
            currentPhaseLabel.textContent = 'Prepare'; // Update current phase label
            isWorkPhase = false;
            document.body.style.backgroundColor = '#66ff99'; // Change background color for prepare
            intervalId = setInterval(decrementTimer, 1000);
            startButton.disabled = true;
            stopButton.disabled = false;
            resetButton.disabled = true;
        }
    }

    function stopTimer() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            startButton.disabled = false;
            stopButton.disabled = true;
        }
    }

    function resetTimer() {
        clearInterval(intervalId);
        intervalId = null;
        currentSeconds = 0;
        currentCycle = 0;
        currentTabata = 0;
        isWorkPhase = false;
        updateTimerDisplay();
        startButton.disabled = false;
        stopButton.disabled = true;
        resetButton.disabled = false;
        document.body.style.backgroundColor = '#f5f5f5'; // Reset background color
    }

    startButton.addEventListener('click', startTimer);
    stopButton.addEventListener('click', stopTimer);
    resetButton.addEventListener('click', resetTimer);
});
