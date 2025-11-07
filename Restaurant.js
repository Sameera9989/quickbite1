import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  distance: { type: Number, default: 0 },
  cuisines: [{ type: String, required: true }],
  rating: { type: Number, default: 4.2 },
  image: { type: String }
}, { timestamps: true });

RestaurantSchema.index({ location: '2dsphere' });

export default mongoose.model('Restaurant', RestaurantSchema);
