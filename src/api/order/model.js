import { any } from "bluebird";
import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    studentId: {
      type: String,
      required: true,
    },
    teacherId: {
      type: String,
      required: true,
    },
    timeTable: {
      required: true,
      type: Array,
    },
    coursId: {
      type: String,
      required: true,
    },
    records: {
      type: Array,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (obj, ret) => {
        delete ret._id;
      },
    },
  }
);

orderSchema.methods = {
  view(full) {
    const view = {
      // simple view
      _id: this.id,
      studentId: this.studentId,
      teacherId: this.teacherId,
      timeTable: this.timeTable,
      coursId: this.coursId,
      records: this.records,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };

    return full
      ? {
          ...view,
          // add properties for a full view
        }
      : view;
  },
};
orderSchema.set("collection", "orders");
const model = mongoose.model("Order", orderSchema);

export const schema = model.schema;
export default model;
