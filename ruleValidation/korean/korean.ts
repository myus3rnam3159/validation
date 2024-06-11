import { WorkRecord } from "../../dataFormat/DataFormat"
import { findWeek, getDatesBetween, isWorkHoursGreaterThan, replaceWith2 } from "../../helpers/date"

function rule_k01(
    input: {
        selectedDate: string,
        workRecord: string,
        startIndex: number,             // start position of work
        endIndex: number                // end position of workDate
    },
    workRecords: WorkRecord[]           // max 15 records
): string | null {

    const limitHoursPerDay = 8
    const limitHoursPerWeek = 40
    const startAndEndOfThisWeek = findWeek(input.selectedDate)
    const dates = getDatesBetween(startAndEndOfThisWeek.startOfWeek, startAndEndOfThisWeek.endOfWeek)

    // handle: work hours <= 8 hours / day
    const isWorkGreaterThan8h = isWorkHoursGreaterThan(limitHoursPerDay, input.workRecord)
    if (isWorkGreaterThan8h) {
        return replaceWith2(input.workRecord, input.startIndex, input.endIndex)
    }

    var totalWorkHourBlocks = input.workRecord.replace(/0/g, '').length

    for (let wr of workRecords) {

        if (wr.workDate === input.workRecord) {
            continue
        }

        if (dates.includes(wr.workDate)) {
            const totalWorkBlocks = wr.workRecordValue.replace(/0/g, '').length
            totalWorkHourBlocks += totalWorkBlocks
        }
    }

    console.log(totalWorkHourBlocks)

    if (totalWorkHourBlocks > limitHoursPerWeek) {
        return replaceWith2(input.workRecord, input.startIndex, input.endIndex)
    }

    return null
}