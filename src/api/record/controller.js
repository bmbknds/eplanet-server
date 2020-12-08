import { success, notFound } from '../../services/response/'
import { Record } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Record.create(body)
    .then((record) => record.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Record.count(query)
    .then(count => Record.find(query, select, cursor)
      .then((records) => ({
        count,
        rows: records.map((record) => record.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Record.findById(params.id)
    .then(notFound(res))
    .then((record) => record ? record.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Record.findById(params.id)
    .then(notFound(res))
    .then((record) => record ? Object.assign(record, body).save() : null)
    .then((record) => record ? record.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Record.findById(params.id)
    .then(notFound(res))
    .then((record) => record ? record.remove() : null)
    .then(success(res, 204))
    .catch(next)
