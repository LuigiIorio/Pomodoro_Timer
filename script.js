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
    

    const stopSound = () => {
        const sound = document.getElementById('alarm');
        sound.pause();
        sound.currentTime = 0; // Rewind to the start
    };


    document.getElementById('Stop').addEventListener('click', function() {
        clearInterval(countdown);
        isTimerActive = false;
        stopSound(); // Add this line to stop the sound when "Stop" is clicked
        updateButtonForPhase();
        updateTimerDisplay(currentPresetTime);
    });

    function updateTimerDisplay(time) {
        timerDisplay.textContent = time;
    }

    function updateButtonForPhase() {
        if (currentPhase === 'rest') {
            stopButton.textContent = 'Skip';
        } else {
            stopButton.textContent = 'Stop';
        }
    }

    function startTimer(duration) {
        clearInterval(countdown);
        isTimerActive = true;
        const startTime = Date.now();
        const endTime = startTime + duration * 1000;
        countdown = setInterval(() => {
            const secondsLeft = Math.round((endTime - Date.now()) / 1000);
            if (secondsLeft < 0) {
                clearInterval(countdown);
                isTimerActive = false;
                let completedCount = completedSessions.filter(Boolean).length;
                if (currentPhase === 'work') {
                    if (completedCount < completedSessions.length) {
                        completedSessions[completedCount] = true;
                        updateCompletedPomodoros();
                        playSoundForDuration('alarm', 3000); // Play sound for 3 seconds
                        if (completedCount === 9) { // Check if 10th pomodoro just completed
                            alert('All Pomodoros Completed!');
                            return;
                        }
                        currentPhase = 'rest';
                        let restTime = restTimes[`preset${currentPresetIndex + 1}`];
                        updateTimerDisplay(restTime);
                        const restDuration = parseInt(restTime.split(':')[0]) * 60 + parseInt(restTime.split(':')[1]);
                        startTimer(restDuration);
                    } 
                } else {
                    if (completedCount < 10) { // If not all pomodoros are completed, start next pomodoro
                        currentPhase = 'work';
                        let workTime = workTimes[`preset${currentPresetIndex + 1}`];
                        updateTimerDisplay(workTime);
                        const workDuration = parseInt(workTime.split(':')[0]) * 60 + parseInt(workTime.split(':')[1]);
                        startTimer(workDuration);
                        playSoundForDuration('alarm', 3000); // Play sound for 3 seconds
                    }
                }
                updateButtonForPhase();
                return;
            }
            const minutes = Math.floor(secondsLeft / 60);
            const remainingSeconds = secondsLeft % 60;
            updateTimerDisplay(`${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`);
        }, 1000);
    }

    presets.forEach((preset, index) => {
        preset.addEventListener('click', function() {
            if (isTimerActive) {
                clearInterval(countdown);
                isTimerActive = false;
            }
            currentPresetIndex = index;
            const workTime = workTimes[preset.id];
            updateTimerDisplay(workTime);
            currentPresetTime = workTime;
            currentPhase = 'work';
            updateButtonForPhase();
        });
    });

    startButton.addEventListener('click', function() {

        if (completedSessions.filter(Boolean).length === 10) {
            completedSessions.fill(false);
            updateCompletedPomodoros();
        }

        if (!isTimerActive) {
            const seconds = parseInt(currentPresetTime.split(':')[0]) * 60 + parseInt(currentPresetTime.split(':')[1]);
            startTimer(seconds);
        }
    });

    stopButton.addEventListener('click', function() {
        if (currentPhase === 'rest') {
            clearInterval(countdown);
            isTimerActive = false;
            let nextWorkTime = workTimes[`preset${currentPresetIndex + 1}`];
            currentPhase = 'work';
            updateTimerDisplay(nextWorkTime);
            updateButtonForPhase();
            if (completedSessions.filter(Boolean).length < 10) {
                startTimer(parseInt(nextWorkTime.split(':')[0]) * 60 + parseInt(nextWorkTime.split(':')[1]));
            }
        } else {
            clearInterval(countdown);
            isTimerActive = false;
            updateButtonForPhase();
            updateTimerDisplay(currentPresetTime);
        }
    });

    resetButton.addEventListener('click', function() {
        if (isTimerActive) {
            clearInterval(countdown);
            isTimerActive = false;
        }
        completedSessions.fill(false);
        updateCompletedPomodoros();
        const workTime = workTimes[`preset${currentPresetIndex + 1}`];
        updateTimerDisplay(workTime);
        currentPresetTime = workTime;
    });
    
    function updateCompletedPomodoros() {
        completedSessions.forEach((completed, index) => {
            let pomodoro = document.getElementById('pomodoro' + (index + 1));
            pomodoro.style.backgroundColor = completed ? 'green' : 'white';
        });
    }
});

function playSoundForDuration(soundId, duration) {
    const sound = document.getElementById(soundId);
    sound.play();
    setTimeout(() => {
        sound.pause(); 
        sound.currentTime = 0;
    }, duration);
}
