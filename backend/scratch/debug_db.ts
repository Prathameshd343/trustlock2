import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;
console.log('Attempting to connect to:', uri.replace(/:([^@]+)@/, ':****@'));

mongoose.connect(uri)
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB Atlas');
    process.exit(0);
  })
  .catch((err) => {
    console.error('FAILURE: Connection error:');
    console.error(err);
    process.exit(1);
  });
