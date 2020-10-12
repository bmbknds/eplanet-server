import { success, notFound } from "../../services/response/";
import { Order } from ".";
import mongoose, { Schema } from "mongoose";
const objectId = mongoose.Types.ObjectId;

export const create = ({ body }, res, next) => {
  return Order.create(body)
    .then((order) => order.view(true))
    .then(success(res, 201))
    .catch(next);
};

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Order.find(query, select, cursor)
    .then((orders) => orders.map((order) => order.view()))
    .then(success(res))
    .catch(next);

export const show = ({ params }, res, next) =>
  Order.findById(params.id)
    .then(notFound(res))
    .then((order) => (order ? order.view() : null))
    .then(success(res))
    .catch(next);

export const update = ({ bodymen: { body }, params }, res, next) =>
  Order.findById(params.id)
    .then(notFound(res))
    .then((order) => (order ? Object.assign(order, body).save() : null))
    .then((order) => (order ? order.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ params }, res, next) =>
  Order.findById(params.id)
    .then(notFound(res))
    .then((order) => (order ? order.remove() : null))
    .then(success(res, 204))
    .catch(next);

export const getBookedSlot = ({ body }, res, next) => {
  // const { teacherId } = body;
  return Order.find(body)
    .then((orders) => {
      let bookedSlot = [];
      orders.forEach((element) => {
        bookedSlot = [...bookedSlot, ...element.timeTable];
      });
      return bookedSlot;
    })
    .then(success(res, 201))
    .catch(next);
};
