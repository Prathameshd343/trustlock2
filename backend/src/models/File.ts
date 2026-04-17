import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  iv: {
    type: String, // Store IV as base64 string
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
  status: {
    type: String,
    enum: ['active', 'pending_approval'],
    default: 'active'
  }
}, {
  timestamps: true,
});

const File = mongoose.model('File', fileSchema);
export default File;
