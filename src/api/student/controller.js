import { success, notFound } from "../../services/response/";
import { Student } from ".";

export const create = ({ bodymen: { body } }, res, next) =>
  Student.create(body)
    .then((student) => student.view(true))
    .then(success(res, 201))
    .catch(next);

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Student.find(query, select, cursor)
    .populate("parentId", "_id, name")
    .then((students) => students.map((student) => student.view()))
    .then(success(res))
    .catch(next);

export const show = ({ params }, res, next) =>
  Student.findById(params.id)
    .populate("parentId", "_id, name")
    .then(notFound(res))
    .then((student) => (student ? student.view() : null))
    .then(success(res))
    .catch(next);

export const update = ({ bodymen: { body }, params }, res, next) =>
  Student.findById(params.id)
    .then(notFound(res))
    .then((student) => (student ? Object.assign(student, body).save() : null))
    .then((student) => (student ? student.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ params }, res, next) =>
  Student.findById(params.id)
    .then(notFound(res))
    .then((student) => (student ? student.remove() : null))
    .then(success(res, 204))
    .catch(next);
