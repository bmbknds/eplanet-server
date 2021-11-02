import { any } from "bluebird";
import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    studentId: {
      type: String,
      required: true,
    },
    parentId: {
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
    courseId: {
      type: String,
      required: true,
    },
    courseDetail: {
      type: Object,
      required: true,
    },
    // price: {
    //   type: Number,
    //   required: true,
    // },
    startDate: {
      type: Date,
      default: new Date(),
      required: true,
    },

    records: {
      type: Array,
    },
    status: {
      type: String,
      enum: ["deleted", "pending", "active", "cancel", "done"],
      default: "pending",
    },
    learnTrial: {
      type: Boolean,
      default: false,
    },
    inviteCode: {
      type: String,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    finalReport: {
      type: Array,
    },
    originOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
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
      parentId: this.parentId,
      teacherId: this.teacherId,
      timeTable: this.timeTable,
      courseId: this.courseId,
      records: this.records,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      finalReport: this.finalReport,
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
orderSchema.virtual("parent", {
  ref: "User",
  localField: "parentId",
  foreignField: "_id",
  justOne: true,
});
orderSchema.virtual("student", {
  ref: "Student",
  localField: "studentId",
  foreignField: "_id",
  justOne: true,
});
orderSchema.virtual("teacher", {
  ref: "User",
  localField: "teacherId",
  foreignField: "_id",
  justOne: true,
});
orderSchema.virtual("course", {
  ref: "Course",
  localField: "courseId",
  foreignField: "_id",
  justOne: true,
});
const model = mongoose.model("Order", orderSchema);

export const schema = model.schema;
export default model;
