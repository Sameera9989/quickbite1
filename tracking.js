import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Returns mock live location of delivery person near midpoint between restaurant and destination
router.get('/:orderId', async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate('restaurant');
  if (!order) return res.status(404).json({ message: 'Order not found' });

  const [restLng, restLat] = order.restaurant.location.coordinates;
  const [destLng, destLat] = order.delivery_location.coordinates;

  const midLng = (restLng + destLng) / 2;
  const midLat = (restLat + destLat) / 2;

  const jitter = () => (Math.random() - 0.5) * 0.01; // small random offset

  res.json({
    orderId: order._id,
    restaurantId: order.restaurant._id,
    status: order.status,
    courier: { type: 'Point', coordinates: [midLng + jitter(), midLat + jitter()] },
    restaurant: order.restaurant.location,
    destination: order.delivery_location,
    etaMinutes: Math.max(5, Math.floor(Math.random() * 20) + 10)
  });
});

export default router;
