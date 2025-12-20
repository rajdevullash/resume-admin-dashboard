'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/login')
    } else {
      setIsAuthenticated(true)
    }
    setLoading(false)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [router])

  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(p => p)
    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join('/')}`
      const isLast = index === paths.length - 1
      return (
        <div key={path} className="flex items-center">
          <svg className="w-4 h-4 text-slate-400 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {isLast ? (
            <span className="text-slate-900 font-semibold capitalize">{path}</span>
          ) : (
            <Link href={href} className="text-slate-500 hover:text-blue-600 transition-colors capitalize">
              {path}
            </Link>
          )}
        </div>
      )
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar />
      
      <div className="lg:pl-72 transition-all duration-500">
        {/* Top Header */}
        <header 
          className={`sticky top-0 z-40 transition-all duration-300 ${
            isScrolled 
              ? 'bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm py-3' 
              : 'bg-transparent py-5'
          } px-4 sm:px-6 lg:px-8`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-slate-400 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>
              <div className="hidden sm:flex items-center">
                {getBreadcrumbs()}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="hidden md:flex items-center relative group">
                <svg className="w-4 h-4 absolute left-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search anything..." 
                  className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav Spacer */}
      <div className="h-24 lg:hidden"></div>
    </div>
  )
}
