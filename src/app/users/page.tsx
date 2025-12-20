'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usersAPI, userAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/AdminLayout'
import { format } from 'date-fns'

interface User {
  _id: string
  name: string
  email: string
  role: string
  plan: string
  isBlocked: boolean
  createdAt: string
  resumeCount?: number
  lastLogin?: string
}

interface UserDetails extends User {
  resumes: Array<{
    _id: string
    title: string
    createdAt: string
    updatedAt: string
    templateId: {
      name: string
      category: string
    }
  }>
  subscription?: any
}

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterPlan, setFilterPlan] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [isActionLoading, setIsActionLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchUsers()
  }, [router])

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll()
      if (response.success) {
        setUsers(response.users || response.data || [])
      }
    } catch (error) {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleViewProfile = async (userId: string) => {
    try {
      const response = await usersAPI.getById(userId)
      if (response.success) {
        setSelectedUser(response.user)
        setIsProfileModalOpen(true)
      }
    } catch (error) {
      toast.error('Failed to load user details')
    }
  }

  const handleToggleBlock = async (user: User) => {
    try {
      setIsActionLoading(true)
      const response = await usersAPI.toggleBlock(user._id)
      if (response.success) {
        toast.success(`User ${user.isBlocked ? 'unblocked' : 'blocked'} successfully`)
        fetchUsers()
        if (selectedUser?._id === user._id) {
          handleViewProfile(user._id)
        }
      }
    } catch (error) {
      toast.error('Failed to update user status')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    try {
      setIsActionLoading(true)
      const response = await usersAPI.delete(userId)
      if (response.success) {
        toast.success('User deleted successfully')
        setIsProfileModalOpen(false)
        fetchUsers()
      }
    } catch (error) {
      toast.error('Failed to delete user')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      setIsActionLoading(true)
      const response = await usersAPI.resetPassword(selectedUser!._id, newPassword)
      if (response.success) {
        toast.success('Password reset successfully')
        setIsResetPasswordModalOpen(false)
        setNewPassword('')
      }
    } catch (error) {
      toast.error('Failed to reset password')
    } finally {
      setIsActionLoading(false)
    }
  }

  const filteredUsers = (users || []).filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' ? !user.isBlocked : user.isBlocked)
    
    return matchesSearch && matchesRole && matchesPlan && matchesStatus
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
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage your community, roles, and access control.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-bold text-slate-700">{users.length} Total Users</span>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative group">
              <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all"
              />
            </div>
            
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all font-semibold text-slate-700"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>

            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all font-semibold text-slate-700"
            >
              <option value="all">All Plans</option>
              <option value="free">Free Plan</option>
              <option value="premium">Premium Plan</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all font-semibold text-slate-700"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="blocked">Blocked Only</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">User</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Access</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Activity</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900">{user.name}</div>
                          <div className="text-xs font-bold text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        <span className={`w-fit px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          user.role === 'admin' || user.role === 'superadmin' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {user.role}
                        </span>
                        <span className={`w-fit px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          user.plan === 'premium' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {user.plan}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${!user.isBlocked ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`} />
                        <span className={`text-xs font-black uppercase tracking-wider ${!user.isBlocked ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {!user.isBlocked ? 'Active' : 'Blocked'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-700">{user.resumeCount || 0} Resumes</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined {format(new Date(user.createdAt), 'MMM yyyy')}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewProfile(user._id)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="View Profile"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleToggleBlock(user)}
                          className={`p-2 rounded-xl transition-all ${
                            user.isBlocked ? 'text-emerald-600 hover:bg-emerald-50' : 'text-amber-600 hover:bg-amber-50'
                          }`}
                          title={user.isBlocked ? 'Unblock' : 'Block'}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Profile Modal */}
        {isProfileModalOpen && selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl text-white font-black shadow-xl shadow-blue-500/20">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">{selectedUser.name}</h2>
                    <p className="text-slate-500 font-bold">{selectedUser.email}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">{selectedUser.role}</span>
                      <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${selectedUser.plan === 'premium' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{selectedUser.plan}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsProfileModalOpen(false)} className="p-3 hover:bg-white rounded-2xl transition-all text-slate-400 hover:text-slate-900 shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Account Stats</h3>
                      <div className="space-y-3">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Resumes</p>
                          <p className="text-xl font-black text-slate-900">{selectedUser.resumes.length}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined On</p>
                          <p className="text-sm font-black text-slate-900">{format(new Date(selectedUser.createdAt), 'PPP')}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Login</p>
                          <p className="text-sm font-black text-slate-900">{selectedUser.lastLogin ? format(new Date(selectedUser.lastLogin), 'PPP') : 'Never'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h3>
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => setIsResetPasswordModalOpen(true)}
                          className="w-full py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                        >
                          Reset Password
                        </button>
                        <button 
                          onClick={() => handleToggleBlock(selectedUser)}
                          className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                            selectedUser.isBlocked ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-amber-500 text-white hover:bg-amber-600'
                          }`}
                        >
                          {selectedUser.isBlocked ? 'Unblock User' : 'Block User'}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(selectedUser._id)}
                          className="w-full py-3 bg-rose-50 text-rose-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-100 transition-all"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">User Resumes</h3>
                    {selectedUser.resumes.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedUser.resumes.map((resume) => (
                          <div key={resume._id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm group hover:border-blue-500 transition-all">
                            <div className="flex items-start justify-between mb-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{resume.templateId.category}</span>
                            </div>
                            <h4 className="text-sm font-black text-slate-900 truncate">{resume.title}</h4>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Updated {format(new Date(resume.updatedAt), 'MMM d, yyyy')}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-40 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-xs font-bold uppercase tracking-widest">No resumes created yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reset Password Modal */}
        {isResetPasswordModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl">
              <h2 className="text-2xl font-black text-slate-900 mb-2">Reset Password</h2>
              <p className="text-slate-500 font-bold mb-6">Enter a new password for {selectedUser?.name}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm transition-all font-bold"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setIsResetPasswordModalOpen(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleResetPassword}
                    disabled={isActionLoading}
                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                  >
                    {isActionLoading ? 'Resetting...' : 'Confirm Reset'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
