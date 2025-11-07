import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/auth'
import { Moon, Sun, ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import useCart from '../stores/cart'

export default function Navbar() {
  const { user, logout, token } = useAuthStore()
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)
  const cart = useCart()

  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="text-xl font-bold text-primary">QuickBite</Link>
        <div className="ml-auto flex items-center gap-3">
          <button onClick={() => setDark((d) => !d)} className="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
            {dark ? <Sun size={18}/> : <Moon size={18}/>}    
          </button>
          <button onClick={() => navigate('/checkout')} className="relative p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <ShoppingCart size={18} />
            {cart.items.length > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-primary text-white rounded-full h-5 w-5 grid place-items-center">{cart.items.length}</span>
            )}
          </button>
          {token ? (
            <>
              <span className="text-sm">Hi, {user?.name || 'User'}</span>
              <button onClick={() => { logout(); navigate('/login') }} className="px-3 py-1.5 rounded bg-primary text-white">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1.5 rounded border">Login</Link>
              <Link to="/signup" className="px-3 py-1.5 rounded bg-primary text-white">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
