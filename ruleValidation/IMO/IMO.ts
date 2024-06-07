import { AffectableIndices, MergedTimeBar, SelectedDate, ViolatedRange, SurroundingDates, WorkRecord } from "../../dataFormat/DataFormat";
import { editNCIndice, getAffectableIndices, getNCIndice, getSelectedRange, getSurroundingDates, getSurroundTimebar, mergeTimeBars } from "../../helpers/date";

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