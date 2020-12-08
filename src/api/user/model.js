import crypto from "crypto";
import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
import mongooseKeywords from "mongoose-keywords";
import uniqueValidator from "mongoose-unique-validator";
import { env } from "../../config";

const roles = ["student", "admin", "super-admin", "teacher"];

const userSchema = new Schema(
  {
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,

      index: true,
      trim: true,
    },
    role: {
      type: String,
      enum: roles,
      default: "student",
    },
    picture: {
      type: String,
      trim: true,
    },
    skype: {
      type: String,
      trim: true,
    },

    studentInfor: {
      type: Object,
      default: null,
    },
    teacherInfor: {
      type: Object,
      default: null,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.path("email").set(function (email) {
  // if (!this.picture || this.picture.indexOf("https://gravatar.com") === 0) {
  //   const hash = crypto.createHash("md5").update(email).digest("hex");
  //   this.picture = `https://gravatar.com/avatar/${hash}?d=identicon`;
  // }

  if (!this.name) {
    this.name = email.replace(/^(.+)@.+$/, "$1");
  }

  return email;
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  /* istanbul ignore next */
  const rounds = env === "test" ? 1 : 9;

  bcrypt
    .hash(this.password, rounds)
    .then((hash) => {
      this.password = hash;
      next();
    })
    .catch(next);
});

userSchema.methods = {
  view(full) {
    const view = {};
    let fields = [
      "_id",
      "name",
      "picture",
      "role",
      "studentInfor",
      "teacherInfor",
      "skype",
      "phoneNumber",
      "email",
    ];

    if (full) {
      fields = [...fields, "email", "createdAt"];
    }

    fields.forEach((field) => {
      view[field] = this[field];
    });

    return view;
  },

  authenticate(password) {
    return bcrypt
      .compare(password, this.password)
      .then((valid) => (valid ? this : false));
  },
};

userSchema.statics = {
  roles,
};
userSchema.index({ email: 1, phoneNumber: 1 }, { unique: true });

userSchema.plugin(mongooseKeywords, { paths: ["email", "phoneNumber"] });
userSchema.plugin(uniqueValidator);
const model = mongoose.model("User", userSchema);

export const schema = model.schema;
export default model;
