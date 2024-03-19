document.addEventListener('DOMContentLoaded', function() {
    const originalTime = '25:00';
    let countdown;
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('Start');
    const stopButton = document.getElementById('Stop');
    const presets = [document.getElementById('preset1'), document.getElementById('preset2'), document.getElementById('preset3'), document.getElementById('preset4')];
    let currentPresetTime = '25:00'; // Variable to keep track of the current preset time
    let completedSessions = new Array(10).fill(false); // Initialize array to track completion

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) + expires + "; path=/";
    }

    function getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length));
        }
        return null;
    }

    function checkCookie() {
        let completed = getCookie("completedSessions");
        if (completed) {
            completedSessions = JSON.parse(completed);
            updateCompletedPomodoros();
        } else {
            setCookie("completedSessions", completedSessions, 365); // Initialize cookie with the array
        }
    }

    function updateCompletedPomodoros() {
        completedSessions.forEach((completed, index) => {
            let pomodoro = document.getElementById('pomodoro' + (index + 1));
            pomodoro.style.backgroundColor = completed ? 'green' : 'white';
        });
    }

    presets.forEach(preset => {
        preset.addEventListener('click', function() {
            const presetTimes = { 'preset1': '25:00', 'preset2': '45:00', 'preset3': '60:00', 'preset4': '00:04' };
            const newTime = presetTimes[this.id];
            updateTimer(newTime);
            currentPresetTime = newTime; // Keep the current preset time updated
        });
    });

    function startTimer(duration) {
        clearInterval(countdown);
        const startTime = Date.now();
        const endTime = startTime + duration * 1000;
        countdown = setInterval(() => {
            const secondsLeft = Math.round((endTime - Date.now()) / 1000);
            if (secondsLeft < 0) {
                clearInterval(countdown);
                for (let i = 0; i < completedSessions.length; i++) {
                    if (!completedSessions[i]) {
                        completedSessions[i] = true;
                        break;
                    }
                }
                setCookie("completedSessions", completedSessions, 365);
                updateCompletedPomodoros();
                timerDisplay.textContent = currentPresetTime; // Reset the display
                return;
            }
            const minutes = Math.floor(secondsLeft / 60);
            const remainingSeconds = secondsLeft % 60;
            timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        }, 1000);
    }

    startButton.addEventListener('click', function() {
        const timeArray = currentPresetTime.split(':');
        const seconds = parseInt(timeArray[0], 10) * 60 + parseInt(timeArray[1], 10);
        startTimer(seconds);
    });

    stopButton.addEventListener('click', function() {
        clearInterval(countdown);
        timerDisplay.textContent = currentPresetTime;
    });

    function updateTimer(newTime) {
        clearInterval(countdown);
        timerDisplay.textContent = newTime;
    }

    checkCookie();
});
