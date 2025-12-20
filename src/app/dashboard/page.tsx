'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
  Cell,
  PieChart,
  Pie
} from 'recharts'

interface Stats {
  overview: {
    totalUsers: number
    activeUsers30d: number
    activeUsers7d: number
    premiumUsers: number
    freeUsers: number
    todayRegistrations: number
    totalResumes: number
    totalTemplates: number
  }
  growth: {
    users: Array<{ _id: { year: number, month: number }, count: number }>
    resumes: Array<{ _id: { year: number, month: number }, count: number }>
  }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const userData = localStorage.getItem('admin_user')
    
    if (!token) {
      router.push('/login')
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }

    fetchAnalytics()
  }, [router])

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsAPI.getDashboard()
      if (response.success) {
        setData(response.data)
      }
    } catch (error: any) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
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

  const userGrowthData = growth?.users.map(item => ({
    name: MONTHS[item._id.month - 1],
    users: item.count
  })) || []

  const resumeTrendData = growth?.resumes.map(item => ({
    name: MONTHS[item._id.month - 1],
    resumes: item.count
  })) || []

  const pieData = [
    { name: 'Free', value: overview?.freeUsers || 0, color: '#94a3b8' },
    { name: 'Premium', value: overview?.premiumUsers || 0, color: '#2563eb' }
  ]

  const statCards = [
    {
      title: 'Total Users',
      value: overview?.totalUsers || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'blue',
      subtitle: 'All time registrations'
    },
    {
      title: 'Active Users (30d)',
      value: overview?.activeUsers30d || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'emerald',
      subtitle: `${overview?.activeUsers7d || 0} active in last 7 days`
    },
    {
      title: 'Premium Users',
      value: overview?.premiumUsers || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      color: 'amber',
      subtitle: `${((overview?.premiumUsers || 0) / (overview?.totalUsers || 1) * 100).toFixed(1)}% conversion rate`
    },
    {
      title: 'Today\'s Signups',
      value: overview?.todayRegistrations || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      color: 'rose',
      subtitle: 'New users joined today'
    }
  ]

  return (
    <AdminLayout>
      <div className="py-6">
        {/* Welcome Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Dashboard <span className="text-blue-600">Overview</span>
            </h1>
            <p className="text-slate-500 mt-1 font-medium italic">এক নজরে সব বুঝা যাবে</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchAnalytics} className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white rounded-xl border border-slate-200 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <Link href="/analytics" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20">
              Detailed Analytics
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, i) => (
            <div 
              key={i} 
              className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-3xl font-black text-slate-900">{stat.value.toLocaleString()}</h3>
                  </div>
                  <p className="text-xs font-medium text-slate-400 mt-1">{stat.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* User Growth Chart */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-900">User Growth</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Monthly Registrations</p>
              </div>
            </div>
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
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Resume Trend Chart */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-900">Resume Creation</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Monthly Trend</p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resumeTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="resumes" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Free vs Premium Pie Chart */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-2">User Distribution</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Free vs Premium</p>
            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900">{overview?.premiumUsers}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium</span>
              </div>
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

          {/* Quick Stats / Info */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-6">Platform Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Resumes Created</p>
                <h4 className="text-2xl font-black text-slate-900">{overview?.totalResumes.toLocaleString()}</h4>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-4">
                  <div className="bg-violet-500 h-full rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Active Templates</p>
                <h4 className="text-2xl font-black text-slate-900">{overview?.totalTemplates.toLocaleString()}</h4>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-4">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">7-Day Active Users</p>
                <h4 className="text-2xl font-black text-slate-900">{overview?.activeUsers7d.toLocaleString()}</h4>
                <p className="text-xs font-bold text-emerald-500 mt-2">Engaged Audience</p>
              </div>
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">30-Day Active Users</p>
                <h4 className="text-2xl font-black text-slate-900">{overview?.activeUsers30d.toLocaleString()}</h4>
                <p className="text-xs font-bold text-blue-500 mt-2">Monthly Reach</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
