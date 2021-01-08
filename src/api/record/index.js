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
} from "./controller";
import { schema } from "./model";
import {
  password as passwordAuth,
  master,
  token,
} from "../../services/passport";
export Record, { schema } from "./model";

const router = new Router();
const {
  status,
  studentFeedback,
  teacherFeedback,
  teacherId,
  studentId,
} = schema.tree;

/**
 * @api {post} /records Create record
 * @apiName CreateRecord
 * @apiGroup Record
 * @apiParam status Record's status.
 * @apiParam studentFeedback Record's studentFeedback.
 * @apiParam teacherFeedback Record's teacherFeedback.
 * @apiSuccess {Object} record Record's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Record not found.
 */
router.post("/", body({ status, studentFeedback, teacherFeedback }), create);

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
 * @apiParam studentFeedback Record's studentFeedback.
 * @apiParam teacherFeedback Record's teacherFeedback.
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
router.put(
  "/report/:id",
  body({ status, studentFeedback, teacherFeedback }),
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
 * @apiParam studentFeedback Record's studentFeedback.
 * @apiParam teacherFeedback Record's teacherFeedback.
 * @apiSuccess {Object} record Record's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Record not found.
 */
router.put("/:id", body({ status, studentFeedback, teacherFeedback }), update);

/**
 * @api {delete} /records/:id Delete record
 * @apiName DeleteRecord
 * @apiGroup Record
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Record not found.
 */
router.delete("/:id", destroy);

export default router;
