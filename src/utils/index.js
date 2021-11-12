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
  for (let index = 0; index < collections.length; index++) {
    const element = collections[index];
    const filter = {};
    element.fields.forEach((field) => {
      filter[field.name] = field.value;
    });
    const existed = await models[element.name].findOne(filter);

    if (existed) {
      return true;
    }
  }

  return false;
};

export const generateRecord = async (body = null, isMapping = false) => {
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
        const exitedRecords = await Record.find({
          recordDate,
          teacherId,
          status: { $in: [0, null] },
        }).lean();
        if (exitedRecords.length === 0) {
          // Bỏ qua nếu đã có buổi học với ngày, giáo viên được tạo
          if (!learnTrial) {
            // Nếu trong order có buổi học thì thì + thêm 1 buổi học
            records.push({
              status:
                isMapping &&
                completedRecord &&
                completedRecord >= records.length
                  ? -1
                  : null,

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
    }
    week++;
  } while (records.length < courseDetail.lessons);
  return records;
};
export const generateRecordWithNumber = async (
  body,
  quantity = null,
  unixStartDate = null,
  recordId = null
) => {
  // console.log(quantity, unixStartDate, "param");
  if (!unixStartDate || !quantity) {
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
  const startDate = moment
    .unix(unixStartDate)
    // .add(1, "d")
    .startOf("day")
    .format("DD/MM/YYYY");
  let week = 0;
  const records = [];
  const sortTimeTable = timeTable.sort((a, b) => a.day - b.day);
  do {
    for (let index = 0; index < sortTimeTable.length; index++) {
      const element = sortTimeTable[index];

      const recordDate = moment(
        `${startDate} ${element.slot.startTime}`,
        "DD/MM/YYYY HH:mm"
      ).day(element.day + week * 7);

      if (
        records.length < quantity &&
        recordDate >=
          moment(`${startDate} ${element.slot.startTime}`, "DD/MM/YYYY HH:mm")
      ) {
        const exitedRecords = await Record.find({
          recordDate: recordDate.unix(),
          teacherId,
          status: { $in: [0, null] },
        }).lean();

        if (exitedRecords.length === 0) {
          // Bỏ qua nếu đã có buổi học với ngày, giáo viên được tạo (buổi học tạm thời)
          records.push({
            status: null,
            recordDate: recordDate.unix(),
            timeTable: element,
            teacherId,
            studentId,
            parentId,
            courseId,
            makeUpOf: recordId,
            orderId: _id || id,
          });
        }
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
