'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { analyticsAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/AdminLayout'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface AnalyticsData {
  overview: {
    totalUsers: number
    activeUsers30d: number
    activeUsers7d: number
    premiumUsers: number
    freeUsers: number
    todayRegistrations: number
    totalResumes: number
    totalTemplates: number
    avgResumesPerUser: number
    conversionRate: number
    churnRate: number
  }
  growth: {
    users: Array<{ _id: { year: number, month: number }, count: number }>
    resumes: Array<{ _id: { year: number, month: number }, count: number }>
  }
  templates: Array<{
    _id: string
    name: string
    usageCount: number
    category: string
  }>
  revenue: {
    totalRevenue: number
    count: number
  }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function AnalyticsPage() {
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchAnalytics()
  }, [router])

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsAPI.getDashboard()
      if (response.success) {
        setData(response.data)
      }
    } catch (error) {
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (type: 'users' | 'subscriptions') => {
    try {
      setIsExporting(true)
      const blob = await analyticsAPI.exportReport(type)
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${type}_report_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report exported!`)
    } catch (error) {
      toast.error('Failed to export report')
    } finally {
      setIsExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  const overview = data?.overview
  const growth = data?.growth
  const topTemplates = data?.templates

  const userGrowthData = growth?.users.map(item => ({
    name: MONTHS[item._id.month - 1],
    users: item.count
  })) || []

  const resumeTrendData = growth?.resumes.map(item => ({
    name: MONTHS[item._id.month - 1],
    resumes: item.count
  })) || []

  const pieData = [
    { name: 'Free Users', value: overview?.freeUsers || 0, color: '#94a3b8' },
    { name: 'Premium Users', value: overview?.premiumUsers || 0, color: '#2563eb' }
  ]

  const stats = [
    { label: 'Total Users', value: overview?.totalUsers || 0, color: 'from-blue-500 to-indigo-600', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { label: 'Conversion Rate', value: `${overview?.conversionRate || 0}%`, color: 'from-emerald-500 to-teal-600', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { label: 'Churn Rate', value: `${overview?.churnRate || 0}%`, color: 'from-rose-500 to-pink-600', icon: 'M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6' },
    { label: 'Avg Resumes/User', value: overview?.avgResumesPerUser || 0, color: 'from-amber-500 to-orange-600', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ]

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics & Reports</h1>
            <p className="text-slate-500 mt-1 font-medium">Deep dive into your platform's performance and user behavior.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExport('users')}
              disabled={isExporting}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Users CSV
            </button>
            <button
              onClick={() => handleExport('subscriptions')}
              disabled={isExporting}
              className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Revenue CSV
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-3xl shadow-xl shadow-indigo-500/10 p-8 text-white relative overflow-hidden group`}>
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                </svg>
              </div>
              <div className="relative z-10">
                <p className="text-white/80 text-xs font-bold uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                <h3 className="text-4xl font-black">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* User Growth */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-8">User Growth Trend</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Resume Trend */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-8">Resume Creation Trend</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resumeTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="resumes" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Distribution */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-8">User Distribution</h3>
            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-slate-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Templates */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-8">Top Performing Templates</h3>
            <div className="space-y-4">
              {topTemplates?.map((template, index) => (
                <div key={template._id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                      index === 0 ? 'bg-amber-100 text-amber-600 border border-amber-200' :
                      index === 1 ? 'bg-slate-200 text-slate-600 border border-slate-300' :
                      'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{template.name}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{template.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900">{template.usageCount.toLocaleString()}</span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Uses</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
