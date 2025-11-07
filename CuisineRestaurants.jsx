import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import RestaurantCard from '../components/RestaurantCard'

export default function CuisineRestaurants() {
  const { name } = useParams()
  const [list, setList] = useState([])
  useEffect(() => {
    const run = async () => {
      try {
        const cuisine = decodeURIComponent(name || '')
        const { data } = await api.get('/restaurants', { params: { cuisine } })
        setList(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to load restaurants:', err)
        setList([])
      }
    }
    run()
  }, [name])
  return (
    <div className="space-y-4">
      <div className="text-xl font-bold">Restaurants for {decodeURIComponent(name || '')}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((r) => <RestaurantCard key={r._id} r={r} highlight={name} />)}
      </div>
    </div>
  )
}
