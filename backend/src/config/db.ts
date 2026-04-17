import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export const connectDB = async () => {
  try {
    let uri;
    if (process.env.MONGO_URI) {
      uri = process.env.MONGO_URI;
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Connected (Persistent): ${conn.connection.host}`);
    } else {
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Connected (Memory Server): ${conn.connection.host}`);
    }
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
