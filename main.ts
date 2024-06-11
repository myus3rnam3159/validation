import { SelectedDate, WorkRecord } from "./dataFormat/DataFormat";
import {
  getI02Validation,
  getI07Validation,
  getI06Validation,
  getI01Validation,
  getI04Validation,
  getI05Validation,
  getI03Validation,
} from "./ruleValidation/IMO/IMO";

interface RuleDetail {
  ruleNumber: string;
  timeBar: string | null;
}

interface Rule {
  I: string[] | null;
  K: string[] | null;
  L: string[] | null;
}

const sD: SelectedDate = {
  selectedDate: "20240103",
  timeBar: '1'.repeat(29) + '0'.repeat(20) , // "000000000000111111111111111100000000000000000000", // "000000000001111111111111001111111111110011110000",
  startIndex: 21,
  endIndex: 24,
};

const wrks: WorkRecord[] = [
  {
    workDate: "20240102",
    workRecordValue: '0'.repeat(48) // "000000000000001111111111001111111111110011110000",
  },
  {
    workDate: "20240104",
    workRecordValue: '0'.repeat(48) // "000000000000001111111111001111111111110011110000",
  },
  // {
  //   workDate: "20240105",
  //   workRecordValue: '1'.repeat(48) // "000000000000001111111111001111111111110011110000",
  // },
  // {
  //   workDate: "20240106",
  //   workRecordValue: '1'.repeat(48) // "000000000000001111111111001111111111110011110000",
  // },
  // {
  //   workDate: "20240107",
  //   workRecordValue: '0'.repeat(48) // "000000000000001111111111001111111111110011110000",
  // },
];

// console.log("I01\n", getI01Validation(sD, wrks));
console.log("I02:", getI02Validation(sD, wrks));
// console.log("I03\n", getI03Validation(sD, wrks));
// console.log("I04\n", getI04Validation(sD, wrks));
// console.log("I05\n", getI05Validation(sD, wrks));
// console.log("I06\n", getI06Validation(sD, wrks));
// console.log("I07\n", getI07Validation(sD, wrks));

// const iMORuleDetail: RuleDetail[] = [
//   {
//     ruleNumber: "01",
//     timeBar: getI01Validation(sD, wrks),
//   },
//   {
//     ruleNumber: "02",
//     timeBar: getI02Validation(sD, wrks),
//   },
//   {
//     ruleNumber: "03",
//     timeBar: getI03Validation(sD, wrks),
//   },
//   {
//     ruleNumber: "04",
//     timeBar: getI04Validation(sD, wrks),
//   },
//   {
//     ruleNumber: "05",
//     timeBar: getI05Validation(sD, wrks),
//   },
//   {
//     ruleNumber: "06",
//     timeBar: getI06Validation(sD, wrks),
//   },
//   {
//     ruleNumber: "07",
//     timeBar: getI07Validation(sD, wrks),
//   },
// ];

// const overallRule: Rule = {
//   I: iMORuleDetail.filter((e) => e.timeBar != null).map((e) => e.ruleNumber),
//   K: null,
//   L: null,
// };
// console.log(overallRule.I);
