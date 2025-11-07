import { useState } from 'react'
import useAuth from '../stores/auth'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import api from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const auth = useAuth()
  const setAuth = useAuth((s) => s.setAuth)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      await auth.login(email, password)
      toast.success('Logged in')
      navigate('/')
    } catch (_) { toast.error('Login failed') }
  }

  const quick = async () => {
    try {
      if (!email) return toast.error('Enter any email to quick login')
      const { data } = await api.post('/auth/quick', { email, name: email.split('@')[0] })
      setAuth(data.user, data.token)
      toast.success('Quick login successful')
      navigate('/')
    } catch (_) { toast.error('Quick login failed') }
  }

  const demo = async () => {
    try {
      const { data } = await api.post('/auth/demo')
      setAuth(data.user, data.token)
      toast.success('Logged in as Demo User')
      navigate('/')
    } catch (_) { toast.error('Demo login failed') }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-zinc-900 p-6 rounded border mt-8 md:mt-12">
      <div className="text-xl font-bold mb-4">Login</div>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" className="w-full border rounded p-2" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="w-full bg-primary text-white rounded py-2">Login</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
        <button onClick={demo} className="w-full border rounded py-2">Demo Login</button>
        <button onClick={quick} className="w-full border rounded py-2">Quick Login with Email</button>
      </div>
      <div className="text-sm mt-3">No account? <Link className="text-primary" to="/signup">Sign up</Link></div>
    </div>
  )
}
