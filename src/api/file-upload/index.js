import { Router } from "express";
import { token } from "../../services/passport";
import { create, show } from "./controller";
const multer = require("multer");
const fs = require("fs");
var path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, `assets/images`).replace("src/api/file-upload", "")
    );
  },
  filename: function (req, file, cb) {
    // console.log(req.params);
    cb(null, req.params.id + "-" + Date.now() + ".png");
  },
});
var fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, `assets/files`).replace("src/api/file-upload", "")
    );
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, req.params.id + "-" + Date.now() + file.originalname);
  },
});
var upload = multer({ storage: storage });

const router = new Router();

/**
 * @api {post} /file-uploads Create file upload
 * @apiName CreateFileUpload
 * @apiGroup FileUpload
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess {Object} fileUpload File upload's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 File upload not found.
 * @apiError 401 admin access only.
 */
router.post(
  "/image/:id",
  token({
    required: true,
    roles: ["admin", "teacher", "super-admin", "student"],
  }),
  upload.single("image"),
  create
);

/**
 * @api {get} /file-uploads/:id Retrieve file upload
 * @apiName RetrieveFileUpload
 * @apiGroup FileUpload
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess {Object} fileUpload File upload's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 File upload not found.
 * @apiError 401 admin access only.
 */
router.get(
  "/:id",
  token({
    required: true,
    roles: ["admin", "teacher", "super-admin", "student"],
  }),
  show
);

router.post(
  "/file/:id",
  token({
    required: true,
    roles: ["admin", "teacher", "super-admin", "student"],
  }),
  multer({ storage: fileStorage }).single("file"),
  create
);

export default router;
