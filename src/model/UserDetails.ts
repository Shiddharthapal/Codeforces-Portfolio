import mongoose from "mongoose";

const UserDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    department: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      default: "",
      required: true,
    },

    username: {
      type: String,
      default: "",
    },

    codeforces: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add pre-save middleware to ensure string conversion
UserDetailsSchema.pre("save", function (next) {
  if (this.codeforces !== undefined) this.codeforces = String(this.codeforces);
  next();
});

const UserDetails =
  mongoose.models.UserDetails ||
  mongoose.model("UserDetails", UserDetailsSchema);
export default UserDetails;
