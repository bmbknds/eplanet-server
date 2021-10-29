import { Router } from "express";
import { extname } from "path";
import { token } from "../../services/passport";
import { create, show, uploadFinalReport } from "./controller";
const multer = require("multer");
const fs = require("fs");
var path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = path
      .join(__dirname, `assets/images`)
      .replace("src/api/file-upload", "");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // console.log(req.params);
    cb(null, req.params.id + "-" + Date.now() + ".png");
  },
});

var fileStorage = multer.diskStorage({
  destination: function ({ params }, file, cb) {
    var dir = path
      .join(__dirname, `assets/files`)
      .replace("src/api/file-upload", "");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function ({ params }, file, cb) {
    cb(
      null,
      (params.id || params.orderId) +
        "-" +
        Date.now() +
        extname(file.originalname)
    );
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
router.post(
  "/final-report/:orderId",
  token({
    required: true,
    roles: ["admin", "teacher", "super-admin", "student"],
  }),
  multer({ storage: fileStorage }).single("file"),
  uploadFinalReport
);

export default router;
