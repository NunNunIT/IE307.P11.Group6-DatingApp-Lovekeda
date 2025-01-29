import { ENUM_USER_GENDER } from "@/utils/constants";
import { model, models, Schema } from "mongoose";

const PointSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const UserSchema = new Schema({
  user_id: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  gender: { type: String, enum: ENUM_USER_GENDER, default: ENUM_USER_GENDER.Male },
  age: { type: Number },
  bio: { type: String },
  imgs: { type: [{ type: String }], default: [] },
  locate: { type: PointSchema, index: '2dsphere' },
  location: { type: String },
  hobbies: [{ type: String }],
  is_complete_profile: { type: Boolean, default: false },
  matches: { type: [{ type: String }], default: [] },
  likes: { type: [{ type: String }], default: [] },
}, { strict: false, timestamps: true });

export const User = models?.User ?? model('User', UserSchema);