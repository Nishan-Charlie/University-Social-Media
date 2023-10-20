import mongoose from "mongoose";

const PasswordResetSchema = mongoose.Schema(
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

const PasswordResetModel = mongoose.model("PasswordReset", PasswordResetSchema);
export default PasswordResetModel;
