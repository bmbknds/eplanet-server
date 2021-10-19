import { Router } from "express";
import { middleware as query } from "querymen";
import { middleware as body } from "bodymen";
import { token } from "../../services/passport";
import { create, index, show, update, destroy, getPublic } from "./controller";
import { schema } from "./model";
export Course, { schema } from "./model";

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
  documents,
} = schema.tree;

/**
 * @api {get} /course/public Get Public Coursees
 * @apiName GetPublicCoursee ( for guess )
 * @apiGroup Course

 * @apiUse listParams
 * @apiSuccess {Object[]} course List of course.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 admin access only.
 */

router.get("/public", getPublic);
/**
 * @api {post} /course Create course
 * @apiName CreateCourse
 * @apiGroup Course
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam name Course's name.
 * @apiParam title Course's title.
 * @apiParam introText Course's introText.
 * @apiParam introImage Course's introImage.
 * @apiParam targetText Course's targetText.
 * @apiParam targetImage Course's targetImage.
 * @apiParam activeTime Course's activeTime.
 * @apiParam price Course's price.
 * @apiParam lessons Course's lessons.
 * @apiParam status Course's status.
 * @apiSuccess {Object} course Course's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Course not found.
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
    documents,
  }),
  create
);

/**
 * @api {get} /course Retrieve course
 * @apiName RetrieveCourse
 * @apiGroup Course
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} course List of course.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 admin access only.
 */
router.get(
  "/",
  token({ required: true, roles: ["admin", "super-admin"] }),
  query({
    name: {
      type: RegExp,
      operator: "$regex",
      normalize: true,
    },
  }),
  index
);

/**
 * @api {get} /course/:id Retrieve cour
 * @apiName Detail Course
 * @apiGroup Course
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess {Object} course Course's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Course not found.
 * @apiError 401 admin access only.
 */
router.get(
  "/:id",
  // token({ required: true, roles: ["admin", "super-admin"] }),
  show
);

/**
 * @api {put} /course/:id Update course
 * @apiName UpdateCourse
 * @apiGroup Course
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam name Course's name.
 * @apiParam title Course's title.
 * @apiParam introText Course's introText.
 * @apiParam introImage Course's introImage.
 * @apiParam targetText Course's targetText.
 * @apiParam targetImage Course's targetImage.
 * @apiParam activeTime Course's activeTime.
 * @apiParam price Course's price.
 * @apiParam lessons Course's lessons.
 * @apiParam status Course's status.
 * @apiSuccess {Object} course Course's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Course not found.
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
    documents,
  }),
  update
);

/**
 * @api {delete} /course/:id Delete course
 * @apiName DeleteCourse
 * @apiGroup Course
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Course not found.
 * @apiError 401 admin access only.
 */
router.delete(
  "/:id",
  token({ required: true, roles: ["admin", "super-admin"] }),
  destroy
);

export default router;
