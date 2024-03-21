document.addEventListener('DOMContentLoaded', function() {
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('Start');
    const stopButton = document.getElementById('Stop');
    const presets = [document.getElementById('preset1'), document.getElementById('preset2'), document.getElementById('preset3'), document.getElementById('preset4')];
    const resetButton = document.querySelector('#ResetButton');
    let countdown;
    let currentPresetTime = '25:00';
    let currentPresetIndex = 0;
    let completedSessions = new Array(10).fill(false);
    let isTimerActive = false;
    let currentPhase = 'work';
    const workTimes = { 'preset1': '25:00', 'preset2': '45:00', 'preset3': '60:00', 'preset4': '00:05' };
    const restTimes = { 'preset1': '05:00', 'preset2': '09:00', 'preset3': '12:00', 'preset4': '00:10' };
    const fireworksContainer = document.getElementById('fireworks');
    const fireworks = new Fireworks.default(fireworksContainer, {});
    let endTime;
    let pausedTime = 0;

    
    function stopSound() {
        const sound = document.getElementById('alarm');
        sound.pause();
        sound.currentTime = 0; // Rewind to the start
    }

    document.getElementById('fullscreen-btn').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });
    

    function updateTimerDisplay(time) {
        timerDisplay.textContent = time;
    }

    function resetTimerState() {
        clearInterval(countdown);
        isTimerActive = false;
        startButton.textContent = 'Start';
        stopSound();
        if (currentPhase === 'rest') stopButton.textContent = 'Skip';
        else stopButton.textContent = 'Stop';
    }
    

    function handleSessionCompletion() {
        clearInterval(countdown);
        isTimerActive = false;
        startButton.textContent = 'Pause';
        let completedCount = completedSessions.filter(Boolean).length;
        if (currentPhase === 'work') {
            if (completedCount < completedSessions.length) {
                completedSessions[completedCount] = true;
                updateCompletedPomodoros();
                playSoundForDuration('alarm', 3000);
                fireworks.start();
                setTimeout(() => fireworks.stop(), 5000);
                if (completedCount === 9) {
                    alert('All Pomodoros Completed!');
                    return;
                }
                transitionToRest();
            }
        } else if (completedCount < 10) {
            transitionToWork();
        }
        if (currentPhase === 'rest') stopButton.textContent = 'Skip';
        else stopButton.textContent = 'Stop';
    }
    

    function transitionToRest() {
        currentPhase = 'rest';
        stopButton.textContent = 'Skip';
        let restTime = restTimes[`preset${currentPresetIndex + 1}`];
        updateTimerDisplay(restTime);
        startTimer(parseInt(restTime.split(':')[0]) * 60 + parseInt(restTime.split(':')[1]), true);
    }
    

    function transitionToWork() {
        currentPhase = 'work';
        let workTime = workTimes[`preset${currentPresetIndex + 1}`];
        updateTimerDisplay(workTime);
        startTimer(parseInt(workTime.split(':')[0]) * 60 + parseInt(workTime.split(':')[1]), true);
    }

 // Adjust startTimer function
function startTimer(duration, autoStart = false) {
    clearInterval(countdown); // Ensure no previous intervals are running
    const startTime = Date.now();
    endTime = startTime + duration * 1000; // This sets the end time based on the duration provided

    countdown = setInterval(() => {
        const secondsLeft = Math.round((endTime - Date.now()) / 1000);
        if (secondsLeft < 0) {
            clearInterval(countdown);
            handleSessionCompletion();
        } else {
            isTimerActive = true;
            startButton.textContent = 'Pause'; // Make sure this button always reflects the action to pause the timer
            const minutes = Math.floor(secondsLeft / 60);
            const remainingSeconds = secondsLeft % 60;
            updateTimerDisplay(`${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`);
        }
    }, 1000);
}
    

    startButton.addEventListener('click', function() {
        if (startButton.textContent === 'Start' || startButton.textContent === 'Resume') {
            if (!isTimerActive) {
                let duration;
                if (pausedTime > 0) {
                    duration = pausedTime / 1000;
                    pausedTime = 0; // Reset pausedTime
                } else {
                    duration = parseInt(currentPresetTime.split(':')[0]) * 60 + parseInt(currentPresetTime.split(':')[1]);
                }
                startTimer(duration, false);
            } else {
                // This block is for pausing
                pausedTime = endTime - Date.now();
                clearInterval(countdown);
                isTimerActive = false;
                startButton.textContent = 'Resume';
            }
        } else {
            // This block handles the case when the button says 'Pause', meaning the timer is active and should be paused
            pausedTime = endTime - Date.now();
            clearInterval(countdown);
            isTimerActive = false;
            startButton.textContent = 'Resume';
        }
    });
    

    stopButton.addEventListener('click', function() {
        if (currentPhase === 'rest' && stopButton.textContent === 'Skip') {
            handleSessionCompletion();
            stopButton.textContent = 'Stop'; // Change to stop after skipping
        } else {
            resetTimerState();
            updateTimerDisplay(currentPresetTime);
        }
    });
    

    /* 
    
    aggiungi al gpt che deve splittare le funzioni e le righe di codice in diversi text-box che puoi copypastare, così non devi evidenziarli tutti col mouse per copy-pastare
    
    */
    

    resetButton.addEventListener('click', function() {
        resetTimerState();
        completedSessions.fill(false);
        updateCompletedPomodoros();
        currentPresetTime = workTimes[`preset${currentPresetIndex + 1}`];
        updateTimerDisplay(currentPresetTime);
        currentPhase = 'work';
        startButton.textContent = 'Start';
        stopButton.textContent = 'Stop';
    });
    

    presets.forEach((preset, index) => {
        preset.addEventListener('click', function() {
            resetTimerState();
            currentPresetIndex = index;
            currentPresetTime = workTimes[preset.id];
            updateTimerDisplay(currentPresetTime);
            currentPhase = 'work';
            startButton.textContent = 'Start';
            stopButton.textContent = 'Stop';
        });
    });
    

    function updateCompletedPomodoros() {
        completedSessions.forEach((completed, index) => {
            let pomodoro = document.getElementById('pomodoro' + (index + 1));
            pomodoro.style.backgroundColor = completed ? 'green' : 'white';
        });
    }

    function playSoundForDuration(soundId, duration) {
        const sound = document.getElementById(soundId);
        sound.play();
        setTimeout(() => {
            sound.pause(); 
            sound.currentTime = 0;
        }, duration);
    }
});

