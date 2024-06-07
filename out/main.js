"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IMO_1 = require("./ruleValidation/IMO/IMO");
var sD = {
    selectedDate: "20240103",
    timeBar: "0101010101010101010101010101010101010101010101010101",
    startIndex: 14,
    endIndex: 47
};
var wrks = [
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
console.log("I07\n", (0, IMO_1.getI07Validation)(sD, wrks));
console.log("I02\n", (0, IMO_1.getI02Validation)(sD, wrks));
console.log("I06\n", (0, IMO_1.getI06Validation)(sD, wrks));
console.log("I01\n", (0, IMO_1.getI01Validation)(sD, wrks));
//# sourceMappingURL=main.js.map