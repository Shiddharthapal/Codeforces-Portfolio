import mongoose from "mongoose";
import type { Document, Model } from "mongoose";

export interface IPasswordResetToken extends Document {
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date | null;
}

interface IPasswordResetTokenModel extends Model<IPasswordResetToken> {}

const passwordResetTokenSchema = new mongoose.Schema<IPasswordResetToken>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tokenHash: {
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

export const PasswordResetToken =
  (mongoose.models.PasswordResetToken ||
    mongoose.model<IPasswordResetToken, IPasswordResetTokenModel>(
      "PasswordResetToken",
      passwordResetTokenSchema
    )) as IPasswordResetTokenModel;

export default PasswordResetToken;
