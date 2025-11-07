import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import CuisineRestaurants from './pages/CuisineRestaurants.jsx'
import RestaurantMenu from './pages/RestaurantMenu.jsx'
import CartCheckout from './pages/CartCheckout.jsx'
import OrderTracking from './pages/OrderTracking.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import useAuthStore from './stores/auth.js'
import { Toaster } from 'react-hot-toast'

function Protected({ children }) {
  const token = useAuthStore((s) => s.token)
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cuisine/:name" element={<CuisineRestaurants />} />
          <Route path="/restaurant/:id" element={<RestaurantMenu />} />
          <Route path="/checkout" element={<Protected><CartCheckout /></Protected>} />
          <Route path="/track/:orderId" element={<Protected><OrderTracking /></Protected>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
      <Toaster position="top-right" />
      <Footer />
    </div>
  )
}
