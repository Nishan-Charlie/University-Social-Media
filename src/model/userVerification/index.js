import mongoose from "mongoose";

const UserVerificationSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    uniqString: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const UserVerificationModel = mongoose.model(
  "UsersVerification",
  UserVerificationSchema
);
export default UserVerificationModel;
