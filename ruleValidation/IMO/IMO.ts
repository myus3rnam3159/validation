import { AffectableIndices, MergedTimeBar, SelectedDate, ViolatedRange, SurroundingDates, WorkRecord } from "../../dataFormat/DataFormat";
import { editNCIndice, getAffectableIndices, getDatesInRange, getNCIndice, getPreviousAndNextDay, getSelectedRange, getSurroundingDates, getSurroundTimebar, isRestHoursSmallerThan, mergeTimeBars, replaceWith2 } from "../../helpers/date";

export function getI07Validation(selectedDate: SelectedDate, workRecords: WorkRecord[]): string | null {
    const checkDates: SurroundingDates = getSurroundingDates(selectedDate.selectedDate, workRecords.map(wr => wr.workDate),1);

    const leftMergedTimebar: string = getSurroundTimebar(
        checkDates.prevDates, 
        workRecords.map(wr => wr.workDate), 
        workRecords.map(wr => wr.workRecordValue)
        );

    const rightMergedTimebar: string = getSurroundTimebar(
        checkDates.nextDates, 
        workRecords.map(wr => wr.workDate), 
        workRecords.map(wr => wr.workRecordValue)
        );

    
    const mergeTB: MergedTimeBar = mergeTimeBars(selectedDate, leftMergedTimebar, rightMergedTimebar);
    const affectedIndices: AffectableIndices = getAffectableIndices(mergeTB, 48);

    const selectedRange: number[] = getSelectedRange(mergeTB.startSelIdx, mergeTB.endSelIdx);
    let violatedRange: ViolatedRange = {start: -1, end: -1};

    for(let i = affectedIndices.affectedStartIdx; i <= affectedIndices.affectedEndIdx; i++){
        if(mergeTB.value[i] === '1'){

            const subEndI: number = i + 48 - 1;
            const subS: string = mergeTB.value.slice(i, subEndI + 1);

            if(subS.match(/1{29,}/g) !== null){

                violatedRange.start = i;
                violatedRange.end = subEndI;
                break;
            }
            i = subEndI - 1;
        }
    }
    const nCIndices: number[] = getNCIndice(violatedRange, selectedRange);
    return editNCIndice(nCIndices, mergeTB.value);
}

export function getI02Validation(selectedDate: SelectedDate, workRecords: WorkRecord[]): string | null {

    const checkDates: SurroundingDates = getSurroundingDates(selectedDate.selectedDate, workRecords.map(wr => wr.workDate),1);

    const leftMergedTimebar: string = getSurroundTimebar(
        checkDates.prevDates, 
        workRecords.map(wr => wr.workDate), 
        workRecords.map(wr => wr.workRecordValue)
        );

    const rightMergedTimebar: string = getSurroundTimebar(
        checkDates.nextDates, 
        workRecords.map(wr => wr.workDate), 
        workRecords.map(wr => wr.workRecordValue)
        );

    const mergeTB: MergedTimeBar = mergeTimeBars(selectedDate, leftMergedTimebar, rightMergedTimebar);
    const affectedIndices: AffectableIndices = getAffectableIndices(mergeTB, 48);

    const selectedRange: number[] = getSelectedRange(mergeTB.startSelIdx, mergeTB.endSelIdx);
    let violatedRange: ViolatedRange = {start: -1, end: -1};

    for(let i = affectedIndices.affectedStartIdx; i <= affectedIndices.affectedEndIdx; i++){
        if(mergeTB.value[i] === '1'){

            const subEndI: number = i + 48 - 1;
            const subS: string = mergeTB.value.slice(i, subEndI + 1);

            if(subS.match(/(?:[^1]*1){29}/g) !== null){
                violatedRange.start = i;
                violatedRange.end = subEndI;
                break;
            }
            i = subEndI - 1;
        }
    }
    const nCIndices: number[] = getNCIndice(violatedRange, selectedRange);
    return editNCIndice(nCIndices, mergeTB.value);
}

export function getI06Validation(selectedDate: SelectedDate, workRecords: WorkRecord[]): string | null {

    const checkDates: SurroundingDates = getSurroundingDates(selectedDate.selectedDate, workRecords.map(wr => wr.workDate),1);

    const leftMergedTimebar: string = getSurroundTimebar(
        checkDates.prevDates, 
        workRecords.map(wr => wr.workDate), 
        workRecords.map(wr => wr.workRecordValue)
        );

    const rightMergedTimebar: string = getSurroundTimebar(
        checkDates.nextDates, 
        workRecords.map(wr => wr.workDate), 
        workRecords.map(wr => wr.workRecordValue)
        );

    const mergeTB: MergedTimeBar = mergeTimeBars(selectedDate, leftMergedTimebar, rightMergedTimebar);
    const affectedIndices: AffectableIndices = getAffectableIndices(mergeTB, 48);

    const selectedRange: number[] = getSelectedRange(mergeTB.startSelIdx, mergeTB.endSelIdx);
    let violatedRange: ViolatedRange = {start: -1, end: -1};

    for(let i = affectedIndices.affectedStartIdx; i <= affectedIndices.affectedEndIdx; i++){
        if(mergeTB.value[i] === '1'){

            const subEndI: number = i + 48 - 1;
            const subS: string = mergeTB.value.slice(i, subEndI + 1);

            if(subS.match(/^(?:[^0]*0{1,}[^0]*0{12,}[^0]*|[^0]*0{12,}[^0]*0{1,}[^0]*)$/g) === null){
                violatedRange.start = i;
                violatedRange.end = subEndI;
                break;
            }
            i = subEndI - 1;
        }
    }
    const nCIndices: number[] = getNCIndice(violatedRange, selectedRange);
    return editNCIndice(nCIndices, mergeTB.value);
}

