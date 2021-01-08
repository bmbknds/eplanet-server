import { success, notFound } from "../../services/response/";
import { Record } from ".";
import { User } from "../user";
import moment from "moment";

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

export const submitReport = ({ bodymen: { body }, params }, res, next) =>
  Record.findById(params.id)
    .then(notFound(res))
    .then((record) => {
      console.log(record);
      if (!record) {
        return null;
      } else {
        return null;
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
  Record.find(restQuery)
    .then((data) => {
      setTimeout(() => {
        if (!data || data.length === 0) {
          return res.status(400).json({ message: "No classes in time range!" });
        }
        return Record.updateMany(restQuery, {
          $push: {
            logs: {
              teacherId: restQuery.teacherId,
              studentId: restQuery.studentId,
              role: restQuery.teacherId ? "teacher" : "student",
              reason,
              createdAt: moment().unix(),
            },
          },
        });
      }, 3000);
    })

    .then((result) => {
      console.log(result);
    })
    .catch(next);
};
