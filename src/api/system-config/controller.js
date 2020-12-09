import { success, notFound } from '../../services/response/'
import { SystemConfig } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  SystemConfig.create(body)
    .then((systemConfig) => systemConfig.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  SystemConfig.count(query)
    .then(count => SystemConfig.find(query, select, cursor)
      .then((systemConfigs) => ({
        count,
        rows: systemConfigs.map((systemConfig) => systemConfig.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  SystemConfig.findById(params.id)
    .then(notFound(res))
    .then((systemConfig) => systemConfig ? systemConfig.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  SystemConfig.findById(params.id)
    .then(notFound(res))
    .then((systemConfig) => systemConfig ? Object.assign(systemConfig, body).save() : null)
    .then((systemConfig) => systemConfig ? systemConfig.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  SystemConfig.findById(params.id)
    .then(notFound(res))
    .then((systemConfig) => systemConfig ? systemConfig.remove() : null)
    .then(success(res, 204))
    .catch(next)
