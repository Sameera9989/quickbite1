import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quickbite';
  mongoose.set('strictQuery', true);
  const opts = { dbName: 'quickbite' };
  if (process.env.MONGO_TLS_INSECURE === 'true') {
    opts.tlsAllowInvalidCertificates = true;
    opts.tlsAllowInvalidHostnames = true;
  }
  try {
    await mongoose.connect(uri, opts);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err?.message || err);
    throw err;
  }
};
