import mongoose from 'mongoose';

let isConnected = false;
const connect = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }
  try {
    const MONGODB_URI = "mongodb://localhost:27017/codeforces-portal";
    if (!MONGODB_URI) ;
    const options = {
      serverSelectionTimeoutMS: 5e3
      // Timeout after 5s instead of 30s
    };
    await mongoose.connect(MONGODB_URI, options);
    isConnected = true;
    console.log("New MongoDB connection established");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    isConnected = false;
    if (error instanceof Error) {
      throw new Error(`Failed to connect to MongoDB: ${error.message}`);
    }
    throw new Error("Failed to connect to MongoDB: Unknown error");
  }
};

export { connect as c };
