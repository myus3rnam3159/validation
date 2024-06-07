import { SelectedDate, WorkRecord } from "./dataFormat/DataFormat";
import { getI02Validation, getI07Validation } from "./ruleValidation/IMO/IMO";


const sD: SelectedDate = {
    selectedDate : "20240103",
    timeBar: "000000000000001111111111111111111111111111110000",
    startIndex: 14,
    endIndex: 47
};

const wrks : WorkRecord[] = [
    {
        workDate: '20240101',
        workRecordValue: '000000000000001111111111001111111111110011110000'
    },
    {
        workDate: '20240102',
        workRecordValue: '000000000000001111111111001111111111110011110000'
    },
    {
        workDate: '20240103',
        workRecordValue: '000000000000001111111111001111111111110011110000'
    },
    {
        workDate: '20240104',
        workRecordValue: '000000000000001111111111001111111111110011110000'
    }
];

// console.log(getI07Validation(sD, wrks));
console.log(getI02Validation(sD, wrks));