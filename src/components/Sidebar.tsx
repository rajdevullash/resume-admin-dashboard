'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('admin_user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    toast.success('Logged out successfully')
    router.push('/login')
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      name: 'Users',
      href: '/users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      name: 'Resumes',
      href: '/resumes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      name: 'Templates',
      href: '/templates',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      )
    },
    {
      name: 'Subscriptions',
      href: '/subscriptions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      name: 'Content',
      href: '/content',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2v4a2 2 0 002 2h4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h3m-3 4h6m-6 4h6" />
        </svg>
      )
    },
    {
      name: 'Notifications',
      href: '/notifications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    },
    {
      name: 'Branding',
      href: '/settings?tab=branding',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.828 2.828a2 2 0 010 2.828l-8.486 8.486" />
        </svg>
      )
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      name: 'Activity Logs',
      href: '/logs',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 hidden lg:flex lg:flex-col transition-all duration-500 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-72'
        } bg-[#0f172a] text-slate-300 border-r border-slate-800 shadow-2xl`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800/50">
          {!isCollapsed && (
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white tracking-tight">ResumePro</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Admin Panel</span>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {!isCollapsed && (
            <div className="px-4 mb-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Main Menu</span>
            </div>
          )}
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={isCollapsed ? item.name : ''}
              >
                <div className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-blue-500' : 'text-slate-500 group-hover:text-blue-400'}`}>
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>{item.name}</span>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.8)]" />}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 mt-auto border-t border-slate-800/50 bg-slate-900/50">
          {!isCollapsed ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-bold shadow-inner">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-semibold text-white truncate">{user?.name || 'Admin User'}</span>
                  <span className="text-xs text-slate-500 truncate">{user?.email || 'admin@resumepro.com'}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-all duration-300 border border-transparent hover:border-rose-500/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-bold shadow-inner">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-all duration-300"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-24 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-500 transition-colors z-50 border-2 border-[#0f172a]"
        >
          <svg className={`w-4 h-4 transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-6 inset-x-4 bg-[#0f172a]/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl z-50 px-2">
        <nav className="flex justify-around items-center h-16">
          {navigation.slice(0, 5).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-110' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {item.icon}
              </Link>
            )
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center w-12 h-12 text-rose-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </nav>
      </div>
    </>
  )
}
