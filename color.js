/**
* @param colorArray RGB array with length three and values 0-255, or RGBA array with length four (alpha value must be percentage).
*/
function getCSSColor(colorArray) {
    if (colorArray.length > 3) {
        return `rgba(${colorArray[0]},${colorArray[1]},${colorArray[2]},${colorArray[3]})`;
    } else {
        return `rgb(${colorArray[0]},${colorArray[1]},${colorArray[2]})`;
    }
}

function getAverageRGBwithBlock(imageData, blockSize) {
    const RGBA_ARRAY_LENGTH = 4;
    let length = imageData.data.length;
    let data = imageData.data;
    var count = 0;
    var rgb = [0, 0, 0];
    for (var i = 0; i < length; i += blockSize * RGBA_ARRAY_LENGTH) {
        count++;
        rgb[0] += data[i];
        rgb[1] += data[i + 1];
        rgb[2] += data[i + 2];
    }
    rgb[0] = ~~(rgb[0] / count);
    rgb[1] = ~~(rgb[1] / count);
    rgb[2] = ~~(rgb[2] / count);
    return rgb;
}

function calculateColorDifference(colorDefault, colorCurrent) {
    var diff = 0;
    for (var i = 0; i < colorDefault.length; i++) {
        diff += Math.abs(colorDefault[i] - colorCurrent[i]);
    }
    return diff;
}