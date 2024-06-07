import { AffectableIndices, MergedTimeBar, SelectedDate, SurroundingDates, ViolatedRange} from "../dataFormat/DataFormat";

export function getSurroundingDates(targetDate: string, dates: string[] , getSize: number): SurroundingDates{
    if(dates.indexOf(targetDate) === -1) dates.push(targetDate);
    
    dates.sort((a, b) => a.localeCompare(b));
    const targetIndex = dates.indexOf(targetDate);

    const startIndex = Math.max(0, targetIndex - getSize);
    const endIndex = Math.min(dates.length - 1, targetIndex + getSize);

    return {
        prevDates: dates.slice(startIndex, targetIndex),
        nextDates: dates.slice(targetIndex + 1, endIndex + 1)
    }
}

export function getSurroundTimebar(dateRange: string[], wd: string[], wVal: string[]): string{
    let mergedTimebar: string = "";

    for(let d of dateRange){
        const index = wd.indexOf(d);
        
        if(index !== -1){
            mergedTimebar += wVal[index];
        }
    }

    return mergedTimebar;
}

export function mergeTimeBars(sd: SelectedDate, leftTB: string, rightTB: string): MergedTimeBar{
    return {
        startSelIdx: sd.startIndex + leftTB.length,
        endSelIdx: sd.endIndex + leftTB.length,
        value: leftTB + sd.timeBar + rightTB,
    }
}

export function getAffectableIndices(mTB: MergedTimeBar, cutSize: number): AffectableIndices{
   return {
        affectedStartIdx: Math.max(0, mTB.startSelIdx - cutSize),
        affectedEndIdx: Math.min(mTB.value.length - 1, mTB.endSelIdx + cutSize)
   }
}

export function getSelectedRange(start: number, end: number): number[]{
    const range = [];
    for (let i = start; i <= end; i++) {
        range.push(i);
    }
    return range;
}

export function getNCIndice(vr: ViolatedRange, seletedRange: number[]): number[]{
    if(vr.start === -1 || vr.end === -1) return [];

    const nCIndices = [];
    for(let i = vr.start; i <= vr.end; i++){
        if(seletedRange.indexOf(i) !== -1){
            nCIndices.push(i);
        }
    }
    return nCIndices;
}

export function editNCIndice(nCI: number[], timBr: string): string | null{
    if(nCI.length === 0) return null;

    let charArr = timBr.split('');
    for(let i of nCI){
        charArr[i] = '2';
    }

    return charArr.join('');
}
