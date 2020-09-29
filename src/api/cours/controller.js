import { success, notFound } from "../../services/response/";
import { Cours } from ".";
import { pickBy, identity } from "lodash";

export const create = ({ bodymen: { body } }, res, next) =>
  Cours.create(body)
    .then((cours) => cours.view(true))
    .then(success(res, 201))
    .catch(next);

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Cours.find(query, select, cursor)
    .then((cours) => cours.map((cours) => cours.view()))
    .then(success(res))
    .catch(next);

export const show = ({ params }, res, next) =>
  Cours.findById(params.id)
    .then(notFound(res))
    .then((cours) => (cours ? cours.view() : null))
    .then(success(res))
    .catch(next);

export const update = ({ bodymen: { body }, params }, res, next) => {
  return Cours.findById(params.id)
    .then(notFound(res))
    .then((cours) =>
      cours ? Object.assign(cours, pickBy(body, identity)).save() : null
    )
    .then((cours) => (cours ? cours.view(true) : null))
    .then(success(res))
    .catch(next);
};

export const destroy = ({ params }, res, next) =>
  Cours.findById(params.id)
    .then(notFound(res))
    .then((cours) => (cours ? cours.remove() : null))
    .then(success(res, 204))
    .catch(next);
