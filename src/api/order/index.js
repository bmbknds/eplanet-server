import { Router } from "express";
import { middleware as query } from "querymen";
import { middleware as body } from "bodymen";
import {
  create,
  index,
  show,
  update,
  destroy,
  getBookedSlot,
} from "./controller";
import { schema } from "./model";
export Order, { schema } from "./model";

const router = new Router();
const { studentId, teacherId, timeTable, coursId, records } = schema.tree;

/**
 * @api {post} /orders Create order
 * @apiName CreateOrder
 * @apiGroup Order
 * @apiParam studentId Order's studentId.
 * @apiParam teacherId Order's teacherId.
 * @apiParam timeTable Order's timeTable.
 * @apiParam coursId Order's coursId.
 * @apiParam records Order's records.
 * @apiSuccess {Object} order Order's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Order not found.
 */
router.post(
  "/",
  // body({ studentId, teacherId, timeTable, coursId, records }),
  create
);

/**
 * @api {get} /orders Retrieve orders
 * @apiName RetrieveOrders
 * @apiGroup Order
 * @apiUse listParams
 * @apiSuccess {Object[]} orders List of orders.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/", query(), index);

/**
 * @api {get} /orders/:id Retrieve order
 * @apiName RetrieveOrder
 * @apiGroup Order
 * @apiSuccess {Object} order Order's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Order not found.
 */
router.get("/:id", show);

/**
 * @api {put} /orders/:id Update order
 * @apiName UpdateOrder
 * @apiGroup Order
 * @apiParam studentId Order's studentId.
 * @apiParam teacherId Order's teacherId.
 * @apiParam timeTable Order's timeTable.
 * @apiParam coursId Order's coursId.
 * @apiParam records Order's records.
 * @apiSuccess {Object} order Order's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Order not found.
 */
router.put(
  "/:id",
  body({ studentId, teacherId, timeTable, coursId, records }),
  update
);

/**
 * @api {delete} /orders/:id Delete order
 * @apiName DeleteOrder
 * @apiGroup Order
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Order not found.
 */
router.delete("/:id", destroy);

/**
 * @api {post} /orders Create order
 * @apiName CreateOrder
 * @apiGroup Order
 * @apiParam studentId Order's studentId.
 * @apiParam teacherId Order's teacherId.
 * @apiParam timeTable Order's timeTable.
 * @apiParam coursId Order's coursId.
 * @apiParam records Order's records.
 * @apiSuccess {Object} order Order's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Order not found.
 */
router.post(
  "/getBookedSlot",
  // body({ studentId, teacherId, timeTable, coursId, records }),
  getBookedSlot
);

export default router;
