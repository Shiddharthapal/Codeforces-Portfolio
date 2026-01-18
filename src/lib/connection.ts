import mongoose from "mongoose";

let isConnected = false;

const connect = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const MONGODB_URI =
      import.meta.env.MONGODB_URI || import.meta.env.PUBLIC_MONGODB_URI || "mongodb+srv://pal351069:shiddhartha29rikta@cluster0.qcjbn.mongodb.net/contestracker";

    if (!MONGODB_URI) {
      throw new Error(
        "MONGODB_URI environment variable is not defined. " +
          "Please set it in your .env file as PUBLIC_MONGODB_URI or MONGODB_URI"
      );
    }

    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
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

export default connect;
