import { Router } from "express";
import user from "./user";
import student from "./student";
import auth from "./auth";
import passwordReset from "./password-reset";
import cours from "./cours";

import fileUpload from "./file-upload";
import order from "./order";
import record from "./record";
import systemConfig from "./system-config";

const router = new Router();

/**
 * @apiDefine master Master access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine admin Admin access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine user User access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine listParams
 * @apiParam {String} [q] Query to search.
 * @apiParam {Number{1..30}} [page=1] Page number.
 * @apiParam {Number{1..100}} [limit=30] Amount of returned items.
 * @apiParam {String[]} [sort=-createdAt] Order of returned items.
 * @apiParam {String[]} [fields] Fields to be returned.
 */
router.use("/users", user);
router.use("/students", student);
router.use("/auth", auth);
router.use("/password-resets", passwordReset);
router.use("/cours", cours);

router.use("/file-uploads", fileUpload);
router.use("/orders", order);
router.use("/records", record);
router.use("/system-configs", systemConfig);

export default router;
