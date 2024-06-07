"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editNCIndice = exports.getNCIndice = exports.getSelectedRange = exports.getAffectableIndices = exports.mergeTimeBars = exports.getSurroundTimebar = exports.getSurroundingDates = exports.replaceWith2 = exports.isRestHoursSmallerThan = exports.getPreviousAndNextDay = exports.getDatesInRange = exports.dateToYmd = void 0;
const dayjs = require('dayjs');
function dateToYmd(date) {
    return dayjs(date).format('YYYYMMDD');
}
exports.dateToYmd = dateToYmd;
function getDatesInRange(inputDate, dateRange) {
    // Parse the input date string
    const year = parseInt(inputDate.substring(0, 4), 10);
    const month = parseInt(inputDate.substring(4, 6), 10) - 1; // Months are 0-based in JavaScript Date
    const day = parseInt(inputDate.substring(6, 8), 10);
    const date = new Date(year, month, day);
    const dates = [dateToYmd(date)];
    for (let i = 1; i <= dateRange; ++i) {
        let d1 = new Date(date);
        d1.setDate(date.getDate() - i);
        dates.push(dateToYmd(d1));
        let d2 = new Date(date);
        d2.setDate(date.getDate() + i);
        dates.push(dateToYmd(d2));
    }
    return dates.sort();
}
exports.getDatesInRange = getDatesInRange;
function getPreviousAndNextDay(inputDate) {
    // Parse the input date string
    const year = parseInt(inputDate.substring(0, 4), 10);
    const month = parseInt(inputDate.substring(4, 6), 10) - 1; // Months are 0-based in JavaScript Date
    const day = parseInt(inputDate.substring(6, 8), 10);
    var date = new Date(year, month, day);
    const previousDate = new Date(date);
    previousDate.setDate(date.getDate() - 1);
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    // Format the dates back to yyyymmdd
    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        return `${y}${m}${d}`;
    };
    return {
        previousDay: formatDate(previousDate),
        nextDay: formatDate(nextDate)
    };
}
exports.getPreviousAndNextDay = getPreviousAndNextDay;
const isRestHoursSmallerThan = (hour, workRecord) => {
    const totalRestBlocks = workRecord.replace(/1/g, '');
    return totalRestBlocks.length < hour * 2;
};
exports.isRestHoursSmallerThan = isRestHoursSmallerThan;
function replaceWith2(workRecord, start, end) {
    if (start < 0 || end > workRecord.length || start >= end) {
        throw new Error("Invalid range");
    }
    const beforeRange = workRecord.slice(0, start);
    const afterRange = workRecord.slice(end);
    return beforeRange + "2".repeat(end - start) + afterRange;
}
exports.replaceWith2 = replaceWith2;
function getSurroundingDates(targetDate, dates, getSize) {
    if (dates.indexOf(targetDate) === -1)
        dates.push(targetDate);
    dates.sort((a, b) => a.localeCompare(b));
    const targetIndex = dates.indexOf(targetDate);
    const startIndex = Math.max(0, targetIndex - getSize);
    const endIndex = Math.min(dates.length - 1, targetIndex + getSize);
    return {
        prevDates: dates.slice(startIndex, targetIndex),
        nextDates: dates.slice(targetIndex + 1, endIndex + 1)
    };
}
exports.getSurroundingDates = getSurroundingDates;
function getSurroundTimebar(dateRange, wd, wVal) {
    let mergedTimebar = "";
    for (let d of dateRange) {
        const index = wd.indexOf(d);
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
    const range = [];
    for (let i = start; i <= end; i++) {
        range.push(i);
    }
    return range;
}
exports.getSelectedRange = getSelectedRange;
function getNCIndice(vr, seletedRange) {
    if (vr.start === -1 || vr.end === -1)
        return [];
    const nCIndices = [];
    for (let i = vr.start; i <= vr.end; i++) {
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
    let charArr = timBr.split('');
    for (let i of nCI) {
        charArr[i] = '2';
    }
    return charArr.join('');
}
exports.editNCIndice = editNCIndice;
