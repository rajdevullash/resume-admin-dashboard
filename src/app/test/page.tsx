export default function TestPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #dbeafe, #e0e7ff)', padding: '1rem' }}>
      <div style={{ maxWidth: '28rem', width: '100%' }}>
        <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '4rem', height: '4rem', background: '#2563eb', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <svg style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>Tailwind Test</h1>
            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>If you see styled page, inline CSS works</p>
          </div>
          
          <div className="bg-blue-100 p-4 rounded-lg mb-4">
            <p className="text-blue-800 font-semibold">Tailwind Test</p>
            <p className="text-sm text-blue-600">If this box is blue, Tailwind is working!</p>
          </div>

          <button 
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            style={{ width: '100%', background: '#2563eb', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: '600' }}
          >
            Test Button (Both Inline + Tailwind)
          </button>
        </div>
      </div>
    </div>
  )
}
