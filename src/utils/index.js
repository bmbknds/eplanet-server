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
  const { timeTable, courseDetail, teacherId, studentId, courseId, _id } = body;
  const orderID = new objectId();
  const startDate = moment(body.startDate).format("DD/MM/YYYY");
  let week = 0;
  const records = [];
  do {
    for (let index = 0; index < timeTable.length; index++) {
      const element = timeTable[index];
      console.log(`${startDate} ${element.slot.startTime}`);
      const recordDate = moment(
        `${startDate} ${element.slot.startTime}`,
        "DD/MM/YYYY HH:mm"
      )
        .day(element.day + week * 7)
        .unix();

      if (records.length < courseDetail.lessons) {
        records.push({
          status: null,
          recordDate,
          timeTable: element,
          teacherId,
          studentId,
          courseId,
          orderId: _id,
        });
      }
    }
    week++;
  } while (records.length < courseDetail.lessons);
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
