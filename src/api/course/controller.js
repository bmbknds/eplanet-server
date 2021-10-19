import { success, notFound } from "../../services/response/";
import { Course } from ".";
import { pickBy, identity } from "lodash";
import { checkInUse } from "../../utils/index";
import mongoose from "mongoose";
export const create = ({ bodymen: { body } }, res, next) =>
  Course.create(body)
    .then((course) => course.view(true))
    .then(success(res, 201))
    .catch(next);

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Course.find(query, select, cursor)
    .then((course) => course.map((course) => course.view()))
    .then(success(res))
    .catch(next);

export const show = ({ params }, res, next) =>
  Course.findById(params.id)
    .then(notFound(res))
    .then((course) => (course ? course.view() : null))
    .then(success(res))
    .catch(next);

export const update = ({ bodymen: { body }, params }, res, next) => {
  console.log(body);
  return Course.findById(params.id)
    .then(notFound(res))
    .then((course) =>
      course ? Object.assign(course, pickBy(body, identity)).save() : null
    )
    .then((course) => (course ? course.view(true) : null))
    .then(success(res))
    .catch(next);
};

export const destroy = async ({ params }, res, next) => {
  Course.findById(params.id)
    .then(notFound(res))
    .then(async (course) => {
      const isInUse = await checkInUse([
        {
          name: "Order",
          fields: [
            {
              name: "courseId",
              value: mongoose.Types.ObjectId(params.id),
            },
          ],
        },
      ]);
      console.log(isInUse);
      if (!isInUse) {
        // return true;
        return course.remove();
      } else {
        res
          .status(500)
          .json({ code: 403, message: "Delete failed. Course is using!" })
          .end();
        return null;
      }
    })

    .then(success(res, 204))

    .catch(next);
};
// Course.findById(params.id)
//   .then(notFound(res))
//   .then((course) => (course ? course.remove() : null))
//   .then(success(res, 204))
//   .catch(next);

export const getPublic = (req, res, next) =>
  Course.find({ status: "active" })
    .sort({ createdAt: -1 })
    .then((course) => course.map((course) => course.view()))
    .then(success(res))
    .catch(next);
