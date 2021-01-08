import { success, notFound } from "../../services/response/";
import { Order } from ".";
import Cours from "../cours/model";
import Record from "../record/model";
import { generateRecord } from "../../utils/index";
import mongoose, { Schema } from "mongoose";
const moment = require("moment");
const objectId = mongoose.Types.ObjectId;

export const create = async ({ body }, res, next) => {
  try {
    const cours = await Cours.findById(body.coursId);
    if (!cours) {
      return res.status(400).json({ message: "This cours is not available." });
    }
    body.coursDetail = cours;
    body._id = new objectId();

    const records = await generateRecord(body);
    return Record.insertMany(records).then(
      Order.create(body)
        .then((order) => order.view(true))
        .then(success(res, 201))
        .catch(next)
    );
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

export const show = ({ params }, res, next) =>
  Order.findById(params.id)
    .then(notFound(res))
    .then((order) => (order ? order.view() : null))
    .then(success(res))
    .catch(next);

export const update = ({ body, params }, res, next) => {
  return Order.findById(params.id)
    .populate({ path: "cours" })
    .then(notFound(res))
    .then(async (order) => {
      if (order) {
        if (body.status === "active") {
          body.status = "pending";

          body.records = await generateRecord(order);
          return null;
          // return Object.assign(order, body).save();
        }
      } else {
        return null;
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
  // const { teacherId } = body;
  console.log(body);
  return Order.find(body)
    .populate({ path: "student", select: "name" })
    .then((orders) => {
      let bookedSlot = [];
      orders.forEach((element) => {
        if (element.status === "active") {
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

export const getPendingForAdmin = (req, res, next) => {
  const { filter } = req.body;
  return Order.find(filter)
    .populate([
      { path: "student", select: "name phoneNumber" },
      { path: "teacher", select: "name" },
      { path: "cours" },
    ])

    .then(success(res))
    .catch(next);
};
