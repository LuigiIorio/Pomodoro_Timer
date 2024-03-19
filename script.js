document.addEventListener('DOMContentLoaded', function() {
    const originalTime = '25:00';
    let countdown;
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('Start');
    const stopButton = document.getElementById('Stop');
    const preset1 = document.getElementById('preset1');
    const preset2 = document.getElementById('preset2');
    const preset3 = document.getElementById('preset3');

    timerDisplay.value = originalTime; // Set the initial timer display

    
    preset1.addEventListener('click', function() {
        updateTimer('25:00');
    });

    preset2.addEventListener('click', function() {
        updateTimer('45:00');
    });

    preset3.addEventListener('click', function() {
        updateTimer('60:00');
    });

    function startTimer(duration) {
        clearInterval(countdown);
        const startTime = Date.now();
        const endTime = startTime + duration * 1000;
        countdown = setInterval(() => {
            const secondsLeft = Math.round((endTime - Date.now()) / 1000);
            if (secondsLeft < 0) {
                clearInterval(countdown);
                timerDisplay.value = originalTime;
                return;
            }
            const minutes = Math.floor(secondsLeft / 60);
            const remainingSeconds = secondsLeft % 60;
            timerDisplay.value = `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        }, 1000);
    }

    
    startButton.addEventListener('click', function() {
        const timeArray = timerDisplay.value.split(':');
        const seconds = parseInt(timeArray[0], 10) * 60 + parseInt(timeArray[1], 10);
        startTimer(seconds);
    });

    stopButton.addEventListener('click', function() {
        clearInterval(countdown);
        timerDisplay.value = originalTime;
    });


    function updateTimer(newTime) {
        clearInterval(countdown);
        timerDisplay.value = newTime;
    }

    // Call updateTimer with the default time when the page loads
    updateTimer('25:00');

});
