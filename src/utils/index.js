import Cours from "../api/cours/model";
import Order from "../api/order/model";
const models = {
  Cours: Cours,
  Order: Order,
};
export const checkInUse = async (
  collections = [],
  value = null,
  extraConditions = null
) => {
  //   console.log("util", collections);

  for (let index = 0; index < collections.length; index++) {
    const element = collections[index];
    const filter = {};
    element.fields.forEach((field) => {
      filter[field.name] = field.value;
    });
    const existed = await models[element.name].findOne(filter);
    if (existed) {
      return true;
    }
  }
  //   const result = await collections.forEach(async (item) => {
  //     const filter = {};
  //   item.fields.forEach((field) => {
  //       filter[field.name] = field.value;
  //     });
  //     // filter[item.field] = value;
  //     const existed = await models[item.name].findOne(filter);
  //     console.log(existed);
  //     if (existed) {
  //       return true;
  //     }
  //   });
  //   console.log(result, "util");
  return false;
};
