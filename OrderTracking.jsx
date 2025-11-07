import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import MapTracker from '../components/MapTracker'
import { toast } from 'react-hot-toast'

export default function OrderTracking() {
  const { orderId } = useParams()
  const [data, setData] = useState(null)
  useEffect(() => {
    const run = async () => {
      const { data } = await api.get(`/tracking/${orderId}`)
      setData(data)
    }
    run()
    const it = setInterval(run, 5000)
    return () => clearInterval(it)
  }, [orderId])
  if (!data) return <div>Loading map...</div>

  const markDelivered = async () => {
    await api.put(`/orders/${orderId}/status`, { status: 'delivered' })
    toast.success('Order marked as delivered. You can now leave a review!')
    const { data: fresh } = await api.get(`/tracking/${orderId}`)
    setData(fresh)
  }
  return (
    <div className="space-y-3">
      <div className="text-xl font-bold">Order Tracking</div>
      <MapTracker restaurant={data.restaurant} destination={data.destination} courier={data.courier} />
      <div className="text-sm text-zinc-600">ETA: {data.etaMinutes} minutes</div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="text-sm">Status: <span className="font-medium">{data.status}</span></div>
        <button onClick={markDelivered} className="px-3 py-2 rounded border w-full sm:w-auto">Mark as Delivered</button>
      </div>
    </div>
  )
}
