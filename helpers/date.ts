import { AffectableIndices, MergedTimeBar, SelectedDate, SurroundingDates, ViolatedRange } from "../dataFormat/DataFormat";

const dayjs = require('dayjs');

/**
 * at least one continuous rest blocks greater or equals than ...
 * @param blockNumber number of work rest hour block, for example, 6h = 12 blocks
 * @param workRecord work record value in timebar
 * @returns {boolean}
 */
export const atLeastOneContinuousRestBlocksGoeThan = (
    blockNumber: number,
    workRecord: string
) => {
    const restSections = workRecord.replaceAll(/1+/g, '1').split('1').filter(it => it !== '');

    for (let section of restSections) {
        if (section.length >= blockNumber) {
            return true
        }
    }
    return false
}

export const findWeek = (date: String) => {
    const currentDate = dayjs(date, 'YYYYMMDD')
    // Get the start of the week (Sunday)
    const startOfWeek = currentDate.startOf('week').format('YYYYMMDD');
    // Get the end of the week (Saturday)
    const endOfWeek = currentDate.endOf('week').format('YYYYMMDD');

    return {
        startOfWeek, endOfWeek
    }
}

export const isWorkHoursGreaterThan = (hour: number, workRecord: string): boolean => {
    const totalRestBlocks = workRecord.replace(/0/g, '')
    return totalRestBlocks.length < hour * 2
}

export const getDatesBetween = (start: string, end: string): string[] => {
    const startDay = dayjs(start, 'YYYYMMDD');
    const endDay = dayjs(end, 'YYYYMMDD');

    let dates: string[] = [];
    let currentDay = startDay;

    while (currentDay.isBefore(endDay) || currentDay.isSame(endDay)) {
        dates.push(currentDay.format('YYYYMMDD'));
        currentDay = currentDay.add(1, 'day');
    }

    return dates;
}

export function dateToYmd(date: Date): string {
    return dayjs(date).format('YYYYMMDD')
}

export function getDatesInRange(
    inputDate: string,
    dateRange: number
): string[] {
    // Parse the input date string
    const year = parseInt(inputDate.substring(0, 4), 10);
    const month = parseInt(inputDate.substring(4, 6), 10) - 1; // Months are 0-based in JavaScript Date
    const day = parseInt(inputDate.substring(6, 8), 10);

    const date = new Date(year, month, day);

    const dates: string[] = [dateToYmd(date)]

    for (let i = 1; i <= dateRange; ++i) {
        let d1 = new Date(date)
        d1.setDate(date.getDate() - i)
        dates.push(dateToYmd(d1))

        let d2 = new Date(date)
        d2.setDate(date.getDate() + i)
        dates.push(dateToYmd(d2))
    }

    return dates.sort()
}

export function getPreviousAndNextDay(
    inputDate: string
): { previousDay: string, nextDay: string } {
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
    const formatDate = (date: Date): string => {
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

export const isRestHoursSmallerThan = (
    hour: number,
    workRecord: String
): boolean => {
    const totalRestBlocks = workRecord.replace(/1/g, '')
    return totalRestBlocks.length < hour * 2
}

export function replaceWith2(
    workRecord: string,
    start: number,
    end: number
): string {

    if (start < 0 || end > workRecord.length || start >= end) {
        throw new Error("Invalid range");
    }

    const beforeRange = workRecord.slice(0, start);
    const afterRange = workRecord.slice(end);

    return beforeRange + "2".repeat(end - start) + afterRange;
}

export function getSurroundingDates(targetDate: string, dates: string[], getSize: number): SurroundingDates {
    if (dates.indexOf(targetDate) === -1) dates.push(targetDate);

    dates.sort((a, b) => a.localeCompare(b));
    const targetIndex = dates.indexOf(targetDate);

    const startIndex = Math.max(0, targetIndex - getSize);
    const endIndex = Math.min(dates.length - 1, targetIndex + getSize);

    return {
        prevDates: dates.slice(startIndex, targetIndex),
        nextDates: dates.slice(targetIndex + 1, endIndex + 1)
    }
}

export function getSurroundTimebar(dateRange: string[], wd: string[], wVal: string[]): string {
    let mergedTimebar: string = "";

    for (let d of dateRange) {
        const index = wd.indexOf(d);

        if (index !== -1) {
            mergedTimebar += wVal[index];
        }
    }

    return mergedTimebar;
}

export function mergeTimeBars(sd: SelectedDate, leftTB: string, rightTB: string): MergedTimeBar {
    return {
        startSelIdx: sd.startIndex + leftTB.length,
        endSelIdx: sd.endIndex + leftTB.length,
        value: leftTB + sd.timeBar + rightTB,
        recutStart: leftTB.length,
        recutEnd: leftTB.length + sd.timeBar.length - 1
    }
}

export function getAffectableIndices(mTB: MergedTimeBar, cutSize: number): AffectableIndices {
    return {
        affectedStartIdx: Math.max(0, mTB.startSelIdx - cutSize),
        affectedEndIdx: Math.min(mTB.value.length - 1, mTB.endSelIdx + cutSize)
    }
}

export function getSelectedRange(start: number, end: number): number[] {
    const range = [];
    for (let i = start; i <= end; i++) {
        range.push(i);
    }
    return range;
}

export function getNCIndice(vr: ViolatedRange, seletedRange: number[]): number[] {
    if (vr.start === -1 || vr.end === -1) return [];

    const nCIndices = [];
    for (let i = vr.start; i <= vr.end; i++) {
        if (seletedRange.indexOf(i) !== -1) {
            nCIndices.push(i);
        }
    }
    return nCIndices;
}

export function editNCIndice(nCI: number[], timBr: string): string | null {
    if (nCI.length === 0) return null;

    let charArr = timBr.split('');
    for (let i of nCI) {
        charArr[i] = '2';
    }

    return charArr.join('');
}
