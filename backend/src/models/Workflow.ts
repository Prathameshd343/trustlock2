import mongoose from 'mongoose';

const workflowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  triggerEvent: { 
    type: String, 
    enum: ['FILE_UPLOADED', 'FILE_DOWNLOADED', 'SHARE_LINK_CREATED'], 
    required: true 
  },
  action: {
    type: String,
    enum: ['REQUIRE_APPROVAL', 'NOTIFY_ADMIN', 'AUTO_TAG'],
    required: true
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Workflow', workflowSchema);
