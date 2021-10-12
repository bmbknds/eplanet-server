import { sign } from "../../services/jwt";
import { success } from "../../services/response/";
import * as menu_en from "./menu_en";
import * as menu_vn from "./menu_vn";
import { User } from "../user";

export const login = ({ user }, res, next) => {
  return sign(user)
    .then(async (token) => {
      var userNew = await User.findById(user._id).populate([
        {
          path: "students",
        },
      ]);

      return { token, user: userNew.view(true) };
    })
    .then(success(res, 201))
    .catch(next);
};
export const checkAuth = async ({ user, headers }, res, next) => {
  // console.log(headers);
  var userNew = await User.findById(user._id).populate([
    {
      path: "students",
    },
  ]);
  success(
    res,
    200
  )({ userNew, token: headers.authorization.replace("Bearer ", "") });
};

export const getMenu = ({ user, body }, res, next) => {
  const menu = body.language === "vi" ? menu_vn : menu_en;
  if (user.role === "super-admin" || user.role === "admin") {
    return success(res, 200)(menu.adminMenu);
  }
  if (user.role === "student") {
    return success(res, 200)(menu.studentMenu);
  }
  if (user.role === "teacher") {
    return success(res, 200)(menu.teacherMenu);
  }

  return success(res, 200)([]);
  // return sign(user)
  //   .then((token) => ({ token, user: user.view(true) }))
  //   .then(success(res, 201))
  //   .catch(next);
};
