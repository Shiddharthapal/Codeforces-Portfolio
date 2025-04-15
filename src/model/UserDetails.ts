
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
    leetcode: {
      type: String,
    },
    atcoder: {
      type: String,
    },
    codechef: {
      type: String,
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

// Add pre-save middleware to ensure string conversion
UserDetailsSchema.pre('save', function(next) {
  // Convert all profile link fields to strings
  if (this.leetcode !== undefined) this.leetcode = String(this.leetcode);
  if (this.atcoder !== undefined) this.atcoder = String(this.atcoder);
  if (this.codechef !== undefined) this.codechef = String(this.codechef);
  if (this.codeforces !== undefined) this.codeforces = String(this.codeforces);
  if (this.vjudge !== undefined) this.vjudge = String(this.vjudge);
  next();
});

const UserDetails = mongoose.models.UserDetails || mongoose.model('UserDetails', UserDetailsSchema);
export default UserDetails;