"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getI01Validation = exports.getI04Validation = exports.getI05Validation = exports.getI06Validation = exports.getI02Validation = exports.getI07Validation = void 0;
const date_1 = require("../../helpers/date");
function getI07Validation(selectedDate, workRecords) {
    const checkDates = (0, date_1.getSurroundingDates)(selectedDate.selectedDate, workRecords.map(wr => wr.workDate), 1);
    const leftMergedTimebar = (0, date_1.getSurroundTimebar)(checkDates.prevDates, workRecords.map(wr => wr.workDate), workRecords.map(wr => wr.workRecordValue));
    const rightMergedTimebar = (0, date_1.getSurroundTimebar)(checkDates.nextDates, workRecords.map(wr => wr.workDate), workRecords.map(wr => wr.workRecordValue));
    const mergeTB = (0, date_1.mergeTimeBars)(selectedDate, leftMergedTimebar, rightMergedTimebar);
    const affectedIndices = (0, date_1.getAffectableIndices)(mergeTB, 48);
    const selectedRange = (0, date_1.getSelectedRange)(mergeTB.startSelIdx, mergeTB.endSelIdx);
    let violatedRange = { start: -1, end: -1 };
    for (let i = affectedIndices.affectedStartIdx; i <= affectedIndices.affectedEndIdx; i++) {
        if (mergeTB.value[i] === '1') {
            const subEndI = i + 48 - 1;
            const subS = mergeTB.value.slice(i, subEndI + 1);
            if (subS.match(/1{29,}/g) !== null) {
                violatedRange.start = i;
                violatedRange.end = subEndI;
                break;
            }
            i = subEndI - 1;
        }
    }
    const nCIndices = (0, date_1.getNCIndice)(violatedRange, selectedRange);
    return (0, date_1.editNCIndice)(nCIndices, mergeTB.value);
}
exports.getI07Validation = getI07Validation;
function getI02Validation(selectedDate, workRecords) {
    const checkDates = (0, date_1.getSurroundingDates)(selectedDate.selectedDate, workRecords.map(wr => wr.workDate), 1);
    const leftMergedTimebar = (0, date_1.getSurroundTimebar)(checkDates.prevDates, workRecords.map(wr => wr.workDate), workRecords.map(wr => wr.workRecordValue));
    const rightMergedTimebar = (0, date_1.getSurroundTimebar)(checkDates.nextDates, workRecords.map(wr => wr.workDate), workRecords.map(wr => wr.workRecordValue));
    const mergeTB = (0, date_1.mergeTimeBars)(selectedDate, leftMergedTimebar, rightMergedTimebar);
    const affectedIndices = (0, date_1.getAffectableIndices)(mergeTB, 48);
    const selectedRange = (0, date_1.getSelectedRange)(mergeTB.startSelIdx, mergeTB.endSelIdx);
    let violatedRange = { start: -1, end: -1 };
    for (let i = affectedIndices.affectedStartIdx; i <= affectedIndices.affectedEndIdx; i++) {
        if (mergeTB.value[i] === '1') {
            const subEndI = i + 48 - 1;
            const subS = mergeTB.value.slice(i, subEndI + 1);
            if (subS.match(/(?:[^1]*1){29}/g) !== null) {
                violatedRange.start = i;
                violatedRange.end = subEndI;
                break;
            }
            i = subEndI - 1;
        }
    }
    const nCIndices = (0, date_1.getNCIndice)(violatedRange, selectedRange);
    return (0, date_1.editNCIndice)(nCIndices, mergeTB.value);
}
exports.getI02Validation = getI02Validation;
function getI06Validation(selectedDate, workRecords) {
    const checkDates = (0, date_1.getSurroundingDates)(selectedDate.selectedDate, workRecords.map(wr => wr.workDate), 1);
    const leftMergedTimebar = (0, date_1.getSurroundTimebar)(checkDates.prevDates, workRecords.map(wr => wr.workDate), workRecords.map(wr => wr.workRecordValue));
    const rightMergedTimebar = (0, date_1.getSurroundTimebar)(checkDates.nextDates, workRecords.map(wr => wr.workDate), workRecords.map(wr => wr.workRecordValue));
    const mergeTB = (0, date_1.mergeTimeBars)(selectedDate, leftMergedTimebar, rightMergedTimebar);
    const affectedIndices = (0, date_1.getAffectableIndices)(mergeTB, 48);
    const selectedRange = (0, date_1.getSelectedRange)(mergeTB.startSelIdx, mergeTB.endSelIdx);
    let violatedRange = { start: -1, end: -1 };
    for (let i = affectedIndices.affectedStartIdx; i <= affectedIndices.affectedEndIdx; i++) {
        if (mergeTB.value[i] === '1') {
            const subEndI = i + 48 - 1;
            const subS = mergeTB.value.slice(i, subEndI + 1);
            if (subS.match(/^(?:[^0]*0{1,}[^0]*0{12,}[^0]*|[^0]*0{12,}[^0]*0{1,}[^0]*)$/g) === null) {
                violatedRange.start = i;
                violatedRange.end = subEndI;
                break;
            }
            i = subEndI - 1;
        }
    }
    const nCIndices = (0, date_1.getNCIndice)(violatedRange, selectedRange);
    return (0, date_1.editNCIndice)(nCIndices, mergeTB.value);
}
exports.getI06Validation = getI06Validation;
/**
 *  in any 7 days period, min rest hours >= 77h.
 */
