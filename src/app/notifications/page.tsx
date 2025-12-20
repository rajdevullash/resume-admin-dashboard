'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { notificationAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/AdminLayout'
import { formatDistanceToNow } from 'date-fns'

export default function NotificationsPage() {
  const router = useRouter()
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    imageUrl: '',
    target: 'all'
  })

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchHistory()
  }, [router])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const res = await notificationAPI.getHistory()
      if (res.success) setHistory(res.data || [])
    } catch (error) {
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.message) return
    
    try {
      setIsSending(true)
      const res = await notificationAPI.send(formData)
      if (res.success) {
        toast.success(`Notification sent to ${res.count} users`)
        setFormData({ title: '', message: '', imageUrl: '', target: 'all' })
        fetchHistory()
      }
    } catch (error) {
      toast.error('Failed to send notification')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Notification Center</h1>
          <p className="text-slate-500 mt-1 font-medium italic">ইউজারদের পুশ এবং ইন-অ্যাপ নোটিফিকেশন পাঠান</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Composer */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm sticky top-6">
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                </div>
                Compose
              </h2>

              <form onSubmit={handleSend} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Audience</label>
                  <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                    {['all', 'free', 'premium'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData({ ...formData, target: t })}
                        className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                          formData.target === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-5 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                    placeholder="e.g. New Templates Added! 🚀"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-5 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                    placeholder="Write your message here..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-5 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSending ? 'Sending...' : 'Broadcast Now'}
                </button>
              </form>
            </div>
          </div>

          {/* History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">Broadcast History</h2>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last 20 messages</span>
              </div>

              <div className="divide-y divide-slate-50">
                {loading ? (
                  <div className="p-20 flex justify-center">
                    <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                ) : history.length === 0 ? (
                  <div className="p-20 text-center">
                    <p className="text-slate-400 font-bold italic">No notifications sent yet.</p>
                  </div>
                ) : (
                  history.map((item, i) => (
                    <div key={i} className="p-8 hover:bg-slate-50/50 transition-colors group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            item.target === 'premium' ? 'bg-amber-100 text-amber-600' :
                            item.target === 'free' ? 'bg-blue-100 text-blue-600' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {item.target} users
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {formatDistanceToNow(new Date(item.sentAt), { addSuffix: true })}
                          </span>
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {item.count} Delivered
                        </div>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 mb-2">{item._id.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{item._id.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
