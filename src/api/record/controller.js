import { success, notFound } from "../../services/response/";
import { Record } from ".";
import { User } from "../user";
import { pickBy, identity } from "lodash";
import moment from "moment";
import { CLASS_STATUS } from "../constants/index";

export const create = ({ bodymen: { body } }, res, next) =>
  Record.create(body)
    .then((record) => record.view(true))
    .then(success(res, 201))
    .catch(next);

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Record.count(query)
    .then((count) =>
      Record.find(query, select, cursor)
        .populate({ path: "student", select: "name" })
        .then((records) => ({
          count,
          rows: records.map((record) => record.view()),
        }))
    )
    .then(success(res))
    .catch(next);

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
        if (body.status === 0) {
          record.status = CLASS_STATUS.FINISH;
        } else {
          if (body.status === 1) {
            const leaveLog = record.logs.find((d) => d.role === "teacher");
            if (leaveLog && record.recordDate - leaveLog.createdAt >= 21600) {
              record.status = CLASS_STATUS.VALID_BY_TEACHER;
            } else {
              record.status = CLASS_STATUS.INVALID_BY_TEACHER;
            }
          }
          if (body.status === 3) {
            const leaveLog = record.logs.find((d) => d.role === "student");
            if (leaveLog && record.recordDate - leaveLog.createdAt >= 1800) {
              record.status = CLASS_STATUS.VALID_BY_STUDENT;
            } else {
              record.status = CLASS_STATUS.INVALID_BY_STUDENT;
            }
          }
        }
        delete body.status;
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
  const students = await User.find(
    {
      name: { $regex: new RegExp(query.studentName, "i") },
      status: "active",
      role: "student",
    },
    { _id: 1 }
  );
  const studentsId = students.map((item) => item._id);
  delete query.studentName;
  query.studentId = { $in: studentsId };
  return Record.count(query)
    .then((count) =>
      Record.find(query, select, cursor)
        .populate({ path: "student", select: "name" })
        .then((records) => ({
          count,
          rows: records.map((record) => record.view()),
        }))
    )
    .then(success(res))
    .catch(next);
};

export const takeLeave = (
  { querymen: { query, select, cursor } },
  res,
  next
) => {
  const { reason, ...restQuery } = query;
  // console.log(query);
  Record.find({ ...restQuery, status: null })
    .then((data) => {
      console.log(data);
      if (!data || data.length === 0) {
        return res.status(400).json({ message: "No classes in time range!" });
      }
      return Record.updateMany(
        { ...restQuery, status: null },
        {
          $push: {
            logs: {
              teacherId: restQuery.teacherId,
              studentId: restQuery.studentId,
              role: restQuery.teacherId ? "teacher" : "student",
              reason,
              createdAt: moment().unix(),
            },
          },
        }
      );
    })

    .then((result) => {
      if (result.n === result.nModified) {
        return res.status(201).end();
      } else {
        return res.status(500).json({ message: "Something went wrong" }).end();
      }
    })
    .catch(next);
};
export const getTakeLeaveRecords = (
  { querymen: { query, select, cursor } },
  res,
  next
) => {
  Record.find({ ...query, status: null })
    .then(success(res))
    .catch(next);
};
