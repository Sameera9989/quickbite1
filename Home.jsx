import SearchBar from '../components/SearchBar'
import CuisineGrid from '../components/CuisineGrid'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  const onSearch = (q) => {
    if (!q) return
    navigate(`/cuisine/${encodeURIComponent(q)}`)
  }
  return (
    <div className="space-y-6">
      <section className="rounded-xl overflow-hidden bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="p-6 md:p-10 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="text-3xl md:text-4xl font-extrabold leading-tight">Fast. Fresh. At your Door.</div>
            <p className="mt-2 text-white/90 text-sm md:text-base">Order from top-rated restaurants nearby and track your delivery live.</p>
            <div className="mt-4 max-w-xl"><SearchBar onSearch={onSearch} /></div>
          </div>
          <img className="w-40 md:w-56 drop-shadow-lg" src="https://thumbs.dreamstime.com/b/unhealthy-fast-food-delivery-menu-featuring-assorted-burgers-cheeseburgers-nuggets-french-fries-soda-high-calorie-low-356045884.jpg" alt="Hero"/>
        </div>
      </section>

      <section>
        <div className="text-lg font-semibold mb-3">Popular Cuisines</div>
        <CuisineGrid />
      </section>

      <section>
        <div className="text-lg font-semibold mb-3">Offers for you</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["FLAT50","WELCOME100","FREEDLV","QUICK20"].map((c)=> (
            <div key={c} className="rounded-lg p-4 bg-white dark:bg-zinc-900 border text-center">
              <div className="text-sm text-zinc-600">Use code</div>
              <div className="font-bold">{c}</div>
              <div className="text-xs text-zinc-500">T&amp;C apply</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
