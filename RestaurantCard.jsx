import { Link } from 'react-router-dom'

export default function RestaurantCard({ r, highlight }) {
  const renderHighlight = (text) => {
    if (!highlight) return text
    const q = String(highlight).trim()
    if (!q) return text
    const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'))
    return parts.map((p, i) => (
      p.toLowerCase() === q.toLowerCase()
        ? <span key={i} className="text-black dark:text-white font-semibold">{p}</span>
        : <span key={i}>{p}</span>
    ))
  }
  const onErr = (e) => { e.currentTarget.src = 'https://placehold.co/600x400?text=Restaurant' }
  const restaurantImageOverride = {
    // North Indian (first 4 names as per seed order)
    'Saffron Sultans': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/0e/fa/dc/getlstd-property-photo.jpg',
    'Royal Tandoor': 'https://www.tripsavvy.com/thmb/ExSYCCBtIlD8FyLIYdP4WJWXGmU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/01Bukhara_Snapseed-5adae2cec064710038d528a4.jpg',
    'Masala Monarchs': 'https://b.zmtcdn.com/data/pictures/7/18241537/b602d131899e4c2124b20a95909855f5_featured_v2.jpg',
    'Punjab Pantry': 'https://b.zmtcdn.com/data/collections/546f03a7893e30418da86f8994ec203b_1723649831.png',
    // Mexican (first 4 names as per seed order)
    'Casa Caliente': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSojqjE-FzZBmlPjkhByd49LHE5DC_1Ls1IsQ&s',
    'Aztec Ember': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD3ZlFAenC-fJ_rGP27Uyjvte_23dBZFw1sQ&s',
    'Frida’s Fuego': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/v1699013269/9ee28f19834d8f8d46e8159328178a08.jpg',
    'Luna & Limes': 'https://artemisgrill.com.sg/wp-content/uploads/sites/3/2024/11/Christmas-Artemis-Homepage-10-1-1024x576.jpg',
    // South Indian (first 4 names as per seed order)
    'Dosa Dynasty': 'https://www.sloshout.com/blog/wp-content/uploads/efc499af827cd27f69c0d2bf7fd59b59_featured_v2-1-1-1.jpg',
    'Coconut Courtyard': 'https://imgmediagumlet.lbb.in/media/2025/04/67f4d87e6cce431afc6656c9_1744099454910.jpg',
    'Udupi Utopia': 'https://www.myyellowplate.com/wp-content/uploads/2021/10/Zambar-South-Indian-Restaurants-in-Gurgaon.jpg',
    'Chettinad Chronicles': 'https://lh3.googleusercontent.com/O0nhx1Sx4SjmvvUS2HKq099uDizysE-RFsA6fvShsNaSt_cQestcoB2XMNDNFjUzgxfgmPoFzPta_swoOqWYD7L7Pw=w360-rw',
    // American (first 4 names as per seed order)
    'Liberty Grillhouse': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5SYTqCmki5Gp2-vBVJ0xB2OGyMIoyNcK3eQ&s',
    'Route 66 Smoke & Diner': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi2C5Lij42ab5TFSMbuzwHz6X8pK9IGopCsg&s',
    'Brooklyn Belly': 'https://people.com/thmb/pLuGwP8F0LMSAfcAelIH51IVun8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(329x0:331x2)/most-view-9-660-e733afb5c83145a49d7c2bb820f51501.jpg',
    'Patriot Pit BBQ': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3mUQjEzXp3YSdRy-4DM34Iq1XD5Y6QpCjCA&s',
    // Asian (first 4 names as per seed order)
    'Lotus Lantern': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY78yJnY3SqnMIxTSRf5JCPFoAA3MiQQoEAA&s',
    'Tiger Wok': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJKvwuxoPAIuLh2QlZaBPUOtIO1lp15yUoVw&s',
    'Bamboo Bowl': 'https://media.timeout.com/images/106195371/750/562/image.jpg',
    'Wok & Waves': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/a9/64/32/asia-restaurant-buffet.jpg?w=900&h=500&s=1',
    // Chinese (first 4 names as per seed order)
    'Red Dragon Wok': 'https://images.chinahighlights.com/allpicture/2020/10/6cb881f34a194081b34548e3_cut_800x500_9.jpg',
    'Golden Panda Pavilion': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRZ6RLpe3qXHBaXnGNEsgSFotN2oVbC5IZxw&s',
    'Silk Lantern Kitchen': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/5f/32/8a/new-micasa.jpg',
    'Sichuan Spark': 'https://etimg.etb2bimg.com/photo/117950271.cms',
    // Japanese (first 4 names as per seed order)
    'Sakura Harbor': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4shFZU7vR2G0vLT_i0dbY1q-tnHnfge7zmw&s',
    'Izakaya Iki': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJse9FTo434C2v3ot-m796EIo8NXslrvKvg&s',
    'Zen Maki Bar': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMgWGmDJskR3YAQUpZUOuy-pkgJvv_GqIhmw&s',
    'Nori Nook': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjntAYG5ZDZ2tJAIHbrxRarPf6kLy6vkQwDw&s',
  }
  const cuisineImageOverride = {
    'North Indian': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/0e/fa/dc/getlstd-property-photo.jpg'
  }
  const preferredImage = (() => {
    // Highest precedence: explicit restaurant override by name
    if (restaurantImageOverride[r.name]) return restaurantImageOverride[r.name]
    const cuisines = r.cuisines || []
    for (const c of cuisines) {
      if (cuisineImageOverride[c]) return cuisineImageOverride[c]
    }
    return r.image || 'https://picsum.photos/seed/restaurant-default/1200/800'
  })()
  return (
    <Link to={`/restaurant/${r._id}`} className="rounded overflow-hidden shadow bg-white dark:bg-zinc-900 hover:shadow-md transition">
      <img src={preferredImage} onError={onErr} alt={r.name} className="h-36 w-full object-cover"/>
      <div className="p-3">
        <div className="font-semibold">{renderHighlight(r.name)}</div>
        <div className="text-sm text-zinc-600 dark:text-zinc-300">{renderHighlight(r.cuisines?.join(', ') || '')}</div>
        <div className="text-sm mt-1 text-zinc-700 dark:text-zinc-200">⭐ {r.rating} • {r.distance} km</div>
        <div className="text-xs text-zinc-600 dark:text-zinc-400">{r.address}</div>
      </div>
    </Link>
  )
}
