import useCart from '../stores/cart'
import useAuth from '../stores/auth'
import api from '../services/api'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PaymentSection from '../components/PaymentSection'
import IssueModal from '../components/IssueModal'
import { toast } from 'react-hot-toast'

export default function CartCheckout() {
  const cart = useCart()
  const auth = useAuth()
  const [order, setOrder] = useState(null)
  const [issueOpen, setIssueOpen] = useState(false)
  const navigate = useNavigate()

  const placeOrder = async () => {
    if (cart.items.length === 0) return
    const payload = {
      restaurant: cart.restaurant._id,
      items: cart.items.map((i) => ({ item: i.item._id, quantity: i.qty })),
      total_price: cart.total(),
      delivery_location: { type: 'Point', coordinates: [77.6, 12.97] }
    }
    const { data } = await api.post('/orders', payload)
    setOrder(data)
    toast.success('Order created, complete payment')
  }

  const onPaid = (paidOrder) => {
    cart.clear()
    navigate(`/track/${paidOrder._id}`)
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-3">
        <div className="text-xl font-bold">Your Cart</div>
        {cart.items.length === 0 && (
          <div className="text-sm text-zinc-600">No items. Add something tasty!</div>
        )}
        {cart.items.map((i) => (
          <div key={i.item._id} className="flex items-center justify-between rounded border p-3 bg-white dark:bg-zinc-900">
            <div>
              <div className="font-medium">{i.item.name}</div>
              <div className="text-sm text-zinc-500">₹{i.item.price}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-2 border" onClick={() => cart.dec(i.item._id)}>-</button>
              <span>{i.qty}</span>
              <button className="px-2 border" onClick={() => cart.inc(i.item._id)}>+</button>
              <button className="px-3 py-1.5 rounded border" onClick={() => cart.remove(i.item._id)}>Remove</button>
            </div>
          </div>
        ))}
        {cart.items.length > 0 && (
          <button onClick={placeOrder} className="px-4 py-2 rounded bg-primary text-white">Place Order</button>
        )}
      </div>
      <div className="space-y-3">
        <div className="rounded border p-4 bg-white dark:bg-zinc-900">
          <div className="font-semibold mb-2">Summary</div>
          <div className="flex justify-between"><span>Total</span><span>₹{cart.total()}</span></div>
        </div>
        {order && (
          <PaymentSection orderId={order._id} onPaid={onPaid} />
        )}
        {order && (
          <button onClick={() => setIssueOpen(true)} className="px-3 py-2 rounded border w-full">Report Issue</button>
        )}
      </div>

      <IssueModal orderId={order?._id} open={issueOpen} onClose={() => setIssueOpen(false)} />
    </div>
  )
}
