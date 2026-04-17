import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  billingLimit: { type: Number, default: 10 * 1024 * 1024 * 1024 }, // 10GB default
  usedStorage: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Organization', organizationSchema);
