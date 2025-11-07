import { useState } from 'react'
import api from '../services/api'
import { toast } from 'react-hot-toast'

export default function IssueModal({ orderId, open, onClose }) {
  const [text, setText] = useState('')
  if (!open) return null
  const submit = async () => {
    if (!text.trim()) return
    await api.post('/issues', { order: orderId, description: text })
    toast.success('Issue reported')
    setText('')
    onClose?.()
  }
  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center p-4 z-50">
      <div className="bg-white dark:bg-zinc-900 rounded p-4 w-full max-w-md">
        <div className="font-semibold mb-2">Report an Issue</div>
        <textarea value={text} onChange={(e)=>setText(e.target.value)} rows={4} className="w-full rounded border p-2" placeholder="Describe the problem (damaged/misplaced food etc.)" />
        <div className="mt-3 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded border">Cancel</button>
          <button onClick={submit} className="px-3 py-1.5 rounded bg-primary text-white">Submit</button>
        </div>
      </div>
    </div>
  )
}
