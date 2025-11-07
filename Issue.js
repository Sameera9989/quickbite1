import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' }
}, { timestamps: true });

export default mongoose.model('Issue', IssueSchema);
