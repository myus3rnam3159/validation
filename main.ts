import { SelectedDate, WorkRecord } from "./dataFormat/DataFormat";
import { getI02Validation, getI07Validation, getI06Validation, getI01Validation, getI04Validation, getI05Validation } from "./ruleValidation/IMO/IMO";

interface RuleDetail{
    ruleNumber: string;
    timeBar: string | null;
}

interface Rule{
    I: string[] |null;
    K: string[] |null;
    L: string[] |null;
}

const sD: SelectedDate = {
    selectedDate : "20240103",
    timeBar: "0101010101010101010101010101010101010101010101010101",
    startIndex: 11,
    endIndex: 25
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

console.log("I01\n", getI01Validation(sD, wrks));
console.log("I02\n", getI02Validation(sD, wrks));
console.log("I04\n", getI04Validation(sD, wrks));
console.log("I05\n", getI05Validation(sD, wrks));
console.log("I06\n", getI06Validation(sD, wrks));
console.log("I07\n", getI07Validation(sD, wrks));

const iMORuleDetail: RuleDetail[] = [
    {
        ruleNumber: "07",
        timeBar: getI07Validation(sD, wrks)
    },
    {
        ruleNumber: "02",
        timeBar: getI02Validation(sD, wrks)
    },
    {
        ruleNumber: "01",
        timeBar: getI01Validation(sD, wrks)
    },
    {
        ruleNumber: "03",
        timeBar: getI02Validation(sD, wrks)
    },
    {
        ruleNumber: "04",
        timeBar: getI04Validation(sD, wrks)
    },
    {
        ruleNumber: "05",
        timeBar: getI05Validation(sD, wrks)
    },
    {
        ruleNumber: "06",
        timeBar: getI06Validation(sD, wrks)
    }
]

const overallRule : Rule = {
    I: iMORuleDetail.filter(e => e.timeBar != null).map(e => e.ruleNumber),
    K: null,
    L: null,
}

console.log(overallRule.I);
console.log(overallRule);