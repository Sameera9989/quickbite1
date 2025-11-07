import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }]
}, { timestamps: true });

UserSchema.index({ location: '2dsphere' });

export default mongoose.model('User', UserSchema);
