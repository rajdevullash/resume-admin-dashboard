'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { templatesAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/AdminLayout'

interface Template {
  _id: string
  name: string
  description?: string
  category: string
  previewImage?: string
  htmlTemplate?: string
  layoutJson?: any
  isPremium: boolean
  isActive: boolean
  usageCount: number
  createdAt: string
}

export default function TemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    category: 'professional',
    description: '',
    isPremium: false,
    previewImage: '',
    htmlTemplate: '',
    layoutJson: {
      sections: ['personal', 'summary', 'experience', 'education', 'skills'],
      layout: 'single-column',
      colorScheme: 'blue',
      fonts: { heading: 'Inter', body: 'Inter' }
    }
  })
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchTemplates()
  }, [router])

  const fetchTemplates = async () => {
    try {
      const response = await templatesAPI.getAll()
      if (response.success) {
        setTemplates(response.data || response.templates || [])
      }
    } catch (error) {
      toast.error('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.htmlTemplate.trim()) {
      toast.error('HTML Template is required')
      return
    }
    try {
      setIsActionLoading(true)
      const response = await templatesAPI.create(formData)
      if (response.success) {
        toast.success('Template created successfully')
        setShowCreateModal(false)
        resetForm()
        fetchTemplates()
      }
    } catch (error) {
      toast.error('Failed to create template')
    } finally {
      setIsActionLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ 
      name: '', 
      category: 'professional', 
      description: '', 
      isPremium: false,
      previewImage: '',
      htmlTemplate: '',
      layoutJson: {
        sections: ['personal', 'summary', 'experience', 'education', 'skills'],
        layout: 'single-column',
        colorScheme: 'blue',
        fonts: { heading: 'Inter', body: 'Inter' }
      }
    })
    setShowPreview(false)
  }

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setFormData({
      name: template.name,
      category: template.category,
      description: template.description || '',
      isPremium: template.isPremium,
      previewImage: template.previewImage || '',
      htmlTemplate: template.htmlTemplate || '',
      layoutJson: template.layoutJson || {
        sections: ['personal', 'summary', 'experience', 'education', 'skills'],
        layout: 'single-column',
        colorScheme: 'blue',
        fonts: { heading: 'Inter', body: 'Inter' }
      }
    })
    setShowEditModal(true)
  }

  const handleUpdateTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTemplate) return
    if (!formData.htmlTemplate.trim()) {
      toast.error('HTML Template is required')
      return
    }
    try {
      setIsActionLoading(true)
      const response = await templatesAPI.update(selectedTemplate._id, formData)
      if (response.success) {
        toast.success('Template updated successfully')
        setShowEditModal(false)
        setSelectedTemplate(null)
        setShowPreview(false)
        fetchTemplates()
      }
    } catch (error) {
      toast.error('Failed to update template')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleToggleStatus = async (templateId: string, currentStatus: boolean) => {
    try {
      const response = await templatesAPI.update(templateId, { isActive: !currentStatus })
      if (response.success) {
        toast.success(`Template ${!currentStatus ? 'activated' : 'deactivated'}`)
        fetchTemplates()
      }
    } catch (error) {
      toast.error('Failed to update template')
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return
    try {
      const response = await templatesAPI.delete(templateId)
      if (response.success) {
        toast.success('Template deleted successfully')
        fetchTemplates()
      }
    } catch (error) {
      toast.error('Failed to delete template')
    }
  }

  const handleCloneTemplate = async (templateId: string) => {
    try {
      setIsActionLoading(true)
      const response = await templatesAPI.clone(templateId)
      if (response.success) {
        toast.success('Template cloned successfully')
        fetchTemplates()
      }
    } catch (error) {
      toast.error('Failed to clone template')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'html' | 'json') => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (type === 'html') {
        setFormData({ ...formData, htmlTemplate: content })
      } else {
        try {
          const json = JSON.parse(content)
          setFormData({ ...formData, layoutJson: json })
        } catch (err) {
          toast.error('Invalid JSON file')
        }
      }
    }
    reader.readAsText(file)
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
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Template Management</h1>
            <p className="text-slate-500 mt-1 font-medium italic">ইউজারদের জন্য স্টাইলিশ রেজুমি টেমপ্লেট ডিজাইন করুন</p>
          </div>
          <button
            onClick={() => {
              resetForm()
              setShowCreateModal(true)
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Template
          </button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates?.map((template) => (
            <div key={template._id} className="group bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              {/* Preview Image */}
              <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                {template.previewImage ? (
                  <img src={template.previewImage} alt={template.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                    <svg className="w-16 h-16 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {template.isPremium && (
                    <span className="px-3 py-1 bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Premium</span>
                  )}
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg ${template.isActive ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedTemplate(template)
                      setShowViewModal(true)
                    }}
                    className="w-12 h-12 rounded-2xl bg-white text-slate-900 flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                    title="Quick View"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl shadow-blue-600/20"
                    title="Edit Template"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleCloneTemplate(template._id)}
                    className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl shadow-emerald-600/20"
                    title="Clone Template"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">{template.name}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{template.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{template.usageCount || 0}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Uses</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                  <button
                    onClick={() => handleToggleStatus(template._id, template.isActive)}
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      template.isActive ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    }`}
                  >
                    {template.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template._id)}
                    className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all"
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

        {templates.length === 0 && (
          <div className="text-center py-32">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-slate-900">No templates found</h3>
            <p className="text-slate-500 mt-2">Start by creating your first resume template.</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-6xl w-full my-8 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{showCreateModal ? 'Create New Template' : 'Edit Template'}</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Template Designer</p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setShowEditModal(false)
                  resetForm()
                }}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={showCreateModal ? handleCreateTemplate : handleUpdateTemplate} className="p-8 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column - Config */}
                <div className="space-y-8">
                  <section className="space-y-6">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                      Basic Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Template Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-5 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                          placeholder="e.g. Modern Executive"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-5 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                        >
                          <option value="professional">Professional</option>
                          <option value="creative">Creative</option>
                          <option value="modern">Modern</option>
                          <option value="minimalist">Minimalist</option>
                          <option value="classic">Classic</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-5 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preview Image URL</label>
                      <input
                        type="url"
                        required
                        value={formData.previewImage}
                        onChange={(e) => setFormData({ ...formData, previewImage: e.target.value })}
                        className="w-full px-5 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                        placeholder="https://example.com/preview.png"
                      />
                      {formData.previewImage && (
                        <div className="mt-2 p-2 bg-slate-50 rounded-xl">
                          <img src={formData.previewImage} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                        </div>
                      )}
                    </div>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-purple-600 rounded-full" />
                      Configuration & Upload
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Upload HTML Template</label>
                        <input
                          type="file"
                          accept=".html,.txt"
                          onChange={(e) => handleFileUpload(e, 'html')}
                          className="w-full px-5 py-2 bg-slate-50 border-transparent rounded-2xl text-xs font-bold transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Upload Layout JSON</label>
                        <input
                          type="file"
                          accept=".json"
                          onChange={(e) => handleFileUpload(e, 'json')}
                          className="w-full px-5 py-2 bg-slate-50 border-transparent rounded-2xl text-xs font-bold transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isPremium}
                          onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                      </label>
                      <div>
                        <p className="text-sm font-black text-slate-900">Premium Template</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Only available for paid subscribers</p>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column - Editor */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                      HTML Template
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700"
                    >
                      {showPreview ? 'Edit Code' : 'Preview Result'}
                    </button>
                  </div>

                  {!showPreview ? (
                    <div className="relative group">
                      <textarea
                        required
                        value={formData.htmlTemplate}
                        onChange={(e) => setFormData({ ...formData, htmlTemplate: e.target.value })}
                        className="w-full h-[400px] px-6 py-4 bg-slate-900 text-slate-300 font-mono text-xs rounded-3xl border-transparent focus:ring-8 focus:ring-blue-500/10 transition-all custom-scrollbar"
                        placeholder="<!-- Enter your HTML template here -->"
                      />
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="px-2 py-1 bg-slate-800 text-slate-500 text-[10px] font-bold rounded-md">HTML/Handlebars</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[400px] rounded-3xl border-2 border-slate-100 overflow-hidden bg-white shadow-inner">
                      <iframe
                        srcDoc={formData.htmlTemplate}
                        className="w-full h-full border-0"
                        title="Live Preview"
                      />
                    </div>
                  )}
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Use {'{{variable}}'} syntax for dynamic fields</p>
                </div>
              </div>

              <div className="flex gap-4 pt-10 mt-10 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setShowEditModal(false)
                    resetForm()
                  }}
                  className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isActionLoading}
                  className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isActionLoading ? 'Processing...' : (showCreateModal ? 'Publish Template' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedTemplate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedTemplate.name}</h2>
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{selectedTemplate.category}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">•</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{selectedTemplate.usageCount || 0} Uses</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowViewModal(false)
                  setSelectedTemplate(null)
                }}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
              <div className="lg:w-1/3 p-8 border-r border-slate-100 overflow-y-auto custom-scrollbar space-y-8">
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Description</h3>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed">{selectedTemplate.description || 'No description provided.'}</p>
                </section>
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Configuration</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Layout</p>
                      <p className="text-xs font-black text-slate-900 capitalize">{selectedTemplate.layoutJson?.layout || 'Standard'}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Theme</p>
                      <p className="text-xs font-black text-slate-900 capitalize">{selectedTemplate.layoutJson?.colorScheme || 'Default'}</p>
                    </div>
                  </div>
                </section>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setShowViewModal(false)
                      handleEditTemplate(selectedTemplate)
                    }}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                  >
                    Edit This Template
                  </button>
                  <button
                    onClick={() => {
                      setShowViewModal(false)
                      handleCloneTemplate(selectedTemplate._id)
                    }}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10"
                  >
                    Clone Template
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-slate-100 p-8 overflow-y-auto custom-scrollbar">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden aspect-[1/1.414] w-full max-w-2xl mx-auto">
                  <iframe
                    srcDoc={selectedTemplate.htmlTemplate}
                    className="w-full h-full border-0"
                    title="Template Preview"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
