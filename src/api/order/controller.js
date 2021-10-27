import { success, notFound } from "../../services/response/";
import { Order } from ".";
import Course from "../course/model";
import Users from "../user/model";
import Record from "../record/model";
import { generateRecord, generateTrial } from "../../utils/index";
import lodash from "lodash";
import mongoose, { Schema } from "mongoose";
const moment = require("moment");
const objectId = mongoose.Types.ObjectId;

export const create = async ({ body }, res, next) => {
  try {
    const course = await Course.findById(body.courseId);
    if (!course) {
      return res.status(400).json({ message: "This course is not available." });
    }
    body.courseDetail = course;
    body._id = new objectId();
    console.log(body);

    return Order.create(body)
      .then(async (order) => {
        if (order.learnTrial) {
          console.log(order);
          const records = await generateTrial(order);
          await Record.insertMany(records);
        }

        return order.view(true);
      })
      .then(success(res, 201))
      .catch(next);
    // return res.status(500).json(records);
  } catch (err) {
    next(err);
  }
};

export const index = (req, res, next) => {
  const { filter } = req.body;
  return Order.find(filter)
    .then((orders) => orders.map((order) => order.view()))
    .then(success(res))
    .catch(next);
};
export const getListStudent = (
  { querymen: { query, select, cursor }, user },
  res,
  next
) => {
  const matchQuery = {};
  if (user.role === "teacher") {
    matchQuery.teacherId = user._id.toString();
  }
  if (user.role === "student") {
    matchQuery.studentId = user._id.toString();
  }
  if (query._id) {
    matchQuery._id = mongoose.Types.ObjectId(query._id);
  }
  if (query.status) {
    matchQuery.status = query.status;
  }
  if (query.startDate) {
    // console.log("date", moment.isDate(query.startDate["$gte"]));
    matchQuery.startDate = query.startDate;
  }
  const aggregateQuery = [
    {
      $match: matchQuery,
    },
    {
      $addFields: {
        objectIdStudent: { $toObjectId: "$studentId" },
        objectIdTeacher: { $toObjectId: "$teacherId" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "objectIdStudent",
        foreignField: "_id",
        as: "studentDetail",
      },
    },

    {
      $unwind: "$studentDetail",
    },
    {
      $addFields: {
        studentName: "$studentDetail.name",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "objectIdTeacher",
        foreignField: "_id",
        as: "teacherDetail",
      },
    },

    {
      $project: {
        objectIdStudent: 0,
      },
    },
  ];

  if (query.studentName) {
    aggregateQuery.push({
      $match: {
        studentName: {
          $regex: query.studentName,
          $options: "i",
        },
      },
    });
  }
  aggregateQuery.push({
    $addFields: {
      stringIdOrder: { $toString: "$_id" },
    },
  });
  aggregateQuery.push({
    $lookup: {
      from: "records",
      localField: "stringIdOrder",
      foreignField: "orderId",
      as: "records",
    },
  });
  return Order.aggregate(aggregateQuery)
    .then((orders) => res.status(200).json(orders))
    .catch((err) => {
      console.log(err);
      return next();
    });
};

export const show = ({ params }, res, next) =>
  Order.findById(params.id)
    .then(notFound(res))
    .then((order) => (order ? order.view() : null))
    .then(success(res))
    .catch(next);

export const update = ({ body, params }, res, next) => {
  return Order.findById(params.id)
    .populate({ path: "course" })
    .then(notFound(res))
    .then(async (order) => {
      if (body.status === "active") {
        const records = await generateRecord(order);
        return Record.insertMany(records).then(() => {
          order.status = body.status;
          order.paid = body.paid;
          return order.save();
        });
      } else {
        order.status = "cancel";
        return order.save();
      }
    })
    .then((order) => (order ? order.view(true) : null))
    .then(success(res))
    .catch(next);
  // (order ? Object.assign(order, body).save() : null))
};

export const destroy = ({ params }, res, next) =>
  Order.findById(params.id)
    .then(notFound(res))
    .then((order) => (order ? order.remove() : null))
    .then(success(res, 204))
    .catch(next);

export const getBookedSlot = ({ body }, res, next) => {
  return Order.find({ ...body })
    .populate({ path: "student", select: "name" })
    .then((orders) => {
      let bookedSlot = [];
      orders.forEach((element) => {
        if (element.status === "active" || element.status === "pending") {
          const timeTable = element.timeTable.map((item) => ({
            ...item,
            status: element.status,
            student: element.student,
          }));
          bookedSlot = [...bookedSlot, ...timeTable];
        }
      });
      return bookedSlot;
    })
    .then(success(res, 200))
    .catch(next);
};

export const getAvailableSlots = ({ body }, res, next) => {
  return Order.find({ ...body })
    .populate({ path: "student", select: "name" })
    .then((orders) => {
      let bookedSlot = [];
      orders.forEach((element) => {
        if (element.status === "active" || element.status === "pending") {
          const timeTable = element.timeTable.map((item) => ({
            ...item,
            status: element.status,
            student: element.student,
          }));
          bookedSlot = [...bookedSlot, ...timeTable];
        }
      });
      return bookedSlot;
    })
    .then(success(res, 200))
    .catch(next);
};

export const getTeachersAndSlot = ({ query }, res, next) => {
  return Users.aggregate([
    {
      $match: {
        role: "teacher",
        teacherInfor: { $ne: null },
        status: "active",
      },
    },
    {
      $addFields: {
        stringIdTeacher: { $toString: "$_id" },
      },
    },
    {
      $lookup: {
        from: "orders",
        localField: "stringIdTeacher",
        foreignField: "teacherId",
        as: "orders",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        picture: 1,
        teacherInfor: 1,
        "orders.timeTable": 1,
        "orders.status": 1,
      },
    },
  ])
    .then(success(res, 200))
    .catch(next);
};

export const getPendingForAdmin = (req, res, next) => {
  const { filter } = req.body;
  return Order.find(filter)
    .populate([
      { path: "student", select: "name phoneNumber" },
      { path: "teacher", select: "name" },
      { path: "course" },
    ])

    .then(success(res))
    .catch(next);
};
