import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      require: false,
    },
    email: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: String,
      require: false,
    },
    course: {
      type: String,
      require: false,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    yearOfStudy: {
      type: String,
      require: false,
      default: "",
    },
    specialization: {
      type: String,
      require: false,
      default: "",
    },
    accountType: {
      type: String,
      require: false,
      default: "public",
    },
    emergencyContactNumber: {
      type: String,
      require: false,
    },
    profilePicture: String,
    followers: [
      { type: mongoose.Types.ObjectId, ref: "Users", require: false },
    ],
    following: [
      { type: mongoose.Types.ObjectId, ref: "Users", require: false },
    ],
    followRequests: [
      { type: mongoose.Types.ObjectId, ref: "Users", require: false },
    ],
    savedContents: [
      { type: mongoose.Types.ObjectId, ref: "Contents", require: false },
    ],
    archiveContents: [
      { type: mongoose.Types.ObjectId, ref: "Contents", require: false },
    ],
    isVerified: {
      type: Boolean,
      require: true,
      default: false,
    },
    studentType: {
      type: String,
      require: true,
    },

    studentId: {
      type: String,
      require: false,
    },
    company: {
      type: String,
      require: false,
    },
    designation: {
      type: String,
      require: false,
    },
    experience: {
      type: String,
      require: false,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("Users", UserSchema);
export default UserModel;
