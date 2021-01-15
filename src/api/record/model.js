import { any } from "bluebird";
import mongoose, { Schema } from "mongoose";

const recordSchema = new Schema(
  {
    status: {
      type: Number,
    },
    recordDate: {
      type: Number,
      required: true,
    },
    timeTable: {
      type: Object,
      require: true,
    },
    type: {
      type: String,
      enum: ["Normal", "Bonus"],
      default: "Normal",
    },
    studentComment: {
      type: Object,
    },
    teacherComment: {
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
    logs: {
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

recordSchema.methods = {
  view(full) {
    const view = {
      // simple view
      _id: this.id,
      status: this.status,
      studentComment: this.studentComment,
      teacherComment: this.teacherComment,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      timeTable: this.timeTable,
      recordDate: this.recordDate,
      student: this.student,
    };

    return full
      ? {
          ...view,

          // add properties for a full view
        }
      : view;
  },
};
recordSchema.virtual("student", {
  ref: "User",
  localField: "studentId",
  foreignField: "_id",
  justOne: true,
});
recordSchema.index({ teacherId: 1, studentId: 1, coursId: 1, orderId: 1 });
const model = mongoose.model("Record", recordSchema);

export const schema = model.schema;
export default model;
