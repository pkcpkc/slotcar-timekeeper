const MIN_TIME_DIFFERENCE_MS = 2000;

// timekeeper for car 0 and 1
let timekeeper = [[], []];

let timetable = [
    getTimetableFields(0),
    getTimetableFields(1),
];

function getTimetableFields(index) {
    return {
        'laps': document.querySelector(`#timekeeper div:nth-child(${index + 1}) span.laps`),
        'bestLap': document.querySelector(`#timekeeper div:nth-child(${index + 1}) span.bestLap`),
        'lapTimes': document.querySelector(`#timekeeper div:nth-child(${index + 1}) ol.lapTimes`)
    }
}

function formatMillis(millis) {
    let seconds = Math.floor(millis / 1000);
    let remainingMillis = millis - seconds * 1000;
    return `${seconds}s ${remainingMillis}ms`;
}

function detectCar(carId) {
    let now = new Date().getTime();
    var timeDifference = now - timekeeper[carId][timekeeper[carId].length - 1];

    if (timeDifference < MIN_TIME_DIFFERENCE_MS) {
        return;
    }

    timekeeper[carId].push(now);
    let li = document.createElement('li');
    li.innerHTML = formatMillis(timeDifference);
    timetable[carId].lapTimes.appendChild(li);

    var fastestTime = Number.MAX_VALUE;
    for (var i = 1; i < timekeeper[carId].length; i++) {
        let diff = timekeeper[carId][i] - timekeeper[carId][i - 1];
        if (diff < fastestTime) {
            fastestTime = diff;
        }
    }

    timetable[carId].laps.innerHTML = timekeeper[carId].length - 1;
    timetable[carId].bestLap.innerHTML = formatMillis(fastestTime);
}