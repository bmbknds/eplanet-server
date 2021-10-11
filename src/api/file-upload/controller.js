import { success, notFound } from "../../services/response/";
import { Order } from "../order";
var path = require("path");
export const create = ({ body, file }, res, next) => {
  console.log(file);
  console.log(path.join(__dirname, "/assets"));
  return res.status(200).json({
    path: file.path.replace(
      path.join(__dirname.replace("src/api/file-upload", ""), "/assets"),
      ""
    ),
  });
};

export const uploadFinalReport = ({ body, file, params }, res, next) => {
  const finalReport = Object.assign({}, file);
  console.log("file", file);
  console.log(path.join(__dirname.replace("/src/api/file-upload", "")));
  finalReport.path = file.path.replace(
    path.join(__dirname.replace("/src/api/file-upload", ""), "/assets"),
    ""
  );

  Order.findById(params.orderId)
    .then((order) => {
      order.finalReport = [...order.finalReport, ...[finalReport]];
      return order.save();
    })
    .then(success(res))
    .catch(next);
  // return res.status(200).json({
  //   path: file.path.replace(
  //     path.join(__dirname.replace("src/api/file-upload", ""), "/assets"),
  //     ""
  //   ),
  // });
};

export const show = ({ params }, res, next) => res.status(200).json({});
