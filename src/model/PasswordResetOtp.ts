import mongoose from "mongoose";
import type { Document, Model } from "mongoose";

export interface IPasswordResetOtp extends Document {
  userId: mongoose.Types.ObjectId;
  otpHash: string;
  expiresAt: Date;
  usedAt?: Date | null;
}

interface IPasswordResetOtpModel extends Model<IPasswordResetOtp> {}

const passwordResetOtpSchema = new mongoose.Schema<IPasswordResetOtp>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    otpHash: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const PasswordResetOtp =
  (mongoose.models.PasswordResetOtp ||
    mongoose.model<IPasswordResetOtp, IPasswordResetOtpModel>(
      "PasswordResetOtp",
      passwordResetOtpSchema
    )) as IPasswordResetOtpModel;

export default PasswordResetOtp;
