import { sign } from "../../services/jwt";
import { success } from "../../services/response/";
import * as menu_en from "./menu_en";
export const login = ({ user }, res, next) => {
  return sign(user)
    .then((token) => ({ token, user: user.view(true) }))
    .then(success(res, 201))
    .catch(next);
};

export const getMenu = ({ user, body }, res, next) => {
  if (user.role === "super-admin" || user.role === "admin") {
    const menu = menu_en.adminMenu;
    return success(res, 200)(menu);
  }
  if (user.role === "student") {
    const menu = menu_en.studentMenu;
    return success(res, 200)(menu);
  }

  return success(res, 200)([]);
  // return sign(user)
  //   .then((token) => ({ token, user: user.view(true) }))
  //   .then(success(res, 201))
  //   .catch(next);
};