function getI05Validation(input, workRecords // max length = 15
) {
    const block24h = 48;
    const block1w = 336; // 336 = 48 * 7
    const restHoursInWeek = 77;
    const totalInputBlocks = input.endIndex - input.startIndex;
    var combinedRecord = '';
    if (totalInputBlocks <= 0) {
        throw Error("start block must smaller than end block");
    }
    let dates = (0, date_1.getDatesInRange)(input.selectedDate, 7);
    for (let date of dates) {
        let dateIndex = workRecords.findIndex((it) => it.workDate === date);
        if (date === input.selectedDate) {
            combinedRecord += input.timeBar;
            continue;
        }
        if (dateIndex < 0) {
            combinedRecord += "0".repeat(block24h);
            continue;
        }
        combinedRecord += workRecords[dateIndex].workRecordValue;
    }
    // console.log(combinedRecord)
    var start = input.startIndex;
    var end = combinedRecord.length - block24h - totalInputBlocks;
    if (start < 0) {
        start = 0;
    }
    if (end >= combinedRecord.length) {
        end = combinedRecord.length;
    }
    // console.log(start, end)
    // console.log(combinedRecord)
    for (let i = start; i < end; ++i) {
        // console.log(i, i + block1w)
        let cutWorkRecord = combinedRecord.slice(i, i + block1w);
        let isRestSmallerThan77h = (0, date_1.isRestHoursSmallerThan)(restHoursInWeek, cutWorkRecord);
        if (isRestSmallerThan77h) {
            return (0, date_1.replaceWith2)(input.timeBar, input.startIndex, input.endIndex);
        }
    }
    return null;
}
exports.getI05Validation = getI05Validation;
/**
 *  in any 24h. rest hours >= 10h
 */
function getI04Validation(input, workRecords // max 15 records
) {
    const block24h = 48;
    const restHoursInDay = 10;
    const totalInputBlocks = input.endIndex - input.startIndex;
    var combinedRecord = '';
    if (totalInputBlocks <= 0) {
        throw Error("start block must smaller than end block");
    }
    const prevAndNextDates = (0, date_1.getPreviousAndNextDay)(input.selectedDate);
    const dates = [prevAndNextDates.previousDay, input.selectedDate, prevAndNextDates.nextDay];
    for (let date of dates) {
        let dateIndex = workRecords.findIndex((it) => it.workDate === date);
        if (date === input.selectedDate) {
            combinedRecord += input.timeBar;
            continue;
        }
        if (dateIndex < 0) {
            combinedRecord += "0".repeat(block24h);
            continue;
        }
        combinedRecord += workRecords[dateIndex].workRecordValue;
    }
    var start = input.startIndex;
    var end = combinedRecord.length - block24h - totalInputBlocks;
    if (start < 0) {
        start = 0;
    }
    if (end >= combinedRecord.length) {
        end = combinedRecord.length;
    }
    // console.log(start, end)
    // console.log(combinedRecord)
    for (let i = start; i < end; ++i) {
        let cutWorkRecord = combinedRecord.slice(i, i + block24h);
        let isRestSmallerThan10 = (0, date_1.isRestHoursSmallerThan)(restHoursInDay, cutWorkRecord);
        if (isRestSmallerThan10) {
            return (0, date_1.replaceWith2)(input.timeBar, input.startIndex, input.endIndex);
        }
    }
    return null;
}
exports.getI04Validation = getI04Validation;
function getI01Validation(selectedDate, workRecords) {
    const checkDates = (0, date_1.getSurroundingDates)(selectedDate.selectedDate, workRecords.map(wr => wr.workDate), 1);
    const leftMergedTimebar = (0, date_1.getSurroundTimebar)(checkDates.prevDates, workRecords.map(wr => wr.workDate), workRecords.map(wr => wr.workRecordValue));
    const rightMergedTimebar = (0, date_1.getSurroundTimebar)(checkDates.nextDates, workRecords.map(wr => wr.workDate), workRecords.map(wr => wr.workRecordValue));
    const mergeTB = (0, date_1.mergeTimeBars)(selectedDate, leftMergedTimebar, rightMergedTimebar);
    const affectedIndices = (0, date_1.getAffectableIndices)(mergeTB, 48);
    const selectedRange = (0, date_1.getSelectedRange)(mergeTB.startSelIdx, mergeTB.endSelIdx);
    let violatedRange = { start: -1, end: -1 };
    for (let i = affectedIndices.affectedStartIdx; i <= affectedIndices.affectedEndIdx; i++) {
        if (mergeTB.value[i] === '1') {
            const subEndI = i + 48 - 1;
            const subS = mergeTB.value.slice(i, subEndI + 1);
            if (subS.match(/0{12,}/g) === null) {
                violatedRange.start = i;
                violatedRange.end = subEndI;
                break;
            }
            i = subEndI - 1;
        }
    }
    const nCIndices = (0, date_1.getNCIndice)(violatedRange, selectedRange);
    return (0, date_1.editNCIndice)(nCIndices, mergeTB.value);
}
exports.getI01Validation = getI01Validation;
