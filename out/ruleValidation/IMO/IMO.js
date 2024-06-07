"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getI07Validation = void 0;
var date_1 = require("../../helpers/date");
function getI07Validation(selectedDate, workRecords) {
    var checkDates = (0, date_1.getSurroundingDates)(selectedDate.selectedDate, workRecords.map(function (wr) { return wr.workDate; }), 1);
    var leftMergedTimebar = (0, date_1.getSurroundTimebar)(checkDates.prevDates, workRecords.map(function (wr) { return wr.workDate; }), workRecords.map(function (wr) { return wr.workRecordValue; }));
    var rightMergedTimebar = (0, date_1.getSurroundTimebar)(checkDates.nextDates, workRecords.map(function (wr) { return wr.workDate; }), workRecords.map(function (wr) { return wr.workRecordValue; }));
    var mergeTB = (0, date_1.mergeTimeBars)(selectedDate, leftMergedTimebar, rightMergedTimebar);
    var affectedIndices = (0, date_1.getAffectableIndices)(mergeTB, 48);
    var selectedRange = (0, date_1.getSelectedRange)(mergeTB.startSelIdx, mergeTB.endSelIdx);
    var violatedRange = { start: -1, end: -1 };
    for (var i = affectedIndices.affectedStartIdx; i <= affectedIndices.affectedEndIdx; i++) {
        if (mergeTB.value[i] === '1') {
            var subEndI = i + 48 - 1;
            var subS = mergeTB.value.slice(i, subEndI + 1);
            if (subS.match(/1{29,}/g) !== null) {
                violatedRange.start = i;
                violatedRange.end = subEndI;
                break;
            }
            i = subEndI - 1;
        }
    }
    var nCIndices = (0, date_1.getNCIndice)(violatedRange, selectedRange);
    return (0, date_1.editNCIndice)(nCIndices, mergeTB.value);
}
exports.getI07Validation = getI07Validation;
//# sourceMappingURL=IMO.js.map