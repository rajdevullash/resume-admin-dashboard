'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, templatesAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/AdminLayout'
import { format } from 'date-fns'

interface Resume {
  _id: string
  title: string
  userId: {
    _id: string
    name: string
    email: string
    plan: string
  }
  templateId: {
    _id: string
    name: string
    category: string
  }
  personalInfo: {
    fullName: string
    email: string
    phone: string
  }
  createdAt: string
  updatedAt: string
}

interface Template {
  _id: string
  name: string
  category: string
}

export default function ResumesPage() {
  const router = useRouter()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filters
  const [filterTemplate, setFilterTemplate] = useState('all')
  const [filterPlan, setFilterPlan] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchInitialData()
  }, [router])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      const [resumesRes, templatesRes] = await Promise.all([
        api.get('/admin/resumes'),
        templatesAPI.getAll()
      ])
      
      if (resumesRes.data.success) {
        setResumes(resumesRes.data.resumes || [])
      }
      if (templatesRes.success) {
        setTemplates(templatesRes.templates || templatesRes.data || [])
      }
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const fetchFilteredResumes = async () => {
    try {
      setIsActionLoading(true)
      const params = new URLSearchParams()
      if (filterTemplate !== 'all') params.append('templateId', filterTemplate)
      if (filterPlan !== 'all') params.append('plan', filterPlan)
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await api.get(`/admin/resumes?${params.toString()}`)
      if (response.data.success) {
        setResumes(response.data.resumes || [])
      }
    } catch (error) {
      toast.error('Failed to apply filters')
    } finally {
      setIsActionLoading(false)
    }
  }

  useEffect(() => {
    if (!loading) {
      fetchFilteredResumes()
    }
  }, [filterTemplate, filterPlan, startDate, endDate])

  const handleDeleteResume = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume? This action is permanent.')) return

    try {
      setIsActionLoading(true)
      const response = await api.delete(`/admin/resumes/${resumeId}`)
      if (response.data.success) {
        toast.success('Resume deleted successfully')
        setSelectedResume(null)
        fetchFilteredResumes()
      }
    } catch (error) {
      toast.error('Failed to delete resume')
    } finally {
      setIsActionLoading(false)
    }
  }

  const filteredResumes = (resumes || []).filter(resume => {
    const searchLower = searchQuery.toLowerCase()
    return (
      resume.title.toLowerCase().includes(searchLower) ||
      resume.userId?.name.toLowerCase().includes(searchLower) ||
      resume.userId?.email.toLowerCase().includes(searchLower)
    )
  })

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
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Resume Management</h1>
            <p className="text-slate-500 mt-1 font-medium italic">সব ইউজারের রেজুমি এখান থেকে কন্ট্রোল করা যাবে</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-bold text-slate-700">{resumes.length} Resumes Found</span>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative group">
              <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by title, name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all"
              />
            </div>

            <select
              value={filterTemplate}
              onChange={(e) => setFilterTemplate(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all font-semibold text-slate-700"
            >
              <option value="all">All Templates</option>
              {templates.map(t => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>

            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all font-semibold text-slate-700"
            >
              <option value="all">All Plans</option>
              <option value="free">Free Users</option>
              <option value="premium">Premium Users</option>
            </select>

            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-700"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Resumes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => (
            <div 
              key={resume._id} 
              className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <button 
                    onClick={() => setSelectedResume(resume)}
                    className="w-full py-3 bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0"
                  >
                    Quick Preview
                  </button>
                </div>
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    resume.userId?.plan === 'premium' ? 'bg-amber-500 text-white' : 'bg-white/90 text-slate-600'
                  }`}>
                    {resume.userId?.plan}
                  </span>
                </div>
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">{resume.title}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{resume.templateId?.name || 'Standard Template'}</p>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-blue-600">
                    {resume.userId?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-black text-slate-900 truncate">{resume.userId?.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 truncate">{resume.userId?.email}</p>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {format(new Date(resume.createdAt), 'MMM d, yyyy')}
                  </span>
                  <button 
                    onClick={() => handleDeleteResume(resume._id)}
                    className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResumes.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm mt-8">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-slate-900">No resumes found</h3>
            <p className="text-slate-500 font-medium">Try adjusting your filters or search query.</p>
          </div>
        )}

        {/* Resume Preview Modal */}
        {selectedResume && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{selectedResume.title}</h2>
                  <p className="text-slate-500 font-bold">Created by {selectedResume.userId?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <a 
                    href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/resumes/${selectedResume._id}/download`}
                    target="_blank"
                    className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                  >
                    Download PDF
                  </a>
                  <button onClick={() => setSelectedResume(null)} className="p-3 hover:bg-white rounded-2xl transition-all text-slate-400 hover:text-slate-900 shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-100">
                <div className="max-w-3xl mx-auto bg-white shadow-2xl min-h-[1000px] p-12 rounded-lg">
                  {/* Mock Layout Preview */}
                  <div className="border-b-2 border-slate-900 pb-8 mb-8">
                    <h1 className="text-4xl font-black text-slate-900 mb-2">{selectedResume.personalInfo?.fullName}</h1>
                    <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-600">
                      <span>{selectedResume.personalInfo?.email}</span>
                      <span>•</span>
                      <span>{selectedResume.personalInfo?.phone}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <section>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Summary</h3>
                      <p className="text-slate-600 leading-relaxed font-medium">Professional summary content would appear here in the full layout view.</p>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Experience</h3>
                      <div className="space-y-6">
                        <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                        <div className="h-20 bg-slate-50 rounded w-full"></div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Education</h3>
                      <div className="space-y-4">
                        <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                        <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Template: {selectedResume.templateId?.name}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan: {selectedResume.userId?.plan}</span>
                </div>
                <button 
                  onClick={() => handleDeleteResume(selectedResume._id)}
                  className="px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-100 transition-all"
                >
                  Delete Inappropriate Resume
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
