import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Student, { schema } from './model'

const router = new Router()
const { studentName, age } = schema.tree

/**
 * @api {post} /student Create student
 * @apiName CreateStudent
 * @apiGroup Student
 * @apiParam studentName Student's studentName.
 * @apiParam age Student's age.
 * @apiSuccess {Object} student Student's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Student not found.
 */
router.post('/',
  body({ studentName, age }),
  create)

/**
 * @api {get} /student Retrieve students
 * @apiName RetrieveStudents
 * @apiGroup Student
 * @apiUse listParams
 * @apiSuccess {Object[]} students List of students.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /student/:id Retrieve student
 * @apiName RetrieveStudent
 * @apiGroup Student
 * @apiSuccess {Object} student Student's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Student not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /student/:id Update student
 * @apiName UpdateStudent
 * @apiGroup Student
 * @apiParam studentName Student's studentName.
 * @apiParam age Student's age.
 * @apiSuccess {Object} student Student's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Student not found.
 */
router.put('/:id',
  body({ studentName, age }),
  update)

/**
 * @api {delete} /student/:id Delete student
 * @apiName DeleteStudent
 * @apiGroup Student
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Student not found.
 */
router.delete('/:id',
  destroy)

export default router
