import mongoose from "mongoose";

// Define the match schema
const matchSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  emotion: {
    type: String,
    default: "like",
    enum: ["like", "nope"],
  },
  isMatch: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

// Define the invited schema
const inviteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    default: "Bạn ấy mời bạn",
  },
  isAccept: {
    type: String,
    enum: ["waiting", "deny", "accept"],
    default: "waiting",
  },
  dateInvite: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const paymentLinkIdSchema = new mongoose.Schema({
  id: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, required: true },
  title: { type: String, required: true },
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
  },
  password: { type: String },
  location: {
    lat: { type: Number },
    long: { type: Number },
    commune: { type: String },
    county: { type: String },
    province: { type: String },
    country: { type: String },
    fullAddress: { type: String },
  },
  profileComplete: { type: Number },
  info: {
    name: { type: String },
    age: { type: Number, min: 18, max: 100 },
    gender: { type: String },
    bio: { type: String },
    imgs: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    height: { type: Number },
    unitHeight: { type: String },
    title: { type: String },
    company: { type: String },
    university: { type: String },
    hobbies: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    zodiac: { type: String },
    academicLevel: { type: String },
    baby: { type: String },
    character: { type: [String], default: [] },
    comStyle: { type: [String], default: [] },
    loveLanguage: { type: [String], default: [] },
    pet: { type: String },
    alcohol: { type: String },
    exercise: { type: String },
    diet: { type: String },
    socialMedia: { type: [String], default: [] },
    sleep: { type: String },
  },
  filter: {
    genderFind: { type: String, default: "" },
    sexualOrientation: { type: String, default: "" },
    searchingFor: { type: [String], default: [] },
    distanceRange: { type: Number, default: 18 },
    ageRange: { type: [Number], default: [] },
    showOnlyInDistanceRange: { type: Boolean, default: false },
    showOnlyInAgeRange: { type: Boolean, default: false },
    globalSearch: { type: Boolean, default: false },
    education: { type: String, default: "" },
  },
  matches: { type: [matchSchema], default: [] },
  likesReceived: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  invitedSend: { type: [inviteSchema], default: [] },
  invitedReceived: { type: [inviteSchema], default: [] },
}, { timestamps: true });

const User = mongoose.models?.User || mongoose.model("User", userSchema);

export default User;
