let laps = document.querySelectorAll('#timekeeper .laps');
let bestLaps = document.querySelectorAll('#timekeeper .bestLap');
let lapTimes = document.querySelectorAll('#timekeeper .lapTimes');
let totalTimes = document.querySelectorAll('#timekeeper .totalTime');
let lapAverages = document.querySelectorAll('#timekeeper .lapAverage');

const MIN_TIME_DIFFERENCE_MS = 1000;

// timekeeper for car 0 and 1
let timekeeper = [[], []];
let timetable = getTimetableFields();
var timekeeping = true;

function getTimetableFields() {
    let timetable = [];
    for (var i = 0; i < laps.length; i++) {
        timetable.push({
            'laps': laps[i],
            'totalTime': totalTimes[i],
            'bestLap': bestLaps[i],
            'lapTimes': lapTimes[i],
            'lapAverage': lapAverages[i]
        });
    }
    return timetable;
}

function formatMillis(millis) {
    let seconds = Math.floor(millis / 1000);
    let remainingMillis = millis - seconds * 1000;
    return `${seconds}s ${remainingMillis}ms`;
}

function resetTimekeeper() {
    stopTimekeeper();
    for (var i = 0; i < laps.length; i++) {
        laps[i].innerHTML = '-';
        bestLaps[i].innerHTML = '-';
        totalTimes[i].innerHTML = '-';
        lapAverages[i].innerHTML = '-';
        while (lapTimes[i].lastElementChild) {
            lapTimes[i].removeChild(lapTimes[i].lastElementChild);
        }
    }
    let startTime = new Date().getTime();
    timekeeper[0] = [startTime];
    timekeeper[1] = [startTime];
    timekeeping = true;
}

function stopTimekeeper() {
    timekeeping = false;
}

function detectCar(carId) {
    if (!timekeeping) {
        return;
    }
    let now = new Date().getTime();
    var timeDifference = now - timekeeper[carId][timekeeper[carId].length - 1];

    if (timeDifference < MIN_TIME_DIFFERENCE_MS) {
        return;
    }

    timekeeper[carId].push(now);
    let li = document.createElement('li');
    li.innerHTML = `<b>${formatMillis(timeDifference)}</b>`;
    timetable[carId].lapTimes.appendChild(li);

    var fastestTime = Number.MAX_VALUE;
    var totalTime = 0;
    for (var i = 1; i < timekeeper[carId].length; i++) {
        let diff = timekeeper[carId][i] - timekeeper[carId][i - 1];
        if (diff < fastestTime) {
            fastestTime = diff;
        }
        totalTime += diff;
    }

    let laps = timekeeper[carId].length - 1;
    timetable[carId].laps.innerHTML = laps;
    timetable[carId].bestLap.innerHTML = formatMillis(fastestTime);
    timetable[carId].totalTime.innerHTML = formatMillis(totalTime);
    timetable[carId].lapAverage.innerHTML = formatMillis(Math.floor(totalTime / laps));
}