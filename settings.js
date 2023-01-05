let context = document.getElementById("canvas").getContext('2d', { 'willReadFrequently': true });

let adjustColor = getCSSColor([250, 0, 0, .25]);
let detectedColor = getCSSColor([0, 250, 0, 0.8]);

var rectLeft = { x: 0, y: 0, width: 0, height: 0 };
var rectRight = { x: 0, y: 0, width: 0, height: 0 };
var averageColorLeft = false;
var averageColorRight = false;

var captureDefault = false;

let settings = {
    detectionWidth: canvas.width / 6,
    detectionHeight: canvas.height / 2,
    detectionDistance: canvas.width / 4,
    colorThreshold: 40,
    defaultColorLeft: false,
    defaultColorRight: false,
    blockSize: 5
};

let fps = {
    frameCount: 0,
    timeMillis: 0
};

setRange('detectionWidth', settings.detectionWidth, 0, canvas.width / 2);
setRange('detectionHeight', settings.detectionHeight, 0, canvas.height);

Array.from(document.querySelectorAll('input[type="range"]')).forEach(input => {
    input.previousElementSibling.firstElementChild.value = input.value;
    input.addEventListener('input', function (event) {
        input.previousElementSibling.firstElementChild.value = input.value;
        settings[input.id] = parseInt(input.value);
    }, true)
});

function startVideo() {
    (async () => {
        video.srcObject = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                facingMode: 'environment',
                width: canvas.width,
                height: canvas.height
            }
        });
        video.requestVideoFrameCallback(captureFrame);
    })();
}

function captureFrame() {
    rectLeft.x = (canvas.width - settings.detectionDistance) / 2 - settings.detectionWidth;
    rectLeft.y = (canvas.height - settings.detectionHeight) / 2;
    rectLeft.width = settings.detectionWidth;
    rectLeft.height = settings.detectionHeight;

    rectRight.x = (canvas.width + settings.detectionDistance) / 2;
    rectRight.y = (canvas.height - settings.detectionHeight) / 2;
    rectRight.width = settings.detectionWidth;
    rectRight.height = settings.detectionHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    averageColorLeft = getAverageRGBwithBlock(context.getImageData(rectLeft.x, rectLeft.y, rectLeft.width, rectLeft.height), settings.blockSize);;
    averageColorRight = getAverageRGBwithBlock(context.getImageData(rectRight.x, rectRight.y, rectRight.width, rectRight.height), settings.blockSize);

    renderSettings();

    if (screens[SCREENS.TIMEKEEPER].style.display != 'none') {
        if (calculateColorDifference(settings.defaultColorLeft, averageColorLeft) > settings.colorThreshold) {
            detectCar(true);
        }
        if (calculateColorDifference(settings.defaultColorRight, averageColorRight) > settings.colorThreshold) {
            detectCar(false);
        }
    }

    video.requestVideoFrameCallback(captureFrame);
}

function renderSettings() {
    let maxDistance = Math.max(0, canvas.width - settings.detectionWidth * 2);
    setRange('detectionDistance', Math.min(settings.detectionDistance, maxDistance), 0, maxDistance);

    // set default detection colors
    if (captureDefault) {
        captureDefault = false;
        settings.defaultColorLeft = averageColorLeft;
        settings.defaultColorRight = averageColorRight;
    }

    // check if color difference exceeds threshold
    var drawColorLeft = adjustColor;
    var drawColorRight = adjustColor;
    if (settings.defaultColorLeft && settings.defaultColorRight) {
        if (calculateColorDifference(settings.defaultColorLeft, averageColorLeft) > settings.colorThreshold) {
            drawColorLeft = detectedColor;
        }
        if (calculateColorDifference(settings.defaultColorRight, averageColorRight) > settings.colorThreshold) {
            drawColorRight = detectedColor;
        }
    }

    // draw detection rectangles
    context.fillStyle = drawColorLeft;
    context.fillRect(rectLeft.x, rectLeft.y, rectLeft.width, rectLeft.height);
    context.fillStyle = drawColorRight;
    context.fillRect(rectRight.x, rectRight.y, rectRight.width, rectRight.height);

    // draw fps
    let nowMs = new Date().getTime();
    if (fps.timeMillis == 0) {
        fps.timeMillis = nowMs;
        fps.frameCount = 0;
    } else {
        fps.frameCount++;
        let framesPerSecond = Math.round(fps.frameCount / (nowMs - fps.timeMillis) * 1000);
        context.fillStyle = adjustColor;
        context.fillText(`${framesPerSecond} fps`, 2, 10);
    }
}