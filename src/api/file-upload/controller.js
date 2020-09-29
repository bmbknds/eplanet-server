export const create = ({ body, file }, res, next) => {
  console.log(file);
  return res.status(200).json({ path: file.path.replace("assets", "") });
};

export const show = ({ params }, res, next) => res.status(200).json({});
