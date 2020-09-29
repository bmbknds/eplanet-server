import { Router } from "express";
import { middleware as query } from "querymen";
import { middleware as body } from "bodymen";
import { token } from "../../services/passport";
import { create, index, show, update, destroy } from "./controller";
import { schema } from "./model";
export Cours, { schema } from "./model";

const router = new Router();
const {
  name,
  title,
  introText,
  introImage,
  targetText,
  targetImage,
  activeTime,
  price,
  lessons,
  status,
} = schema.tree;

/**
 * @api {post} /cours Create cours
 * @apiName CreateCours
 * @apiGroup Cours
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam name Cours's name.
 * @apiParam title Cours's title.
 * @apiParam introText Cours's introText.
 * @apiParam introImage Cours's introImage.
 * @apiParam targetText Cours's targetText.
 * @apiParam targetImage Cours's targetImage.
 * @apiParam activeTime Cours's activeTime.
 * @apiParam price Cours's price.
 * @apiParam lessons Cours's lessons.
 * @apiParam status Cours's status.
 * @apiSuccess {Object} cours Cours's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Cours not found.
 * @apiError 401 admin access only.
 */
router.post(
  "/",
  token({ required: true, roles: ["admin", "super-admin"] }),
  body({
    name,
    title,
    introText,
    introImage,
    targetText,
    targetImage,
    activeTime,
    price,
    lessons,
    status,
  }),
  create
);

/**
 * @api {get} /cours Retrieve cours
 * @apiName RetrieveCours
 * @apiGroup Cours
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} cours List of cours.
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
 * @api {get} /cours/:id Retrieve cours
 * @apiName RetrieveCours
 * @apiGroup Cours
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess {Object} cours Cours's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Cours not found.
 * @apiError 401 admin access only.
 */
router.get(
  "/:id",
  token({ required: true, roles: ["admin", "super-admin"] }),
  show
);

/**
 * @api {put} /cours/:id Update cours
 * @apiName UpdateCours
 * @apiGroup Cours
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam name Cours's name.
 * @apiParam title Cours's title.
 * @apiParam introText Cours's introText.
 * @apiParam introImage Cours's introImage.
 * @apiParam targetText Cours's targetText.
 * @apiParam targetImage Cours's targetImage.
 * @apiParam activeTime Cours's activeTime.
 * @apiParam price Cours's price.
 * @apiParam lessons Cours's lessons.
 * @apiParam status Cours's status.
 * @apiSuccess {Object} cours Cours's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Cours not found.
 * @apiError 401 admin access only.
 */
router.put(
  "/:id",
  token({ required: true, roles: ["admin", "super-admin"] }),
  body({
    name,
    title,
    introText,
    introImage,
    targetText,
    targetImage,
    activeTime,
    price,
    lessons,
    status,
  }),
  update
);

/**
 * @api {delete} /cours/:id Delete cours
 * @apiName DeleteCours
 * @apiGroup Cours
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Cours not found.
 * @apiError 401 admin access only.
 */
router.delete(
  "/:id",
  token({ required: true, roles: ["admin", "super-admin"] }),
  destroy
);

export default router;
