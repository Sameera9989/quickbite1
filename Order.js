import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [{
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    quantity: { type: Number, default: 1 }
  }],
  total_price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'], default: 'pending' },
  delivery_location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  payment: {
    method: { type: String, enum: ['upi', 'card', 'cod'], default: 'upi' },
    txnId: { type: String },
    paidAt: { type: Date }
  }
}, { timestamps: true });

OrderSchema.index({ delivery_location: '2dsphere' });

export default mongoose.model('Order', OrderSchema);
