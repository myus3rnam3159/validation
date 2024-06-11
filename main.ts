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
  selectedDate: "20240107",
  timeBar: '0'.repeat(40) + '11110000', // '00011101' + '1'.repeat(32) + '0'.repeat(8),
  startIndex: 40,
  endIndex: 44,
};

const wrks: WorkRecord[] = [
  {
    workDate: "20240101",
    workRecordValue: '0'.repeat(48)
  },
  {
    workDate: "20240102",
    workRecordValue: '1'.repeat(48)
  },
  {
    workDate: "20240104",
    workRecordValue: '1'.repeat(48)
  },
  {
    workDate: "20240105",
    workRecordValue: '1'.repeat(48)
  },
  {
    workDate: "20240106",
    workRecordValue: '1'.repeat(48)
  },
  {
    workDate: "20240107",
    workRecordValue: '0'.repeat(48)
  },
  {
    workDate: "20240108",
    workRecordValue: '0'.repeat(48)
  },
  {
    workDate: "20240109",
    workRecordValue: '0'.repeat(48)
  },
  {
    workDate: "20240110",
    workRecordValue: '0'.repeat(48)
  },
  {
    workDate: "20240111",
    workRecordValue: '0'.repeat(48)
  },
  {
    workDate: "20240112",
    workRecordValue: '0'.repeat(48)
  },
  {
    workDate: "20240113",
    workRecordValue: '0'.repeat(48)
  },
  {
    workDate: "20240114",
    workRecordValue: '0'.repeat(48)
  },
  {
    workDate: "20240115",
    workRecordValue: '0'.repeat(48)
  },
];

// console.log("I01\n", getI01Validation(sD, wrks));
// console.log("I02\n", getI02Validation(sD, wrks));
// console.log("I03\n", getI03Validation(sD, wrks));
// console.log("I04\n", getI04Validation(sD, wrks));
console.log("I05\n", getI05Validation(sD, wrks));
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
