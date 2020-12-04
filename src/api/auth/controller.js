import { sign } from "../../services/jwt";
import { success } from "../../services/response/";
import * as menu_en from "./menu_en";
import * as menu_vn from "./menu_vn";
export const login = ({ user }, res, next) => {
  return sign(user)
    .then((token) => ({ token, user: user.view(true) }))
    .then(success(res, 201))
    .catch(next);
};

export const getMenu = ({ user, body }, res, next) => {
  const menu = body.language === "vi" ? menu_vn : menu_en;
  if (user.role === "super-admin" || user.role === "admin") {
    return success(res, 200)(menu.adminMenu);
  }
  if (user.role === "student") {
    const menu = menu_en.studentMenu;
    return success(res, 200)(menu.studentMenu);
  }

  return success(res, 200)([]);
  // return sign(user)
  //   .then((token) => ({ token, user: user.view(true) }))
  //   .then(success(res, 201))
  //   .catch(next);
};
