import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema(
  {
    name: {
      type: String,
    },
    title: {
      type: String,
    },
    introText: {
      type: String,
    },
    introImage: {
      type: String,
    },
    targetText: {
      type: String,
    },
    targetImage: {
      type: String,
    },
    activeTime: {
      type: Date,
    },
    price: {
      type: Number,
    },
    lessons: {
      type: Number,
    },
    status: {
      type: String,
      default: "active",
    },
    documents: [
      {
        name: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
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

courseSchema.methods = {
  view(full) {
    const view = {
      // simple view
      _id: this.id,
      name: this.name,
      title: this.title,
      introText: this.introText,
      introImage: this.introImage,
      targetText: this.targetText,
      targetImage: this.targetImage,
      activeTime: this.activeTime,
      price: this.price,
      lessons: this.lessons,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      documents: this.documents,
    };
    return view;
  },
};

const model = mongoose.model("Course", courseSchema);

export const schema = model.schema;
export default model;
