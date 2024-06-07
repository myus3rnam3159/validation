import { SelectedDate, WorkRecord } from "./dataFormat/DataFormat";
import { getI02Validation, getI07Validation, getI06Validation, getI01Validation } from "./ruleValidation/IMO/IMO";

interface RuleDetail{
    ruleNumber: string;
    timeBar: string;
}

interface Rule{
    I: string[];
    K: string[];
    L: string[];
}

const sD: SelectedDate = {
    selectedDate : "20240103",
    timeBar: "0101010101010101010101010101010101010101010101010101",
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

console.log("I07\n", getI07Validation(sD, wrks));
console.log("I02\n", getI02Validation(sD, wrks));
console.log("I06\n", getI06Validation(sD, wrks));
console.log("I01\n", getI01Validation(sD, wrks));

const iMORuleDetail: RuleDetail[] = [
    {
        ruleNumber: "07",
        timeBar: getI07Validation(sD, wrks)
    },
    {
        ruleNumber: "02",
        timeBar: getI02Validation(sD, wrks)
    }
]

const overallRule : Rule = {
    I: iMORuleDetail.map(e => e.ruleNumber),
    K: null,
    L: null,
}