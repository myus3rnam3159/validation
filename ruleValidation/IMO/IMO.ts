import {
  AffectableIndices,
  MergedTimeBar,
  SelectedDate,
  SurroundingDates,
  ViolatedRange,
  WorkRecord,
} from "../../dataFormat/DataFormat";
import {
  atLeastOneContinuousRestBlocksGoeThan,
  completeWorkRecordsIn3Days,
  editNCIndice,
  getAffectableIndices,
  getDatesInRange,
  getNCIndice,
  getPreviousAndNextDay,
  getSelectedRange,
  getSurroundingDates,
  getSurroundTimebar,
  isRestHoursSmallerThan,
  isTotalWorkBlocksGreaterThan,
  mergeTimeBars,
  replaceWith2,
} from "../../helpers/date";

export function getI07Validation(
  selectedDate: SelectedDate,
  workRecords: WorkRecord[]
): string | null {
  const checkDates: SurroundingDates = getSurroundingDates(
    selectedDate.selectedDate,
    workRecords.map((wr) => wr.workDate),
    1
  );

  const leftMergedTimebar: string = getSurroundTimebar(
    checkDates.prevDates,
    workRecords.map((wr) => wr.workDate),
    workRecords.map((wr) => wr.workRecordValue)
  );

  const rightMergedTimebar: string = getSurroundTimebar(
    checkDates.nextDates,
    workRecords.map((wr) => wr.workDate),
    workRecords.map((wr) => wr.workRecordValue)
  );

  const mergeTB: MergedTimeBar = mergeTimeBars(
    selectedDate,
    leftMergedTimebar,
    rightMergedTimebar
  );
  const affectedIndices: AffectableIndices = getAffectableIndices(mergeTB, 48);

  const selectedRange: number[] = getSelectedRange(
    mergeTB.startSelIdx,
    mergeTB.endSelIdx
  );
  let violatedRange: ViolatedRange = { start: -1, end: -1 };

  for (
    let i = affectedIndices.affectedStartIdx;
    i <= affectedIndices.affectedEndIdx;
    i++
  ) {
    if (mergeTB.value[i] === "1") {
      const subEndI: number = i + 48 - 1;
      const subS: string = mergeTB.value.slice(i, subEndI + 1);

      if (subS.match(/1{29,}/g) !== null) {
        violatedRange.start = i;
        violatedRange.end = subEndI;
        break;
      }
      i = subEndI - 1;
    }
  }
  const nCIndices: number[] = getNCIndice(violatedRange, selectedRange);

  const aftMergeTB: string | null = editNCIndice(nCIndices, mergeTB.value);
  return aftMergeTB != null ? aftMergeTB.slice(mergeTB.recutStart, mergeTB.recutEnd + 1) : null;
}

// export function getI02Validation(
//   selectedDate: SelectedDate,
//   workRecords: WorkRecord[]
// ): string | null {
//   const checkDates: SurroundingDates = getSurroundingDates(
//     selectedDate.selectedDate,
//     workRecords.map((wr) => wr.workDate),
//     1
//   );

//   const leftMergedTimebar: string = getSurroundTimebar(
//     checkDates.prevDates,
//     workRecords.map((wr) => wr.workDate),
//     workRecords.map((wr) => wr.workRecordValue)
//   );

//   const rightMergedTimebar: string = getSurroundTimebar(
//     checkDates.nextDates,
//     workRecords.map((wr) => wr.workDate),
//     workRecords.map((wr) => wr.workRecordValue)
//   );

//   const mergeTB: MergedTimeBar = mergeTimeBars(
//     selectedDate,
//     leftMergedTimebar,
//     rightMergedTimebar
//   );

//   // console.log(mergeTB)
//   const affectedIndices: AffectableIndices = getAffectableIndices(mergeTB, 48);

//   const selectedRange: number[] = getSelectedRange(
//     mergeTB.startSelIdx,
//     mergeTB.endSelIdx
//   );
//   let violatedRange: ViolatedRange = { start: -1, end: -1 };

//   for (
//     let i = affectedIndices.affectedStartIdx;
//     i <= affectedIndices.affectedEndIdx;
//     i++
//   ) {
//     if (mergeTB.value[i] === "1") {
//       const subEndI: number = i + 48 - 1;
//       const subS: string = mergeTB.value.slice(i, subEndI + 1);

//       if ((subS.match(/1/g) || []).length >= 29) {
//         violatedRange.start = i;
//         violatedRange.end = subEndI;
//         break;
//       }
//       i = subEndI - 1;
//     }
//   }
//   const nCIndices: number[] = getNCIndice(violatedRange, selectedRange);

//   const aftMergeTB: string | null = editNCIndice(nCIndices, mergeTB.value);
//   return aftMergeTB != null ? aftMergeTB.slice(mergeTB.recutStart, mergeTB.recutEnd + 1) : null;
// }

