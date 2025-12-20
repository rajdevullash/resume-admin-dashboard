'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { subscriptionAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/AdminLayout'
import { format, formatDistanceToNow, isAfter } from 'date-fns'

interface Plan {
  _id: string
  name: string
  displayName: string
  description: string
  price: number
  duration: number
  features: string[]
  maxResumes: number
  maxTemplates: number
  isActive: boolean
  isPopular: boolean
  sortOrder: number
  iapProductId?: string
}

interface Subscription {
  _id: string
  userId: {
    _id: string
    name: string
    email: string
  }
  planId: {
    name: string
    displayName: string
    price: number
  }
  status: 'active' | 'expired' | 'cancelled' | 'pending'
  startDate: string
  endDate: string
  paymentMethod: string
  paymentDetails?: {
    transactionId?: string
    amount?: number
  }
}

export default function SubscriptionsPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'plans' | 'active'>('plans')
  
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    price: 0,
    duration: 30,
    maxResumes: 5,
    maxTemplates: 2,
    isActive: true,
    isPopular: false,
    iapProductId: '',
    features: ['']
  })

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [plansRes, subsRes] = await Promise.all([
        subscriptionAPI.getAllPlans(),
        subscriptionAPI.getAllSubscriptions()
      ])

      if (plansRes.success) setPlans(plansRes.plans || [])
      if (subsRes.success) setSubscriptions(subsRes.subscriptions || [])
    } catch (error) {
      toast.error('Failed to load subscription data')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan)
      setFormData({
        name: plan.name,
        displayName: plan.displayName,
        description: plan.description,
        price: plan.price,
        duration: plan.duration,
        maxResumes: plan.maxResumes,
        maxTemplates: plan.maxTemplates,
        isActive: plan.isActive,
        isPopular: plan.isPopular,
        iapProductId: plan.iapProductId || '',
        features: plan.features.length > 0 ? [...plan.features] : ['']
      })
    } else {
      setEditingPlan(null)
      setFormData({
        name: '',
        displayName: '',
        description: '',
        price: 0,
        duration: 30,
        maxResumes: 5,
        maxTemplates: 2,
        isActive: true,
        isPopular: false,
        iapProductId: '',
        features: ['']
      })
    }
    setShowPlanModal(true)
  }

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsActionLoading(true)
      const cleanedFeatures = formData.features.filter(f => f.trim() !== '')
      const data = { ...formData, features: cleanedFeatures }

      let response
      if (editingPlan) {
        response = await subscriptionAPI.updatePlan(editingPlan._id, data)
      } else {
        response = await subscriptionAPI.createPlan(data)
      }

      if (response.success) {
        toast.success(`Plan ${editingPlan ? 'updated' : 'created'} successfully`)
        setShowPlanModal(false)
        fetchData()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save plan')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleTogglePlanStatus = async (plan: Plan) => {
    try {
      const response = await subscriptionAPI.updatePlan(plan._id, { isActive: !plan.isActive })
      if (response.success) {
        toast.success(`Plan ${!plan.isActive ? 'enabled' : 'disabled'} successfully`)
        fetchData()
      }
    } catch (error) {
      toast.error('Failed to update plan status')
    }
  }

  const handleDeletePlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan? This may affect existing users.')) return
    try {
      const response = await subscriptionAPI.deletePlan(id)
      if (response.success) {
        toast.success('Plan deleted successfully')
        fetchData()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete plan')
    }
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData({ ...formData, features: newFeatures })
  }

  const addFeatureField = () => {
    setFormData({ ...formData, features: [...formData.features, ''] })
  }

  const removeFeatureField = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index)
    setFormData({ ...formData, features: newFeatures.length > 0 ? newFeatures : [''] })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="py-6">
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Subscription Control</h1>
            <p className="text-slate-500 mt-1 font-medium italic">ম্যানেজ করুন সাবস্ক্রিপশন প্ল্যান এবং ইউজার এক্সেস</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
              <button
                onClick={() => setActiveTab('plans')}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  activeTab === 'plans' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Plans
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  activeTab === 'active' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Active Subs
              </button>
            </div>
            {activeTab === 'plans' && (
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
                New Plan
              </button>
            )}
          </div>
        </div>

        {activeTab === 'plans' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className={`group relative bg-white rounded-[3rem] shadow-sm border-2 p-10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col ${
                  plan.isActive ? 'border-blue-500/20 ring-8 ring-blue-500/[0.02]' : 'border-slate-100 opacity-75'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="flex justify-between items-start mb-8">
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-2xl shadow-inner ${
                    plan.isActive ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
                  }`}>
                    {plan.name === 'free' ? '🌱' : plan.name.includes('premium') ? '💎' : '🚀'}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      plan.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                    }`}>
                      {plan.isActive ? 'Enabled' : 'Disabled'}
                    </span>
                    {plan.iapProductId && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                        IAP Ready
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-1">{plan.displayName}</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">{plan.name}</p>
                
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-black text-slate-900">${plan.price}</span>
                  <span className="text-slate-400 font-bold text-sm">/{plan.duration} days</span>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Resumes</p>
                      <p className="text-sm font-black text-slate-900">{plan.maxResumes === -1 ? 'Unlimited' : plan.maxResumes}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Templates</p>
                      <p className="text-sm font-black text-slate-900">{plan.maxTemplates === -1 ? 'All' : plan.maxTemplates}</p>
                    </div>
                  </div>
                  
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenModal(plan)}
                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
                  >
                    Edit Limits
                  </button>
                  <button 
                    onClick={() => handleTogglePlanStatus(plan)}
                    className={`p-4 rounded-2xl transition-all ${
                      plan.isActive ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    }`}
                    title={plan.isActive ? 'Disable Plan' : 'Enable Plan'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={plan.isActive ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDeletePlan(plan._id)}
                    className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Subscriber</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Plan Details</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Payment</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Expiry Tracking</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {subscriptions.map((sub) => {
                    const isExpired = !isAfter(new Date(sub.endDate), new Date())
                    return (
                      <tr key={sub._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">
                              {sub.userId?.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-black text-slate-900">{sub.userId?.name}</div>
                              <div className="text-xs font-bold text-slate-400">{sub.userId?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 mb-1">
                              {sub.planId?.displayName}
                            </span>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub.planId?.name}</div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-900">${sub.planId?.price}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub.paymentMethod}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              sub.status === 'active' && !isExpired ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                              'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                            }`} />
                            <span className={`text-xs font-black uppercase tracking-wider ${
                              sub.status === 'active' && !isExpired ? 'text-emerald-600' : 'text-rose-600'
                            }`}>
                              {isExpired ? 'Expired' : sub.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className={`text-xs font-black ${isExpired ? 'text-rose-600' : 'text-slate-700'}`}>
                              {isExpired ? 'Expired ' : 'Expires '}
                              {formatDistanceToNow(new Date(sub.endDate), { addSuffix: true })}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {format(new Date(sub.startDate), 'MMM d')} - {format(new Date(sub.endDate), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {subscriptions.length === 0 && (
              <div className="text-center py-32">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-slate-900">No active subscriptions</h3>
                <p className="text-slate-500 mt-2">Subscriptions will appear here once users upgrade.</p>
              </div>
            )}
          </div>
        )}

        {/* Plan Modal */}
        {showPlanModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-[3rem] w-full max-w-4xl my-8 overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h2>
                  <p className="text-slate-500 font-bold">Configure pricing, limits, and features.</p>
                </div>
                <button onClick={() => setShowPlanModal(false)} className="p-3 hover:bg-white rounded-2xl transition-all text-slate-400 hover:text-slate-900 shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSavePlan} className="p-8 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <section className="space-y-4">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Basic Info</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Internal Name</label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-5 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                            placeholder="e.g. premium-monthly"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
                          <input
                            type="text"
                            required
                            value={formData.displayName}
                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                            className="w-full px-5 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                            placeholder="e.g. Premium Monthly"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                        <textarea
                          required
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-5 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                          rows={2}
                        />
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pricing & Duration</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price ($)</label>
                          <input
                            type="number"
                            required
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                            className="w-full px-5 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration (Days)</label>
                          <input
                            type="number"
                            required
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                            className="w-full px-5 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                          />
                        </div>
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Flutter IAP Integration</h3>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Store Product ID</label>
                        <input
                          type="text"
                          value={formData.iapProductId}
                          onChange={(e) => setFormData({ ...formData, iapProductId: e.target.value })}
                          className="w-full px-5 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                          placeholder="e.g. com.app.premium_monthly"
                        />
                        <p className="text-[10px] font-bold text-slate-400 italic">Google Play / Apple Store Product ID</p>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-6">
                    <section className="space-y-4">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Usage Limits</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Max Resumes</label>
                          <input
                            type="number"
                            required
                            value={formData.maxResumes}
                            onChange={(e) => setFormData({ ...formData, maxResumes: Number(e.target.value) })}
                            className="w-full px-5 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                          />
                          <p className="text-[10px] font-bold text-slate-400">-1 for unlimited</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Max Templates</label>
                          <input
                            type="number"
                            required
                            value={formData.maxTemplates}
                            onChange={(e) => setFormData({ ...formData, maxTemplates: Number(e.target.value) })}
                            className="w-full px-5 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                          />
                          <p className="text-[10px] font-bold text-slate-400">-1 for all</p>
                        </div>
                      </div>
                    </section>

                    <section className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Features List</h3>
                        <button 
                          type="button"
                          onClick={addFeatureField}
                          className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700"
                        >
                          + Add Feature
                        </button>
                      </div>
                      <div className="space-y-3">
                        {formData.features.map((feature, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => handleFeatureChange(index, e.target.value)}
                              className="flex-1 px-5 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                              placeholder="e.g. AI Resume Review"
                            />
                            <button 
                              type="button"
                              onClick={() => removeFeatureField(index)}
                              className="p-3 text-slate-400 hover:text-rose-600 transition-all"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>

                    <div className="flex gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.isPopular}
                          onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                          className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 transition-all"
                        />
                        <span className="text-sm font-black text-slate-700 group-hover:text-slate-900">Mark as Popular</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-10 mt-10 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowPlanModal(false)}
                    className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isActionLoading}
                    className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isActionLoading ? 'Saving...' : (editingPlan ? 'Update Plan' : 'Create Plan')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
