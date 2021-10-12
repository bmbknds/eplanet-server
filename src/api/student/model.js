import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
  {
    studentName: {
      type: String,
    },
    age: {
      type: String,
    },
    skype: {
      type: String,
    },
    avatar: {
      type: String,
    },
    nickName: {
      type: String,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

studentSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      parentId: this.parentId,
      studentName: this.studentName,
      age: this.age,
      skype: this.skype,
      avatar: this.avatar,
      nickname: this.nickName,
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

const model = mongoose.model("Student", studentSchema);

export const schema = model.schema;
export default model;
