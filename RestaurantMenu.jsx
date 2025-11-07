import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import MenuItemCard from '../components/MenuItemCard'
import IssueModal from '../components/IssueModal'
import { toast } from 'react-hot-toast'

export default function RestaurantMenu() {
  const { id } = useParams()
  const [r, setR] = useState(null)
  const [menu, setMenu] = useState([])
  const [view, setView] = useState(null)
  const [feedback, setFeedback] = useState([])
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [reportOpen, setReportOpen] = useState(false)
  const [reportOrderId, setReportOrderId] = useState(null)
  const [reportItem, setReportItem] = useState(null)
  useEffect(() => {
    const run = async () => {
      const { data: rest } = await api.get(`/restaurants/${id}`)
      setR(rest)
      const { data: items } = await api.get(`/restaurants/${id}/menu`)
      setMenu(items)
      const { data: fb } = await api.get(`/feedback/restaurant/${id}`)
      setFeedback(fb)
    }
    run()
  }, [id])

  const submitFeedback = async () => {
    const payload = { restaurant: id, rating: Number(rating), review }
    await api.post('/feedback', payload)
    setReview('')
    const { data: fb } = await api.get(`/feedback/restaurant/${id}`)
    setFeedback(fb)
  }
  return (
    <div className="space-y-4">
      {r && (
        <div className="rounded overflow-hidden bg-white dark:bg-zinc-900">
          <div className="h-32 md:h-40 bg-gradient-to-r from-orange-400 to-red-500" />
          <div className="p-4">
            <div className="text-xl font-bold">{r.name}</div>
            <div className="text-sm text-zinc-500">{r.address} • {r.cuisines?.join(', ')} • ⭐ {r.rating}</div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menu.map((m) => <MenuItemCard key={m._id} item={m} restaurant={r} onView={setView} onReport={async (item) => {
          try {
            // fetch user orders and locate the latest for this restaurant
            const { data: orders } = await api.get('/orders')
            const latest = orders.find((o) => o.restaurant?._id === id) || null
            if (!latest) {
              toast.error('No recent order found for this restaurant. Place an order first.')
              return
            }
            setReportOrderId(latest._id)
            setReportItem(item)
            setReportOpen(true)
          } catch (_) { toast.error('Login required to report an issue') }
        }} />)}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 rounded border p-4 bg-white dark:bg-zinc-900">
          <div className="font-semibold mb-2">What people say</div>
          {feedback.length === 0 && <div className="text-sm text-zinc-500">No reviews yet.</div>}
          <div className="space-y-3">
            {feedback.map((f) => (
              <div key={f._id} className="border rounded p-3">
                <div className="text-sm font-medium">{f.user?.name || 'User'} • ⭐ {f.rating}</div>
                <div className="text-sm text-zinc-600">{f.review}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2 rounded border p-4 bg-white dark:bg-zinc-900">
          <div className="font-semibold">Rate this restaurant</div>
          <select value={rating} onChange={(e)=>setRating(e.target.value)} className="w-full border rounded p-2">
            {[5,4,3,2,1].map((n)=> <option key={n} value={n}>{n} Stars</option>)}
          </select>
          <textarea value={review} onChange={(e)=>setReview(e.target.value)} rows={4} className="w-full border rounded p-2" placeholder="Share your experience" />
          <button onClick={submitFeedback} className="w-full rounded bg-primary text-white py-2">Submit</button>
          <div className="text-xs text-zinc-500">Requires login; use Demo or Quick login if needed.</div>
        </div>
      </div>

      {view && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded p-4 w-full max-w-md">
            <div className="font-semibold mb-2">{view.name} - Ingredients</div>
            <ul className="list-disc pl-5 text-sm text-zinc-700">
              {view.ingredients?.map((ing, idx) => <li key={idx}>{ing}</li>)}
            </ul>
            <div className="mt-4 text-right">
              <button onClick={() => setView(null)} className="px-3 py-1.5 rounded bg-primary text-white">Close</button>
            </div>
          </div>
        </div>
      )}

      <IssueModal orderId={reportOrderId} open={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  )
}
