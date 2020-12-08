import { any } from "bluebird";
import mongoose, { Schema } from "mongoose";

const recordSchema = new Schema(
  {
    status: {
      type: String,
    },
    recordDate: {
      type: Date,
      required: true,
    },
    timeTable: {
      type: Object,
      require: true,
    },
    studentFeedback: {
      type: Object,
    },
    teacherFeedback: {
      type: Object,
    },
    teacherId: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    coursId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
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

recordSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      status: this.status,
      studentFeedback: this.studentFeedback,
      teacherFeedback: this.teacherFeedback,
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
recordSchema.index({ teacherId: 1, studentId: 1, coursId: 1, orderId: 1 });
const model = mongoose.model("Record", recordSchema);

export const schema = model.schema;
export default model;
