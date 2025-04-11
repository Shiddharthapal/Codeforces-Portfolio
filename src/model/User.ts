import mongoose from 'mongoose';
import type { Document, Model, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
}

interface IUserModel extends Model<User> {
  build(attrs: { name: string; email: string; password: string }): User;
}

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password in queries
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (this: User, next: (err?: CallbackError) => void) {
  if (!this.isModified('password')) {
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
      next(new mongoose.Error('An error occurred while hashing the password'));
    }
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (
  this: User,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function (this: User): string {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET || 'your-jwt-secret',
    {
      expiresIn: '24h', // Token expires in 15 minutes
    }
  );
};

// Generate Refresh token
userSchema.methods.generateRefreshToken = function (this: User): string {
  return jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret',
    {
      expiresIn: '7d', // Refresh token expires in 7 days
    }
  );
};

// Static method to build a new user
userSchema.statics.build = (attrs: { name: string; email: string; password: string }): User => {
  return new User(attrs);
};

// Don't save password in its plain text form
userSchema.set('toJSON', {
  transform: function (_doc: Document, ret: Record<string, any>) {
    delete ret.password;
    return ret;
  },
});

export const User = (mongoose.models.User || mongoose.model<User, IUserModel>('User', userSchema)) as IUserModel;

export default User;