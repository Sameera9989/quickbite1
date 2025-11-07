import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  ingredients: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('MenuItem', MenuItemSchema);
