import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface ICached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: ICached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDb() {
  if (!MONGODB_URI)
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');

  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log("Connected to MongoDB");
  } catch (e) {
    cached.promise = null;
    console.error("Error connecting to MongoDB:", e);
    throw e;
  }

  return cached.conn;
}
