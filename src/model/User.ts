import mongoose from "mongoose";
import type { Document, Model, CallbackError } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface User extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  authProvider?: "local" | "google";
  googleId?: string | null;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

interface UserModel extends Model<User> {
  build(attrs: { email: string; password: string }): User;
}

const userSchema = new mongoose.Schema<User>(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre(
  "save",
  async function (this: User, next: (err?: CallbackError) => void) {
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

// Method to compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function (this: User): string {
  return jwt.sign(
    { id: this._id },
    import.meta.env.JWT_SECRET || "your-jwt-secret",
    {
      expiresIn: "24h", // Token expires in 15 minutes
    }
  );
};

// Static method to build a new user
userSchema.statics.build = (attrs: {
  email: string;
  password: string;
}): User => {
  return new User(attrs);
};

// Don't save password in its plain text form
userSchema.set("toJSON", {
  transform: function (_doc: Document, ret: Record<string, any>) {
    delete ret.password;
    return ret;
  },
});

export const User = (mongoose.models.User ||
  mongoose.model<User, UserModel>("User", userSchema)) as UserModel;

export default User;
