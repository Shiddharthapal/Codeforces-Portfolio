import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        "Please provide a valid email"
      ]
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false
      // Don't return password in queries
    }
  },
  {
    timestamps: true
  }
);
userSchema.pre(
  "save",
  async function(next) {
    if (!this.isModified("password")) {
      return next();
    }
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      if (error instanceof Error) {
        next(new mongoose.Error(error.message));
      } else {
        next(
          new mongoose.Error("An error occurred while hashing the password")
        );
      }
    }
  }
);
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET || "your-jwt-secret",
    {
      expiresIn: "24h"
      // Token expires in 15 minutes
    }
  );
};
userSchema.statics.build = (attrs) => {
  return new User(attrs);
};
userSchema.set("toJSON", {
  transform: function(_doc, ret) {
    delete ret.password;
    return ret;
  }
});
const User = mongoose.models.User || mongoose.model("User", userSchema);

export { User as U };
