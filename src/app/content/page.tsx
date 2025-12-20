'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { contentAPI, templatesAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/AdminLayout'
import { format } from 'date-fns'

type TabType = 'blog' | 'announcements' | 'faqs' | 'examples'

export default function ContentManagementPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('blog')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)

  // Form States
  const [blogForm, setBlogForm] = useState({ title: '', content: '', category: 'career-tips', image: '', isPublished: true })
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', priority: 'medium', type: 'general', isActive: true })
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: 'general', order: 0, isActive: true })
  const [exampleForm, setExampleForm] = useState({ title: '', description: '', image: '', category: '', templateId: '', isFeatured: false })

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchData()
    fetchTemplates()
  }, [activeTab, router])

  const fetchData = async () => {
    try {
      setLoading(true)
      let res
      if (activeTab === 'blog') res = await contentAPI.getBlogPosts()
      else if (activeTab === 'announcements') res = await contentAPI.getAnnouncements()
      else if (activeTab === 'faqs') res = await contentAPI.getFAQs()
      else if (activeTab === 'examples') res = await contentAPI.getResumeExamples()

      if (res?.success) setData(res.data || [])
    } catch (error) {
      toast.error('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const fetchTemplates = async () => {
    try {
      const res = await templatesAPI.getAll()
      if (res.success) setTemplates(res.templates || res.data || [])
    } catch (error) {}
  }

  const handleOpenModal = (item?: any) => {
    setEditingItem(item || null)
    if (activeTab === 'blog') {
      setBlogForm(item ? { ...item } : { title: '', content: '', category: 'career-tips', image: '', isPublished: true })
    } else if (activeTab === 'announcements') {
      setAnnouncementForm(item ? { ...item } : { title: '', content: '', priority: 'medium', type: 'general', isActive: true })
    } else if (activeTab === 'faqs') {
      setFaqForm(item ? { ...item } : { question: '', answer: '', category: 'general', order: 0, isActive: true })
    } else if (activeTab === 'examples') {
      setExampleForm(item ? { ...item, templateId: item.templateId?._id || item.templateId || '' } : { title: '', description: '', image: '', category: '', templateId: '', isFeatured: false })
    }
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsActionLoading(true)
      let res
      if (activeTab === 'blog') {
        res = editingItem ? await contentAPI.updateBlogPost(editingItem._id, blogForm) : await contentAPI.createBlogPost(blogForm)
      } else if (activeTab === 'announcements') {
        res = editingItem ? await contentAPI.updateAnnouncement(editingItem._id, announcementForm) : await contentAPI.createAnnouncement(announcementForm)
      } else if (activeTab === 'faqs') {
        res = editingItem ? await contentAPI.updateFAQ(editingItem._id, faqForm) : await contentAPI.createFAQ(faqForm)
      } else if (activeTab === 'examples') {
        res = editingItem ? await contentAPI.updateResumeExample(editingItem._id, exampleForm) : await contentAPI.createResumeExample(exampleForm)
      }

      if (res?.success) {
        toast.success('Saved successfully')
        setShowModal(false)
        fetchData()
      }
    } catch (error) {
      toast.error('Failed to save')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      let res
      if (activeTab === 'blog') res = await contentAPI.deleteBlogPost(id)
      else if (activeTab === 'announcements') res = await contentAPI.deleteAnnouncement(id)
      else if (activeTab === 'faqs') res = await contentAPI.deleteFAQ(id)
      else if (activeTab === 'examples') res = await contentAPI.deleteResumeExample(id)

      if (res?.success) {
        toast.success('Deleted successfully')
        fetchData()
      }
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">CMS Lite</h1>
            <p className="text-slate-500 mt-1 font-medium italic">ব্লগ, ঘোষণা এবং উদাহরণ ম্যানেজ করুন</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            Add New {activeTab.slice(0, -1)}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm mb-8 w-fit">
          {(['blog', 'announcements', 'faqs', 'examples'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === tab 
                  ? 'bg-slate-900 text-white shadow-lg' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item) => (
              <div key={item._id} className="group bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all duration-500">
                {activeTab === 'blog' && (
                  <>
                    {item.image && <img src={item.image} className="w-full h-40 object-cover rounded-3xl mb-4" />}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg">{item.category}</span>
                      {!item.isPublished && <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-lg">Draft</span>}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-slate-500 text-xs line-clamp-3 mb-4">{item.content.replace(/<[^>]*>/g, '')}</p>
                  </>
                )}

                {activeTab === 'announcements' && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2 py-1 text-[10px] font-black uppercase rounded-lg ${
                        item.priority === 'high' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                      }`}>{item.priority} priority</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{item.type}</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-xs mb-4">{item.content}</p>
                  </>
                )}

                {activeTab === 'faqs' && (
                  <>
                    <span className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-black uppercase rounded-lg mb-2 inline-block">{item.category}</span>
                    <h3 className="text-sm font-black text-slate-900 mb-2">Q: {item.question}</h3>
                    <p className="text-slate-500 text-xs line-clamp-2 mb-4">A: {item.answer}</p>
                  </>
                )}

                {activeTab === 'examples' && (
                  <>
                    {item.image && <img src={item.image} className="w-full h-48 object-cover rounded-3xl mb-4" />}
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-black uppercase rounded-lg">{item.category}</span>
                      {item.isFeatured && <span className="text-amber-500">★</span>}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase mb-4">Template: {item.templateId?.name || 'N/A'}</p>
                  </>
                )}

                <div className="flex gap-2 pt-4 border-t border-slate-50">
                  <button onClick={() => handleOpenModal(item)} className="flex-1 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase hover:bg-slate-100 transition-all">Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-[3rem] w-full max-w-2xl my-8 overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-2xl font-black text-slate-900">{editingItem ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-slate-900">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                {activeTab === 'blog' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                      <input type="text" required value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-2xl text-sm font-bold border-transparent focus:bg-white focus:border-blue-500 transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                        <select value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-2xl text-sm font-bold border-transparent focus:bg-white focus:border-blue-500 transition-all">
                          <option value="career-tips">Career Tips</option>
                          <option value="resume-writing">Resume Writing</option>
                          <option value="interview-prep">Interview Prep</option>
                          <option value="job-search">Job Search</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                        <input type="text" value={blogForm.image} onChange={e => setBlogForm({...blogForm, image: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-2xl text-sm font-bold border-transparent focus:bg-white focus:border-blue-500 transition-all" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Content (HTML supported)</label>
                      <textarea required rows={8} value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-2xl text-sm font-bold border-transparent focus:bg-white focus:border-blue-500 transition-all" />
                    </div>
                  </>
                )}

                {activeTab === 'announcements' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                      <input type="text" required value={announcementForm.title} onChange={e => setAnnouncementForm({...announcementForm, title: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-2xl text-sm font-bold border-transparent focus:bg-white focus:border-blue-500 transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                        <select value={announcementForm.priority} onChange={e => setAnnouncementForm({...announcementForm, priority: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-2xl text-sm font-bold border-transparent focus:bg-white focus:border-blue-500 transition-all">
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                        <select value={announcementForm.type} onChange={e => setAnnouncementForm({...announcementForm, type: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-2xl text-sm font-bold border-transparent focus:bg-white focus:border-blue-500 transition-all">
                          <option value="general">General</option>
                          <option value="feature">Feature</option>
                          <option value="update">Update</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Content</label>
                      <textarea required rows={4} value={announcementForm.content} onChange={e => setAnnouncementForm({...announcementForm, content: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-2xl text-sm font-bold border-transparent focus:bg-white focus:border-blue-500 transition-all" />
                    </div>
                  </>
                )}

                {activeTab === 'faqs' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Question</label>
                      <input type="text" required value={faqForm.question} onChange={e => setFaqForm({...faqForm, question: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-2xl text-sm font-bold border-transparent focus:bg-white focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                      <select value={faqForm.category} onChange={e => setFaqForm({...faqForm, category: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-2xl text-sm font-bold border-transparent focus:bg-white focus:border-blue-500 transition-all">
                        <option value="general">General</option>
                        <option value="account">Account</option>
                        <option value="subscription">Subscription</option>
                        <option value="resume-builder">Resume Builder</option>
                        <option value="technical">Technical</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Answer</label>
                      <textarea required rows={4} value={faqForm.answer} onChange={e => setFaqForm({...faqForm, answer: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-2xl text-sm font-bold border-transparent focus:bg-white focus:border-blue-500 transition-all" />
                    </div>
                  </>
                )}

                {activeTab === 'examples' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                      <input type="text" required value={exampleForm.title} onChange={e => setExampleForm({...exampleForm, title: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-2xl text-sm font-bold border-transparent focus:bg-white focus:border-blue-500 transition-all" placeholder="e.g. Senior Software Engineer Resume" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                        <input type="text" required value={exampleForm.category} onChange={e => setExampleForm({...exampleForm, category: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-2xl text-sm font-bold border-transparent focus:bg-white focus:border-blue-500 transition-all" placeholder="e.g. Technology" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Template</label>
                        <select value={exampleForm.templateId} onChange={e => setExampleForm({...exampleForm, templateId: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-2xl text-sm font-bold border-transparent focus:bg-white focus:border-blue-500 transition-all">
                          <option value="">Select Template</option>
                          {templates.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                      <input type="text" required value={exampleForm.image} onChange={e => setExampleForm({...exampleForm, image: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-2xl text-sm font-bold border-transparent focus:bg-white focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                      <textarea rows={3} value={exampleForm.description} onChange={e => setExampleForm({...exampleForm, description: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-2xl text-sm font-bold border-transparent focus:bg-white focus:border-blue-500 transition-all" />
                    </div>
                  </>
                )}

                <div className="flex gap-4 pt-6 border-t border-slate-100">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                  <button type="submit" disabled={isActionLoading} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50">
                    {isActionLoading ? 'Saving...' : 'Save Content'}
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
