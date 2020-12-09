import mongoose, { Schema } from "mongoose";

const systemConfigSchema = new Schema(
  {
    key: {
      type: String,
    },
    description: {
      type: String,
    },
    value: {
      type: String,
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

systemConfigSchema.methods = {
  view(full) {
    const view = {
      // simple view
      _id: this.id,
      key: this.key,
      description: this.description,
      value: this.value,
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

const model = mongoose.model("SystemConfig", systemConfigSchema);

export const schema = model.schema;
export default model;
