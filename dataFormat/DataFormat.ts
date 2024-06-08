export interface SelectedDate {
    selectedDate: string;
    timeBar: string;
    startIndex: number;
    endIndex: number;
}
export interface MergedTimeBar {
    startSelIdx: number;
    endSelIdx: number;
    value: string;
    recutStart: number;
    recutEnd: number;
}
export interface SurroundingDates {
    prevDates: string[];
    nextDates: string[];
}

export interface WorkRecord {
    workDate: string;
    workRecordValue: string;
}

export interface AffectableIndices{
    affectedStartIdx: number;
    affectedEndIdx: number;
}

export interface ViolatedRange{
    start: number;
    end: number;
}
