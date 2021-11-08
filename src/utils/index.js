import Course from "../api/course/model";
import Order from "../api/order/model";
import Record from "../api/record/model";
import mongoose, { Schema } from "mongoose";
const moment = require("moment");
const objectId = mongoose.Types.ObjectId;

const models = {
  Course: Course,
  Order: Order,
};
export const checkInUse = async (
  collections = [],
  value = null,
  extraConditions = null
) => {
  //   console.log("util", collections);

  for (let index = 0; index < collections.length; index++) {
    const element = collections[index];
    const filter = {};
    element.fields.forEach((field) => {
      filter[field.name] = field.value;
    });
    const existed = await models[element.name].findOne(filter);
    console.log(filter);
    if (existed) {
      return true;
    }
  }
  //   const result = await collections.forEach(async (item) => {
  //     const filter = {};
  //   item.fields.forEach((field) => {
  //       filter[field.name] = field.value;
  //     });
  //     // filter[item.field] = value;
  //     const existed = await models[item.name].findOne(filter);
  //     console.log(existed);
  //     if (existed) {
  //       return true;
  //     }
  //   });
  //   console.log(result, "util");
  return false;
};

export const generateRecord = async (body = null) => {
  const {
    timeTable,
    courseDetail,
    teacherId,
    studentId,
    parentId,
    courseId,
    _id,
    id,
    completedRecord,
  } = body;
  const orderID = new objectId();
  const startDate = moment(body.startDate).format("DD/MM/YYYY");
  let week = 0;
  const records = [];
  let learnTrial = body.learnTrial;

  do {
    for (let index = 0; index < timeTable.length; index++) {
      const element = timeTable[index];

      const recordDate = moment(
        `${startDate} ${element.slot.startTime}`,
        "DD/MM/YYYY HH:mm"
      ).day(element.day + week * 7);

      if (
        records.length < courseDetail.lessons &&
        recordDate >=
          moment(`${startDate} ${element.slot.startTime}`, "DD/MM/YYYY HH:mm")
      ) {
        if (!learnTrial) {
          records.push({
            status:
              completedRecord && completedRecord >= records.length ? -1 : null,

            recordDate: recordDate.unix(),
            timeTable: element,
            teacherId,
            studentId,
            parentId,
            courseId,
            orderId: _id || id,
          });
        } else {
          learnTrial = false;
        }
      }
    }
    week++;
  } while (records.length < courseDetail.lessons);
  return records;
};
export const generateRecordWithNumber = async (
  body,
  quantity = null,
  unixStartDate = null
) => {
  if (!unixStartDate || quantity) {
    return null;
  }
  const {
    timeTable,
    courseDetail,
    teacherId,
    studentId,
    parentId,
    courseId,
    _id,
    id,
  } = body;
  const orderID = new objectId();
  const startDate = moment.unix(unixStartDate).format("DD/MM/YYYY");
  let week = 0;
  const records = [];

  do {
    for (let index = 0; index < timeTable.length; index++) {
      const element = timeTable[index];

      const recordDate = moment(
        `${startDate} ${element.slot.startTime}`,
        "DD/MM/YYYY HH:mm"
      ).day(element.day + week * 7);

      if (
        records.length < quantity &&
        recordDate >=
          moment(`${startDate} ${element.slot.startTime}`, "DD/MM/YYYY HH:mm")
      ) {
        records.push({
          status: null,
          recordDate: recordDate.unix(),
          timeTable: element,
          teacherId,
          studentId,
          parentId,
          courseId,
          orderId: _id || id,
        });
      }
    }
    week++;
  } while (records.length < quantity);
  return records;
};
export const generateTrial = async (body = null) => {
  const {
    timeTable,
    courseDetail,
    teacherId,
    studentId,
    courseId,
    _id,
    parentId,
  } = body;
  const orderID = new objectId();
  const startDate = moment(body.startDate).format("DD/MM/YYYY");
  let week = 0;
  const records = [];
  do {
    for (let index = 0; index < timeTable.length; index++) {
      const element = timeTable[index];

      const recordDate = moment(
        `${startDate} ${element.slot.startTime}`,
        "DD/MM/YYYY HH:mm"
      ).day(element.day + week * 7);
      console.log("date", recordDate, startDate);

      if (
        records.length < 1 &&
        recordDate >=
          moment(`${startDate} ${element.slot.startTime}`, "DD/MM/YYYY HH:mm")
      ) {
        records.push({
          status: null,
          recordDate: recordDate.unix(),
          timeTable: element,
          teacherId,
          studentId,
          parentId,
          courseId,
          kind: "TRIAL",
          orderId: _id,
        });
      }
    }
    week++;
  } while (records.length < 1);
  return records;
};

export const getTableSlots = (startHour, endHour) => {
  const segments = [];
  if (!startHour || !endHour) {
    return segments;
  }
  let tempTime = "";
  tempTime = startHour;
  do {
    const time = {
      startTime: moment(tempTime, "HH:mm").format("HH:mm"),
      endTime: moment(tempTime, "HH:mm").add(30, "minute").format("HH:mm"),
    };
    segments.push(time);
    tempTime = time.endTime;
  } while (moment(tempTime, "HH:mm").isBefore(moment(endHour, "HH:mm")));
  return segments;
};