/** 
 *  in any 7 days period, min rest hours >= 77h.
 */
export function getI05Validation (
    input: {
        selectedDate: string,
        timeBar: string,
        startIndex: number,             // start position of work
        endIndex: number                // end position of workDate
    },
    workRecords: WorkRecord[]           // max length = 15
): string | null {

    const block24h = 48
    const block1w = 336                 // 336 = 48 * 7
    const restHoursInWeek = 77
    const totalInputBlocks = input.endIndex - input.startIndex

    var combinedRecord = ''

    if (totalInputBlocks <= 0) {
        throw Error("start block must smaller than end block")
    }

    let dates = getDatesInRange(input.selectedDate, 7)


    for (let date of dates) {

        let dateIndex = workRecords.findIndex((it) => it.workDate === date)
        if (date === input.selectedDate) {
            combinedRecord += input.timeBar
            continue
        }
        if (dateIndex < 0) {
            combinedRecord += "0".repeat(block24h)
            continue
        }
        combinedRecord += workRecords[dateIndex].workRecordValue

    }

    // console.log(combinedRecord)

    var start = input.startIndex
    var end = combinedRecord.length - block24h - totalInputBlocks

    if (start < 0) {
        start = 0
    }
    if (end >= combinedRecord.length) {
        end = combinedRecord.length
    }

    // console.log(start, end)
    // console.log(combinedRecord)

    for (let i = start; i < end; ++i) {
        // console.log(i, i + block1w)
        let cutWorkRecord = combinedRecord.slice(i, i + block1w)
        let isRestSmallerThan77h = isRestHoursSmallerThan(restHoursInWeek, cutWorkRecord)
        if (isRestSmallerThan77h) {
            return replaceWith2(input.timeBar, input.startIndex, input.endIndex)
        }
    }

    return null
}

/** 
 *  in any 24h. rest hours >= 10h
 */
export function getI04Validation(
    input: {
        selectedDate: string,
        timeBar: string,
        startIndex: number,             // start position of work
        endIndex: number                // end position of workDate
    },
    workRecords: WorkRecord[]           // max 15 records
): string | null {

    const block24h = 48
    const restHoursInDay = 10
    const totalInputBlocks = input.endIndex - input.startIndex
    
    var combinedRecord = ''

    if(totalInputBlocks <= 0){
        throw Error("start block must smaller than end block")
    }

    const prevAndNextDates = getPreviousAndNextDay(input.selectedDate)

    const dates = [prevAndNextDates.previousDay, input.selectedDate, prevAndNextDates.nextDay]

    for (let date of dates) {

        let dateIndex = workRecords.findIndex((it) => it.workDate === date)
        if (date === input.selectedDate) {
            combinedRecord += input.timeBar
            continue
        }
        if (dateIndex < 0) {
            combinedRecord += "0".repeat(block24h)
            continue
        }
        combinedRecord += workRecords[dateIndex].workRecordValue

    }

    var start = input.startIndex
    var end = combinedRecord.length - block24h - totalInputBlocks 
    if (start < 0) {
        start = 0
    }
    if (end >= combinedRecord.length) {
        end = combinedRecord.length
    }

    // console.log(start, end)
    // console.log(combinedRecord)

    for (let i = start; i < end; ++i) {
        let cutWorkRecord = combinedRecord.slice(i, i + block24h)
        let isRestSmallerThan10 = isRestHoursSmallerThan(restHoursInDay, cutWorkRecord)
        if (isRestSmallerThan10) {
            return replaceWith2(input.timeBar, input.startIndex, input.endIndex)
        }
    }

    return null
}

export function getI01Validation(selectedDate: SelectedDate, workRecords: WorkRecord[]): string | null {

    const checkDates: SurroundingDates = getSurroundingDates(selectedDate.selectedDate, workRecords.map(wr => wr.workDate),1);

    const leftMergedTimebar: string = getSurroundTimebar(
        checkDates.prevDates, 
        workRecords.map(wr => wr.workDate), 
        workRecords.map(wr => wr.workRecordValue)
        );

    const rightMergedTimebar: string = getSurroundTimebar(
        checkDates.nextDates, 
        workRecords.map(wr => wr.workDate), 
        workRecords.map(wr => wr.workRecordValue)
        );

    const mergeTB: MergedTimeBar = mergeTimeBars(selectedDate, leftMergedTimebar, rightMergedTimebar);
    const affectedIndices: AffectableIndices = getAffectableIndices(mergeTB, 48);

    const selectedRange: number[] = getSelectedRange(mergeTB.startSelIdx, mergeTB.endSelIdx);
    let violatedRange: ViolatedRange = {start: -1, end: -1};

    for(let i = affectedIndices.affectedStartIdx; i <= affectedIndices.affectedEndIdx; i++){
        if(mergeTB.value[i] === '1'){

            const subEndI: number = i + 48 - 1;
            const subS: string = mergeTB.value.slice(i, subEndI + 1);

            if(subS.match(/0{12,}/g) === null){
                violatedRange.start = i;
                violatedRange.end = subEndI;
                break;
            }
            i = subEndI - 1;
        }
    }
    const nCIndices: number[] = getNCIndice(violatedRange, selectedRange);
    return editNCIndice(nCIndices, mergeTB.value);
}
