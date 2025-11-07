import api from '../services/api'
import useCart from '../stores/cart'
import { useState } from 'react'
import { QrCode } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function PaymentSection({ orderId, onPaid }) {
  const cart = useCart()
  const [method, setMethod] = useState('upi')
  const upiId = 'quickbite@upi'
  const amount = cart.total()

  const confirm = async () => {
    const { data } = await api.post('/payment/confirm', { orderId, method })
    toast.success('Payment confirmed')
    onPaid?.(data.order)
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent('upi://pay?pa=' + upiId + '&am=' + amount)}`

  return (
    <div className="rounded border p-4 bg-white dark:bg-zinc-900">
      <div className="font-semibold mb-2">Payment</div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2"><input type="radio" name="method" checked={method==='upi'} onChange={() => setMethod('upi')} /> UPI / QR</label>
        <label className="flex items-center gap-2"><input type="radio" name="method" checked={method==='card'} onChange={() => setMethod('card')} /> Test Card</label>
        <label className="flex items-center gap-2"><input type="radio" name="method" checked={method==='cod'} onChange={() => setMethod('cod')} /> Cash on Delivery</label>
      </div>

      {method === 'upi' && (
        <div className="mt-4 flex items-center gap-6">
          <img src={qrUrl} alt="UPI QR" className="rounded border" />
          <div>
            <div className="text-sm text-zinc-600">UPI ID</div>
            <div className="font-mono text-lg">{upiId}</div>
            <div className="mt-2 flex items-center gap-2 text-zinc-600"><QrCode size={16}/> Scan to pay ₹{amount}</div>
          </div>
        </div>
      )}

      {method === 'card' && (
        <div className="mt-4 text-sm text-zinc-600">Use test card 4242 4242 4242 4242, any future date, any CVC</div>
      )}

      <button onClick={confirm} className="mt-4 px-3 py-2 rounded bg-accent text-white">Confirm Payment</button>
    </div>
  )
}
