import { Router } from "express";
import { middleware as query } from "querymen";
import { middleware as body } from "bodymen";
import {
  create,
  index,
  show,
  update,
  destroy,
  report,
  takeLeave,
  submitReport,
  getTakeLeaveRecords,
} from "./controller";
import { schema } from "./model";
import {
  password as passwordAuth,
  master,
  token,
} from "../../services/passport";

export Record, { schema } from "./model";

const router = new Router();
const { status, studentComment, teacherComment, teacherId, studentId, kind } =
  schema.tree;

/**
 * @api {post} /records Create record
 * @apiName CreateRecord
 * @apiGroup Record
 * @apiParam status Record's status.
 * @apiParam studentComment Record's studentComment.
 * @apiParam teacherComment Record's teacherComment.
 * @apiSuccess {Object} record Record's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Record not found.
 */
router.post(
  "/",
  token({
    required: true,
    roles: ["admin", "super-admin", "teacher"],
  }),
  body({ status, studentComment, teacherComment }),
  create
);

/**
 * @api {post} /records Create record
 * @apiName CreateRecord
 * @apiGroup Record
 * @apiParam status Record's status.
 * @apiParam studentComment Record's studentComment.
 * @apiParam teacherComment Record's teacherComment.
 * @apiSuccess {Object} record Record's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Record not found.
 */
router.post(
  "/increase",
  token({
    required: true,
    roles: ["admin", "super-admin", "teacher"],
  }),
  body({
    quantity: {
      type: Number,
      require: true,
    },
    orderId: {
      type: String,
      require: true,
    },
    kind,
  }),
  create
);

/**
 * @api {get} /records Retrieve records
 * @apiName RetrieveRecords
 * @apiGroup Record
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of records.
 * @apiSuccess {Object[]} rows List of records.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get(
  "/",
  query({
    from: {
      type: Number,
      paths: ["recordDate"],
      operator: "$gte",
    },
    to: {
      type: Number,
      paths: ["recordDate"],
      operator: "$lte",
    },

    teacherId,
  }),
  index
);
/**
 * @api {get} /records Retrieve records
 * @apiName RetrieveRecords
 * @apiGroup Record
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of records.
 * @apiSuccess {Object[]} rows List of records.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get(
  "/report",
  token({ required: true }),
  query({
    from: {
      type: Number,
      paths: ["recordDate"],
      operator: "$gte",
    },
    to: {
      type: Number,
      paths: ["recordDate"],
      operator: "$lte",
    },
    timeStart: {
      type: String,
    },
    timeEnd: {
      type: String,
    },
    studentName: {
      type: String,
    },
    teacherId,
  }),
  report
);

/**
 * @api {put} /records/:id Update record
 * @apiName UpdateRecord
 * @apiGroup Record
 * @apiParam status Record's status.
 * @apiParam studentComment Record's studentComment.
 * @apiParam teacherComment Record's teacherComment.
 * @apiSuccess {Object} record Record's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Record not found.
 */
router.get(
  "/take-leave",
  token({ required: true }),
  query({
    from: {
      type: Number,
      paths: ["recordDate"],
      operator: "$gte",
    },
    to: {
      type: Number,
      paths: ["recordDate"],
      operator: "$lte",
    },
    reason: {
      type: String,
    },

    teacherId: {
      type: String,
    },
    studentId: {
      type: String,
    },
  }),
  takeLeave
);
router.get(
  "/take-leave-records",
  token({ required: true }),
  query({
    from: {
      type: Number,
      paths: ["recordDate"],
      operator: "$gte",
    },
    to: {
      type: Number,
      paths: ["recordDate"],
      operator: "$lte",
    },
  }),
  getTakeLeaveRecords
);
router.put(
  "/report/:id",
  token({ required: true }),
  body({ status, studentComment, teacherComment }),
  submitReport
);
/**
 * @api {get} /records/:id Retrieve record
 * @apiName RetrieveRecord
 * @apiGroup Record
 * @apiSuccess {Object} record Record's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Record not found.
 */
router.get("/:id", show);

/**
 * @api {put} /records/:id Update record
 * @apiName UpdateRecord
 * @apiGroup Record
 * @apiParam status Record's status.
 * @apiParam studentComment Record's studentComment.
 * @apiParam teacherComment Record's teacherComment.
 * @apiSuccess {Object} record Record's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Record not found.
 */
router.put("/:id", body({ status, studentComment, teacherComment }), update);

/**
 * @api {delete} /records/:id Delete record
 * @apiName DeleteRecord
 * @apiGroup Record
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Record not found.
 */
router.delete("/:id", destroy);

export default router;
