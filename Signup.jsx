import { useState } from 'react'
import useAuth from '../stores/auth'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState('')
  const auth = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      await auth.signup({ name, email, password, address, location: { type: 'Point', coordinates: [77.6, 12.97] } })
      toast.success('Account created')
      navigate('/')
    } catch (_) { toast.error('Signup failed') }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-zinc-900 p-6 rounded border">
      <div className="text-xl font-bold mb-4">Sign up</div>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Full Name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" className="w-full border rounded p-2" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Address" value={address} onChange={(e)=>setAddress(e.target.value)} />
        <button className="w-full bg-primary text-white rounded py-2">Create Account</button>
      </form>
      <div className="text-sm mt-3">Have an account? <Link className="text-primary" to="/login">Login</Link></div>
    </div>
  )
}
