var path = require("path");
export const create = ({ body, file }, res, next) => {
  console.log(file);
  console.log(path.join(__dirname, "/assets"));
  return res
    .status(200)
    .json({
      path: file.path.replace(
        path.join(__dirname.replace("src/api/file-upload", ""), "/assets"),
        ""
      ),
    });
};

export const show = ({ params }, res, next) => res.status(200).json({});