export function getI06Validation(
  selectedDate: SelectedDate,
  workRecords: WorkRecord[]
): string | null {
  const checkDates: SurroundingDates = getSurroundingDates(
    selectedDate.selectedDate,
    workRecords.map((wr) => wr.workDate),
    1
  );

  const leftMergedTimebar: string = getSurroundTimebar(
    checkDates.prevDates,
    workRecords.map((wr) => wr.workDate),
    workRecords.map((wr) => wr.workRecordValue)
  );

  const rightMergedTimebar: string = getSurroundTimebar(
    checkDates.nextDates,
    workRecords.map((wr) => wr.workDate),
    workRecords.map((wr) => wr.workRecordValue)
  );

  const mergeTB: MergedTimeBar = mergeTimeBars(
    selectedDate,
    leftMergedTimebar,
    rightMergedTimebar
  );
  const affectedIndices: AffectableIndices = getAffectableIndices(mergeTB, 48);

  const selectedRange: number[] = getSelectedRange(
    mergeTB.startSelIdx,
    mergeTB.endSelIdx
  );
  let violatedRange: ViolatedRange = { start: -1, end: -1 };

  for (let i = affectedIndices.affectedStartIdx; i <= affectedIndices.affectedEndIdx; i++) {
    const subEndI: number = i + 48 - 1;
    const subS: string = mergeTB.value.slice(i, subEndI + 1);

    const matcher = subS.match(/0{1,}/g);
    if (matcher !== null && matcher.length <= 2 && matcher.some((it) => it.length >= 12)) continue;

    violatedRange.start = i;
    violatedRange.end = subEndI;

    i = subEndI - 1;
  }
  const nCIndices: number[] = getNCIndice(violatedRange, selectedRange);

  const aftMergeTB: string | null = editNCIndice(nCIndices, mergeTB.value);
  return aftMergeTB != null ? aftMergeTB.slice(mergeTB.recutStart, mergeTB.recutEnd + 1) : null;
}

/**
 *  in any 7 days period, min rest hours >= 77h.
 */
export function getI05Validation(
  input: {
    selectedDate: string;
    timeBar: string;
    startIndex: number; // start position of work
    endIndex: number; // end position of workDate
  },
  workRecords: WorkRecord[] // max length = 15
): string | null {
  const block24h = 48;
  const block1w = 336; // 336 = 48 * 7
  const restHoursInWeek = 77;
  const totalInputBlocks = input.endIndex - input.startIndex + 1;

  var combinedRecord = "";

  if (totalInputBlocks <= 0) {
    throw Error("start block must smaller than end block");
  }

  let dates = getDatesInRange(input.selectedDate, 7);

  // console.log(dates)

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
  var end = combinedRecord.length - block1w - totalInputBlocks;

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
    // console.log(i, cutWorkRecord.length, cutWorkRecord)
    let isRestSmallerThan77h = isRestHoursSmallerThan(
      restHoursInWeek,
      cutWorkRecord
    );
    if (isRestSmallerThan77h) {
      // console.log(i)
      // console.log(cutWorkRecord)
      // console.log(restHoursInWeek * 2)
      return replaceWith2(input.timeBar, input.startIndex, input.endIndex);
    }
  }

  return null;
}

/**
 *  in any 24h. rest hours >= 10h
 */
export function getI04Validation(
  input: {
    selectedDate: string;
    timeBar: string;
    startIndex: number; // start position of work
    endIndex: number; // end position of workDate
  },
  workRecords: WorkRecord[] // max 15 records
): string | null {
  const block24h = 48;
  const restHoursInDay = 10;

  const combinedRecord = completeWorkRecordsIn3Days(input, workRecords)

  var startOfLoop = input.startIndex + 1;
  var endOfLoop = input.endIndex + block24h - 1;

  for (let i = startOfLoop; i <= endOfLoop; ++i) {
    let cutWorkRecord = combinedRecord.slice(i, i + block24h);
    let isRestSmallerThan10 = isRestHoursSmallerThan(restHoursInDay, cutWorkRecord);
    if (isRestSmallerThan10) {
      return replaceWith2(input.timeBar, input.startIndex, input.endIndex);
    }
  }

  return null;
}

// export function getI01Validation(
//   selectedDate: SelectedDate,
//   workRecords: WorkRecord[]
// ): string | null {
//   const checkDates: SurroundingDates = getSurroundingDates(
//     selectedDate.selectedDate,
//     workRecords.map((wr) => wr.workDate),
//     1
//   );

//   const leftMergedTimebar: string = getSurroundTimebar(
//     checkDates.prevDates,
//     workRecords.map((wr) => wr.workDate),
//     workRecords.map((wr) => wr.workRecordValue)
//   );

//   const rightMergedTimebar: string = getSurroundTimebar(
//     checkDates.nextDates,
//     workRecords.map((wr) => wr.workDate),
//     workRecords.map((wr) => wr.workRecordValue)
//   );

//   const mergeTB: MergedTimeBar = mergeTimeBars(
//     selectedDate,
//     leftMergedTimebar,
//     rightMergedTimebar
//   );
//   const affectedIndices: AffectableIndices = getAffectableIndices(mergeTB, 48);

