
import mongoose from 'mongoose';

const UserDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: '',
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    // Bunny Stream specific fields
    semester: {
      type: String,
    },
    vjudge: {
      type: String,
    },
    codeforces: {
      type: String,
    },
    clist: {
      type: Number,
    },
    atcoder: {
      type: Number,
    },
    codechef: {
      type: Number,
    },
    createdAt: {
    type: Date,
    default: Date.now,
  },
  },
  {
    timestamps: true,
  },
);

const UserDetails = mongoose.models.UserDetails || mongoose.model('UserDetails', UserDetailsSchema);
export default UserDetails;