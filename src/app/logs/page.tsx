'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { logsAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const response = await logsAPI.getAll({ page, limit: 20 })
      if (response.success) {
        setLogs(response.logs)
        setTotalPages(response.totalPages)
      }
    } catch (error) {
      toast.error('Failed to fetch logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [page])

  const handleUndo = async (id: string) => {
    if (!confirm('Are you sure you want to undo this action?')) return

    try {
      const response = await logsAPI.undo(id)
      if (response.success) {
        toast.success('Action undone successfully')
        fetchLogs()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to undo action')
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'DELETE': return 'text-rose-600 bg-rose-50'
      case 'CREATE': return 'text-emerald-600 bg-emerald-50'
      case 'UPDATE': return 'text-amber-600 bg-amber-50'
      case 'BLOCK': return 'text-slate-600 bg-slate-50'
      default: return 'text-blue-600 bg-blue-50'
    }
  }

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Activity Logs</h1>
          <p className="text-slate-500 mt-1 font-medium">Track all administrative actions and undo critical changes.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Admin</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Action</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Target</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Time</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-8 bg-slate-50/20" />
                    </tr>
                  ))
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-bold">No logs found</td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900">{log.admin?.name}</span>
                          <span className="text-[10px] font-bold text-slate-400">{log.admin?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">{log.targetModel}</span>
                          <span className="text-[10px] font-medium text-slate-400 font-mono">{log.targetId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-600">
                          {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {(log.action === 'DELETE' || log.action === 'DEACTIVATE' || log.action === 'BLOCK') && !log.isUndone ? (
                          <button
                            onClick={() => handleUndo(log._id)}
                            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
                          >
                            Undo
                          </button>
                        ) : log.isUndone ? (
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Undone</span>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
