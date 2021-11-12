import { success, notFound } from "../../services/response/";
import { Record } from ".";
import { User } from "../user";
import { Student } from "../student";
import { Order } from "../order";
import { pickBy, identity } from "lodash";
import moment from "moment";
import { CLASS_STATUS } from "../constants/index";
import { generateRecordWithNumber } from "../../utils";

export const create = async ({ bodymen: { body } }, res, next) => {
  const { teacherId, studentId, courseId } = body;
  let order = null;
  if (body.kind === "TEMP") {
    order = await Order.findOne({ teacherId, studentId, courseId }).lean();
    if (!order) {
      res.status(404).json({ message: "No order match" });
    }
  }
  return Record.create({ ...body, orderId: order?._id || "TRIAL_ORDER" })
    .then((record) => record.view(true))
    .then(success(res, 201))
    .catch(next);
};

export const increase = async ({ bodymen: { body } }, res, next) => {
  const { quantity, orderId, kind } = body;
  console.log(body);
  const order = await Order.findById(orderId).lean().then(notFound(res));

  const latestRecord = await Record.find({ orderId })
    .sort({ recordDate: -1 })
    .limit(1)
    .then(notFound(res));
  console.log(latestRecord);
  console.log(order);

  // Record.create(body)
  //   .then((record) => record.view(true))
  //   .then(success(res, 201))
  //   .catch(next);
  res.status(200).end();
};

export const index = ({ querymen: { query, select, cursor } }, res, next) => {
  return Record.count(query)
    .then((count) =>
      Record.find(query, select, cursor)
        .populate({ path: "student" })
        .then((records) => ({
          count,
          rows: records.map((record) => record.view()),
        }))
    )
    .then(success(res))
    .catch(next);
};

export const show = ({ params }, res, next) =>
  Record.findById(params.id)
    .then(notFound(res))
    .then((record) => (record ? record.view() : null))
    .then(success(res))
    .catch(next);

export const submitReport = ({ bodymen: { body }, params, user }, res, next) =>
  Record.findById(params.id)
    .then(notFound(res))
    .then((record) => {
      if (!record) {
        return res
          .status(404)
          .json({ message: "Can not find the record!" })
          .end();
      } else {
        // if (body.status === 0) {
        //   record.status = CLASS_STATUS.FINISH;
        // } else {
        //   if (body.status === 1) {
        //     const leaveLog = record.logs.find((d) => d.role === "teacher");
        //     if (leaveLog && record.recordDate - leaveLog.createdAt >= 21600) {
        //       record.status = CLASS_STATUS.VALID_BY_TEACHER;
        //     } else {
        //       record.status = CLASS_STATUS.INVALID_BY_TEACHER;
        //     }
        //   }
        //   if (body.status === 3) {
        //     const leaveLog = record.logs.find((d) => d.role === "student");
        //     if (leaveLog && record.recordDate - leaveLog.createdAt >= 1800) {
        //       record.status = CLASS_STATUS.VALID_BY_STUDENT;
        //     } else {
        //       record.status = CLASS_STATUS.INVALID_BY_STUDENT;
        //     }
        //   }
        // }
        // delete body.status;
        // record.status = body.status;
        record.logs.push({
          teacherId: user._id,
          action: "report",
          createdAt: moment().endOf("minute").unix(),
        });

        return Object.assign(record, pickBy(body, identity)).save();
      }
    })
    .then((record) => (record ? record.view(true) : null))
    .then(success(res))
    .catch(next);

export const update = ({ bodymen: { body }, params }, res, next) =>
  Record.findById(params.id)
    .then(notFound(res))
    .then((record) => (record ? Object.assign(record, body).save() : null))
    .then((record) => (record ? record.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ params }, res, next) =>
  Record.findById(params.id)
    .then(notFound(res))
    .then((record) => (record ? record.remove() : null))
    .then(success(res, 204))
    .catch(next);

export const report = async (
  { querymen: { query, select, cursor } },
  res,
  next
) => {
  const students = await Student.find(
    {
      studentName: { $regex: new RegExp(query.studentName, "i") },
      // status: "active",
      // role: "student",
    },
    { _id: 1 }
  );
  const studentsId = students.map((item) => item._id);
  delete query.studentName;
  query.studentId = { $in: studentsId };
  return Record.count(query)
    .then((count) =>
      Record.find(query, select, cursor)
        .populate({ path: "student" })
        .then((records) => ({
          count,
          rows: records.map((record) => record.view()),
        }))
    )
    .then(success(res))
    .catch(next);
};

export const takeLeave = async (
  {
    bodymen: {
      body: { records, noMakeUp },
    },
    user,
  },
  res,
  next
) => {
  try {
    if (records?.length === 0) {
      return res.status(400).end();
    }

    for await (const record of records) {
      await Record.findById(record.id)
        .then(notFound(res))
        .then(async (result) => {
          result.status = record.status;
          result.logs = [
            ...result.logs,
            {
              teacherId: user.role === "teacher" ? user._id : null,
              studentId: user.role === "student" ? user._id : null,
              role: user.role,
              reason: record.reason,
              createdAt: moment().unix(),
            },
          ];
          await result.save();
          return result;
        })
        .then(async (takeLeaveRecord) => {
          if (takeLeaveRecord.status === CLASS_STATUS.INVALID_BY_STUDENT) {
            return;
          }
          if (!noMakeUp) {
            const lastRecord = await Record.findOne({
              orderId: takeLeaveRecord.orderId,
            }).sort({ recordDate: -1 });
            const order = await Order.findById(lastRecord.orderId).lean();

            const makeUpRecord = await generateRecordWithNumber(
              order,
              1,
              lastRecord.recordDate,
              takeLeaveRecord.orderId
            );

            await Record.insertMany(makeUpRecord);
          }
          // console.log(takeLeaveRecord);
        });
    }
    res.status(200).end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
};
export const getTakeLeaveRecords = (
  { querymen: { query, select, cursor } },
  res,
  next
) => {
  Record.find({ ...query, status: null })
    .populate([
      {
        path: "student",
        select: "studentName",
      },
      {
        path: "teacher",
        select: "name",
      },
    ])
    .then(success(res))
    .catch(next);
};
