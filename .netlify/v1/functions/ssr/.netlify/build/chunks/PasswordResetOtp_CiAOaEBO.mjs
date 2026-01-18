import mongoose from 'mongoose';

const passwordResetOtpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    otpHash: {
      type: String,
      required: true,
      unique: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }
    },
    usedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);
const PasswordResetOtp = mongoose.models.PasswordResetOtp || mongoose.model(
  "PasswordResetOtp",
  passwordResetOtpSchema
);

export { PasswordResetOtp as P };
