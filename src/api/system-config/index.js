import { Router } from "express";
import { middleware as query } from "querymen";
import { middleware as body } from "bodymen";
import { token } from "../../services/passport";
import { create, index, show, update, destroy } from "./controller";
import { schema } from "./model";
export SystemConfig, { schema } from "./model";

const router = new Router();
const { key, description, value } = schema.tree;

/**
 * @api {post} /system-configs Create system config
 * @apiName CreateSystemConfig
 * @apiGroup SystemConfig
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam key System config's key.
 * @apiParam description System config's description.
 * @apiParam value System config's value.
 * @apiSuccess {Object} systemConfig System config's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 System config not found.
 * @apiError 401 admin access only.
 */
router.post(
  "/",
  token({ required: true, roles: ["admin", "super-admin"] }),
  body({ key, description, value }),
  create
);

/**
 * @api {get} /system-configs Retrieve system configs
 * @apiName RetrieveSystemConfigs
 * @apiGroup SystemConfig
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of system configs.
 * @apiSuccess {Object[]} rows List of system configs.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 admin access only.
 */
router.get(
  "/",
  token({ required: true, roles: ["admin", "super-admin"] }),
  query(),
  index
);

/**
 * @api {get} /system-configs/:id Retrieve system config
 * @apiName RetrieveSystemConfig
 * @apiGroup SystemConfig
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess {Object} systemConfig System config's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 System config not found.
 * @apiError 401 admin access only.
 */
router.get(
  "/:id",
  token({ required: true, roles: ["admin", "super-admin"] }),
  show
);

/**
 * @api {put} /system-configs/:id Update system config
 * @apiName UpdateSystemConfig
 * @apiGroup SystemConfig
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam key System config's key.
 * @apiParam description System config's description.
 * @apiParam value System config's value.
 * @apiSuccess {Object} systemConfig System config's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 System config not found.
 * @apiError 401 admin access only.
 */
router.put(
  "/:id",
  token({ required: true, roles: ["admin", "super-admin"] }),
  body({ key, description, value }),
  update
);

/**
 * @api {delete} /system-configs/:id Delete system config
 * @apiName DeleteSystemConfig
 * @apiGroup SystemConfig
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 System config not found.
 * @apiError 401 admin access only.
 */
router.delete(
  "/:id",
  token({ required: true, roles: ["admin", "super-admin"] }),
  destroy
);

export default router;
