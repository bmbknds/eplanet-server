import { success, notFound } from "../../services/response/";
import { User } from ".";
import { sign } from "../../services/jwt";
import { pickBy, identity } from "lodash";
import lodash from "lodash";
import { checkInUse } from "../../utils/index";
import mongoose from "mongoose";
export const index = ({ querymen: { query, select, cursor } }, res, next) => {
  // const { filter } = req.body;
  query.status = "active";
  return User.find(query, select, cursor)
    .then((users) => users.map((user) => user.view()))
    .then(success(res))
    .catch(next);
};

export const show = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => (user ? user.view(true) : null))
    .then(success(res))
    .catch(next);

export const showMe = ({ user }, res) => res.json(user.view(true));

export const create = ({ bodymen: { body } }, res, next) =>
  User.create(body)
    .then((user) => {
      sign(user.id)
        .then((token) => ({ token, user: user.view(true) }))
        .then(success(res, 201));
    })
    .catch((err) => {
      // console.log(err.errors);
      /* istanbul ignore else */
      if (err.errors) {
        let message = "";
        Object.keys(err.errors).forEach((item) => {
          if (item === "email") {
            message = message + "Email already registered. \n ";
          }
          if (item === "phoneNumber") {
            message = message + "Phone number already registered. \n ";
          }
        });

        res.status(409).json({
          valid: false,
          param: "email",
          message,
        });
      } else {
        next(err);
      }
    });

export const update = ({ bodymen: { body }, params, user }, res, next) =>
  User.findById(params.id === "me" ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null;
      const isAdmin = user.role === "admin" || user.role === "super-admin";
      const isSelfUpdate = user.id === result.id;
      if (!isSelfUpdate && !isAdmin) {
        res.status(401).json({
          valid: false,
          message: "You can't change other user's data",
        });
        return null;
      }
      return result;
    })
    .then((user) => {
      // console.log(1);
      // console.log(
      //   "1",
      //   lodash.difference(
      //     lodash.keys(user), // ["104", "102", "101"]
      //     lodash.keys(pickBy(body, identity)) // ["104", "102"]
      //   )
      // );
      return user ? Object.assign(user, pickBy(body, identity)).save() : null;
    })
    .then((user) => (user ? user.view(true) : null))
    .then(success(res))
    .catch((err) => {
      if (err.errors) {
        let message = "";
        Object.keys(err.errors).forEach((item) => {
          if (item === "email") {
            message = message + "Email already registered. \n ";
          }
          if (item === "phoneNumber") {
            message = message + "Phone number already registered. \n ";
          }
        });

        res.status(409).json({
          valid: false,
          param: "email",
          message,
        });
      } else {
        next(err);
      }
    });

export const updatePassword = (
  { bodymen: { body }, params, user },
  res,
  next
) =>
  User.findById(params.id === "me" ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null;
      const isSelfUpdate = user.id === result.id;
      if (!isSelfUpdate) {
        res.status(401).json({
          valid: false,
          param: "password",
          message: "You can't change other user's password",
        });
        return null;
      }
      return result;
    })
    .then((user) =>
      user ? user.set({ password: body.password }).save() : null
    )
    .then((user) => (user ? user.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = async ({ params }, res, next) => {
  User.findById(params.id)
    .then(notFound(res))
    .then(async (user) => {
      const isInUse = await checkInUse([
        {
          name: "Order",
          fields: [
            {
              name: user.role === "teacher" ? "teacherId" : "studentId",
              value: params.id,
            },

            {
              name: "status",
              value: "active",
            },
          ],
        },
      ]);
      if (!isInUse) {
        // return true;
        user.status = "deleted";
        return user.save();
      } else {
        res
          .status(500)
          .json({
            code: 403,
            message: "Delete failed. User is in active class!",
          })
          .end();
        return null;
      }
    })
    .then(success(res, 204))
    .catch(next);
};
