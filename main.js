"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IMO_1 = require("./ruleValidation/IMO/IMO");
const sD = {
    selectedDate: "20240103",
    timeBar: "0101010101010101010101010101010101010101010101010101",
    startIndex: 0,
    endIndex: 47
};
const wrks = [
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
console.log("I01\n", (0, IMO_1.getI01Validation)(sD, wrks));
console.log("I02\n", (0, IMO_1.getI02Validation)(sD, wrks));
console.log("I04\n", (0, IMO_1.getI04Validation)(sD, wrks));
console.log("I05\n", (0, IMO_1.getI05Validation)(sD, wrks));
console.log("I06\n", (0, IMO_1.getI06Validation)(sD, wrks));
console.log("I07\n", (0, IMO_1.getI07Validation)(sD, wrks));
const iMORuleDetail = [
    {
        ruleNumber: "07",
        timeBar: (0, IMO_1.getI07Validation)(sD, wrks)
    },
    {
        ruleNumber: "02",
        timeBar: (0, IMO_1.getI02Validation)(sD, wrks)
    },
    {
        ruleNumber: "01",
        timeBar: (0, IMO_1.getI02Validation)(sD, wrks)
    },
    {
        ruleNumber: "03",
        timeBar: (0, IMO_1.getI02Validation)(sD, wrks)
    },
    {
        ruleNumber: "04",
        timeBar: (0, IMO_1.getI02Validation)(sD, wrks)
    },
    {
        ruleNumber: "05",
        timeBar: (0, IMO_1.getI02Validation)(sD, wrks)
    },
    {
        ruleNumber: "06",
        timeBar: (0, IMO_1.getI02Validation)(sD, wrks)
    }
];
const overallRule = {
    I: iMORuleDetail.filter(e => e.timeBar != null).map(e => e.ruleNumber),
    K: null,
    L: null,
};
console.log(overallRule.I);
console.log(overallRule);
