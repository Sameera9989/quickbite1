import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  review: { type: String }
}, { timestamps: true });

export default mongoose.model('Feedback', FeedbackSchema);
