import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema({
  name: { type: String, required: true },
  keyHash: { type: String, required: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastUsedAt: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('APIKey', apiKeySchema);
