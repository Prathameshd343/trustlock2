import mongoose from 'mongoose';

const shareSchema = new mongoose.Schema({
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sharedWithEmail: {
    type: String, // Optional: if shared via email invitation
  },
  permission: {
    type: String,
    enum: ['view', 'download'],
    default: 'view',
  },
  expiresAt: {
    type: Date,
  },
  password: {
    type: String, // Optional: hashed password for protected links
  },
  shareLinkToken: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

const Share = mongoose.model('Share', shareSchema);
export default Share;
