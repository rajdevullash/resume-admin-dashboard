'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/AdminLayout'

function SettingsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile')
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [platformSettings, setPlatformSettings] = useState({
    siteName: 'Resume Builder',
    supportEmail: 'support@resumebuilder.com',
    maxFreeResumes: 3,
    maxFreeDownloads: 1,
    enableRegistration: true,
    enableEmailVerification: true,
    maintenanceMode: false
  })

  const [brandingSettings, setBrandingSettings] = useState({
    appName: 'Resume Builder',
    appLogo: '',
    themeColor: '#2563eb',
    watermarkText: 'Created with Resume Builder',
    footerText: '© 2025 Resume Builder. All rights reserved.'
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/admin/settings')
        if (response.data.success) {
          setBrandingSettings(response.data.data)
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      }
    }
    fetchSettings()
  }, [])

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const userData = localStorage.getItem('admin_user')
    
    if (!token) {
      router.push('/login')
      return
    }

    if (userData) {
      const parsed = JSON.parse(userData)
      setUser(parsed)
      setProfileData({
        ...profileData,
        name: parsed.name,
        email: parsed.email
      })
    }
  }, [router])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updateData: any = {
        name: profileData.name
      }

      if (profileData.newPassword) {
        if (profileData.newPassword !== profileData.confirmPassword) {
          toast.error('Passwords do not match')
          setLoading(false)
          return
        }
        updateData.currentPassword = profileData.currentPassword
        updateData.newPassword = profileData.newPassword
      }

      const response = await api.put('/users/me', updateData)
      
      if (response.data.success) {
        toast.success('Profile updated successfully')
        localStorage.setItem('admin_user', JSON.stringify(response.data.user))
        setUser(response.data.user)
        setProfileData({
          ...profileData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePlatformSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.put('/admin/settings', platformSettings)
      
      if (response.data.success) {
        toast.success('Settings updated successfully')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update settings')
    } finally {
      setLoading(false)
    }
  }

  const handleBrandingUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.put('/admin/settings', brandingSettings)
      
      if (response.data.success) {
        toast.success('Branding updated successfully')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update branding')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    toast.success('Logged out successfully')
    router.push('/login')
  }

  return (
    <AdminLayout>
      <div className="py-6 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 mt-1 font-medium">Configure your profile and platform preferences.</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm mb-8 w-fit overflow-x-auto">
          {[
            { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
            { id: 'branding', label: 'Branding', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
            { id: 'platform', label: 'Platform', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
            { id: 'security', label: 'Security', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Settings Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              Profile Information
            </h2>
            <form onSubmit={handleProfileUpdate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-5 py-3.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-5 py-3.5 bg-slate-100 border-transparent rounded-2xl text-sm font-bold text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-lg font-black text-slate-900 mb-6">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                    <input
                      type="password"
                      value={profileData.currentPassword}
                      onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                    <input
                      type="password"
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New</label>
                    <input
                      type="password"
                      value={profileData.confirmPassword}
                      onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                >
                  {loading ? 'Saving Changes...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Branding Settings Tab */}
        {activeTab === 'branding' && (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              Branding & UI
            </h2>
            <form onSubmit={handleBrandingUpdate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">App Name</label>
                  <input
                    type="text"
                    value={brandingSettings.appName}
                    onChange={(e) => setBrandingSettings({ ...brandingSettings, appName: e.target.value })}
                    className="w-full px-5 py-3.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Theme Color</label>
                  <div className="flex gap-4">
                    <input
                      type="color"
                      value={brandingSettings.themeColor}
                      onChange={(e) => setBrandingSettings({ ...brandingSettings, themeColor: e.target.value })}
                      className="h-12 w-20 p-1 bg-slate-50 border-transparent rounded-xl cursor-pointer"
                    />
                    <input
                      type="text"
                      value={brandingSettings.themeColor}
                      onChange={(e) => setBrandingSettings({ ...brandingSettings, themeColor: e.target.value })}
                      className="flex-1 px-5 py-3.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all uppercase"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">App Logo URL</label>
                <input
                  type="text"
                  value={brandingSettings.appLogo}
                  onChange={(e) => setBrandingSettings({ ...brandingSettings, appLogo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-5 py-3.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Resume Watermark Text</label>
                <input
                  type="text"
                  value={brandingSettings.watermarkText}
                  onChange={(e) => setBrandingSettings({ ...brandingSettings, watermarkText: e.target.value })}
                  className="w-full px-5 py-3.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Footer Text</label>
                <textarea
                  value={brandingSettings.footerText}
                  onChange={(e) => setBrandingSettings({ ...brandingSettings, footerText: e.target.value })}
                  rows={3}
                  className="w-full px-5 py-3.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all resize-none"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                >
                  {loading ? 'Saving Branding...' : 'Save Branding'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Platform Settings Tab */}
        {activeTab === 'platform' && (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-1.5 h-6 bg-purple-600 rounded-full" />
              Platform Configuration
            </h2>
            <form onSubmit={handlePlatformSettingsUpdate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Site Name</label>
                  <input
                    type="text"
                    value={platformSettings.siteName}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, siteName: e.target.value })}
                    className="w-full px-5 py-3.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Support Email</label>
                  <input
                    type="email"
                    value={platformSettings.supportEmail}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, supportEmail: e.target.value })}
                    className="w-full px-5 py-3.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Max Free Resumes</label>
                  <input
                    type="number"
                    value={platformSettings.maxFreeResumes}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, maxFreeResumes: parseInt(e.target.value) })}
                    className="w-full px-5 py-3.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Max Free Downloads</label>
                  <input
                    type="number"
                    value={platformSettings.maxFreeDownloads}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, maxFreeDownloads: parseInt(e.target.value) })}
                    className="w-full px-5 py-3.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all"
                  />
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-slate-100">
                {[
                  { id: 'enableRegistration', label: 'User Registration', desc: 'Allow new users to create accounts', color: 'blue' },
                  { id: 'enableEmailVerification', label: 'Email Verification', desc: 'Require verification for new accounts', color: 'emerald' },
                  { id: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Put the platform in read-only mode', color: 'rose' },
                ].map((toggle) => (
                  <div key={toggle.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                    <div>
                      <p className="text-sm font-black text-slate-900">{toggle.label}</p>
                      <p className="text-xs font-bold text-slate-500">{toggle.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(platformSettings as any)[toggle.id]}
                        onChange={(e) => setPlatformSettings({ ...platformSettings, [toggle.id]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className={`w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-${toggle.color}-600`} />
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                >
                  {loading ? 'Saving Settings...' : 'Save Configuration'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
              <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
                Security Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-black text-emerald-900">Account Status</p>
                    <p className="text-xs font-bold text-emerald-700 mt-1">Your account is fully secured and active.</p>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-blue-50 border border-blue-100 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-blue-900">Password Security</p>
                    <p className="text-xs font-bold text-blue-700 mt-1">Last changed: Never</p>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="text-[10px] font-black uppercase tracking-widest text-blue-600 mt-3 hover:underline"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-rose-50 rounded-[2.5rem] border border-rose-100 p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-black text-rose-900">Danger Zone</h3>
                  <p className="text-sm font-bold text-rose-700 mt-1">Sensitive actions that affect your session security.</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-8 py-4 bg-rose-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-all active:scale-95"
                >
                  Terminate All Sessions
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    }>
      <SettingsContent />
    </Suspense>
  )
}