//   const selectedRange: number[] = getSelectedRange(
//     mergeTB.startSelIdx,
//     mergeTB.endSelIdx
//   );
//   let violatedRange: ViolatedRange = { start: -1, end: -1 };

//   for (
//     let i = affectedIndices.affectedStartIdx;
//     i <= affectedIndices.affectedEndIdx;
//     i++
//   ) {
//     if (mergeTB.value[i] === "1") {
//       const subEndI: number = i + 48 - 1;
//       const subS: string = mergeTB.value.slice(i, subEndI + 1);

//       if (subS.match(/0{12,}/g) === null) {
//         violatedRange.start = i;
//         violatedRange.end = subEndI;
//         break;
//       }
//       i = subEndI - 1;
//     }
//   }
//   const nCIndices: number[] = getNCIndice(violatedRange, selectedRange);

//   const aftMergeTB: string | null = editNCIndice(nCIndices, mergeTB.value);
//   return aftMergeTB != null ? aftMergeTB.slice(mergeTB.recutStart, mergeTB.recutEnd + 1) : null;
// }

export function getI03Validation(
  selectedDate: SelectedDate,
  workRecords: WorkRecord[]
): string | null {
  const checkDates: SurroundingDates = getSurroundingDates(
    selectedDate.selectedDate,
    workRecords.map((wr) => wr.workDate),
    7
  );

  const leftMergedTimebar: string = getSurroundTimebar(
    checkDates.prevDates,
    workRecords.map((wr) => wr.workDate),
    workRecords.map((wr) => wr.workRecordValue)
  );

  const rightMergedTimebar: string = getSurroundTimebar(
    checkDates.nextDates,
    workRecords.map((wr) => wr.workDate),
    workRecords.map((wr) => wr.workRecordValue)
  );

  const mergeTB: MergedTimeBar = mergeTimeBars(
    selectedDate,
    leftMergedTimebar,
    rightMergedTimebar
  );
  const affectedIndices: AffectableIndices = getAffectableIndices(mergeTB, 336);

  const selectedRange: number[] = getSelectedRange(
    mergeTB.startSelIdx,
    mergeTB.endSelIdx
  );
  let violatedRange: ViolatedRange = { start: -1, end: -1 };

  for (
    let i = affectedIndices.affectedStartIdx;
    i <= affectedIndices.affectedEndIdx;
    i++
  ) {
    if (mergeTB.value[i] === "1") {
      const subEndI: number = Math.max(
        i + 336 - 1,
        affectedIndices.affectedEndIdx
      );
      const subS: string = mergeTB.value.slice(i, subEndI + 1);

      if ((subS.match(/1/g) || []).length > 144) {
        violatedRange.start = i;
        violatedRange.end = subEndI;
        break;
      }
      i = subEndI - 1;
    }
  }
  const nCIndices: number[] = getNCIndice(violatedRange, selectedRange);

  const aftMergeTB: string | null = editNCIndice(nCIndices, mergeTB.value);
  return aftMergeTB != null ? aftMergeTB.slice(mergeTB.recutStart, mergeTB.recutEnd + 1) : null;
}

export function getI02Validation(
  input: SelectedDate,
  workRecords: WorkRecord[]
): string | null {

  const block24h = 48;
  const maxWorkBlocksInDay = 28;

  const combinedRecord = completeWorkRecordsIn3Days(input, workRecords)

  const startOfLoop = input.startIndex + 1;
  const endOfLoop = input.endIndex + block24h - 1;

  for (let i = startOfLoop; i <= endOfLoop; ++i) {
    let cutWorkRecord = combinedRecord.slice(i, i + block24h);
    let isTotalRestHourGoeThan14 = isTotalWorkBlocksGreaterThan(
      maxWorkBlocksInDay,
      cutWorkRecord
    )
    if (isTotalRestHourGoeThan14) {
      return replaceWith2(input.timeBar, input.startIndex, input.endIndex + 1)
    }
  }

  return null
}

export function getI01Validation(
  input: SelectedDate,
  workRecords: WorkRecord[]
): string | null {

  const block24h = 48;
  const continuousRestBlocksInDay = 12;
  const prevAndNextDates = getPreviousAndNextDay(input.selectedDate);

  var combinedRecord = "";

  const dates = [
    prevAndNextDates.previousDay,
    input.selectedDate,
    prevAndNextDates.nextDay,
  ];

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

  const startOfLoop = input.startIndex + 1;
  const endOfLoop = input.endIndex + block24h - 1;

  for (let i = startOfLoop; i <= endOfLoop; ++i) {
    let cutWorkRecord = combinedRecord.slice(i, i + block24h);
    let isContinuousRestHourGoeThan6 = atLeastOneContinuousRestBlocksGoeThan(
      continuousRestBlocksInDay,
      cutWorkRecord
    )
    if (isContinuousRestHourGoeThan6) {
      return null
    }
  }

  return replaceWith2(input.timeBar, input.startIndex, input.endIndex + 1);
}