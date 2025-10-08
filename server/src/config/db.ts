import mongoose from "mongoose";

const connectDB = async (): Promise<boolean> => {
  const uri = process.env.MONGO_URI!;
  if (!uri) {
    console.error("MONGO_URI is not defined in environment variables.");
  };

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1000 * 10, // timeout to connect database: 10s
    });
    const { host, port, name } = mongoose.connection;
    console.log(`MongoDB connected: ${host}:${port}/${name}`);
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to connect to MongoDB: ", error.message);
    } else {
      console.error("Failed to connect to MongoDB: ", error);
    }
  }
  return false;
};

export default connectDB;