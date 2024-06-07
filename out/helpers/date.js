"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editNCIndice = exports.getNCIndice = exports.getSelectedRange = exports.getAffectableIndices = exports.mergeTimeBars = exports.getSurroundTimebar = exports.getSurroundingDates = void 0;
function getSurroundingDates(targetDate, dates, getSize) {
    if (dates.indexOf(targetDate) === -1)
        dates.push(targetDate);
    dates.sort(function (a, b) { return a.localeCompare(b); });
    var targetIndex = dates.indexOf(targetDate);
    var startIndex = Math.max(0, targetIndex - getSize);
    var endIndex = Math.min(dates.length - 1, targetIndex + getSize);
    return {
        prevDates: dates.slice(startIndex, targetIndex),
        nextDates: dates.slice(targetIndex + 1, endIndex + 1)
    };
}
exports.getSurroundingDates = getSurroundingDates;
function getSurroundTimebar(dateRange, wd, wVal) {
    var mergedTimebar = "";
    for (var _i = 0, dateRange_1 = dateRange; _i < dateRange_1.length; _i++) {
        var d = dateRange_1[_i];
        var index = wd.indexOf(d);
        if (index !== -1) {
            mergedTimebar += wVal[index];
        }
    }
    return mergedTimebar;
}
exports.getSurroundTimebar = getSurroundTimebar;
function mergeTimeBars(sd, leftTB, rightTB) {
    return {
        startSelIdx: sd.startIndex + leftTB.length,
        endSelIdx: sd.endIndex + leftTB.length,
        value: leftTB + sd.timeBar + rightTB,
    };
}
exports.mergeTimeBars = mergeTimeBars;
function getAffectableIndices(mTB, cutSize) {
    return {
        affectedStartIdx: Math.max(0, mTB.startSelIdx - cutSize),
        affectedEndIdx: Math.min(mTB.value.length - 1, mTB.endSelIdx + cutSize)
    };
}
exports.getAffectableIndices = getAffectableIndices;
function getSelectedRange(start, end) {
    var range = [];
    for (var i = start; i <= end; i++) {
        range.push(i);
    }
    return range;
}
exports.getSelectedRange = getSelectedRange;
function getNCIndice(vr, seletedRange) {
    if (vr.start === -1 || vr.end === -1)
        return [];
    var nCIndices = [];
    for (var i = vr.start; i <= vr.end; i++) {
        if (seletedRange.indexOf(i) !== -1) {
            nCIndices.push(i);
        }
    }
    return nCIndices;
}
exports.getNCIndice = getNCIndice;
function editNCIndice(nCI, timBr) {
    if (nCI.length === 0)
        return null;
    var charArr = timBr.split('');
    for (var _i = 0, nCI_1 = nCI; _i < nCI_1.length; _i++) {
        var i = nCI_1[_i];
        charArr[i] = '2';
    }
    return charArr.join('');
}
exports.editNCIndice = editNCIndice;
//# sourceMappingURL=date.js.map