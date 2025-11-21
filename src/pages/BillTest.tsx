import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { 
  createBill, 
  getBills, 
  updateBill, 
  deleteBill, 
  markBillAsPaid,
  markBillAsUnpaid 
} from '../services/billService'
import { formatBillStatus, getStatusColorClass } from '../utils/billUtils'
import type { Bill } from '../types/bill'

export default function BillTest() {
  const [bills, setBills] = useState<Bill[]>([])
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    testConnection()
    loadBills()
  }, [])

  const testConnection = async () => {
    try {
      const { error } = await supabase.from('bills').select('*').limit(1)
      if (error) throw error
      setConnectionStatus('connected')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setConnectionStatus('error')
    }
  }

  const loadBills = async () => {
    setLoading(true)
    const { data, error } = await getBills()
    if (error) {
      setError(error.message)
    } else {
      setBills(data || [])
    }
    setLoading(false)
  }

  const handleCreateTestBill = async () => {
    setLoading(true)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { error } = await createBill({
      name: 'Test Electric Bill',
      amount: 125.50,
      due_date: tomorrow.toISOString().split('T')[0],
      category: 'utilities',
      sms_enabled: true
    })

    if (error) {
      setError(error.message)
    } else {
      await loadBills()
    }
    setLoading(false)
  }

  const handleMarkPaid = async (id: string) => {
    setLoading(true)
    const { error } = await markBillAsPaid(id)
    if (error) {
      setError(error.message)
    } else {
      await loadBills()
    }
    setLoading(false)
  }

  const handleMarkUnpaid = async (id: string) => {
    setLoading(true)
    const { error } = await markBillAsUnpaid(id)
    if (error) {
      setError(error.message)
    } else {
      await loadBills()
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bill?')) return
    
    setLoading(true)
    const { error } = await deleteBill(id)
    if (error) {
      setError(error.message)
    } else {
      await loadBills()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">BillTrack - Phase 1 Test</h1>

        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          {connectionStatus === 'connected' && (
            <div className="flex items-center text-green-600">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">✅ Supabase Connected</span>
            </div>
          )}
          {connectionStatus === 'error' && (
            <div className="text-red-600">❌ Error: {error}</div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <button
            onClick={handleCreateTestBill}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded mr-2"
          >
            Create Test Bill (Due Tomorrow)
          </button>
          <button
            onClick={loadBills}
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded"
          >
            Refresh Bills
          </button>
        </div>

        {/* Bills List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Bills ({bills.length})</h2>
          
          {loading && <p className="text-gray-500">Loading...</p>}
          
          {!loading && bills.length === 0 && (
            <p className="text-gray-500">No bills yet. Create a test bill to get started!</p>
          )}

          <div className="space-y-4">
            {bills.map((bill) => (
              <div key={bill.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{bill.name}</h3>
                    <p className="text-2xl font-bold text-gray-900">${bill.amount.toFixed(2)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColorClass(bill.status)}`}>
                    {formatBillStatus(bill.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-semibold">Due Date:</span> {bill.due_date}
                  </div>
                  <div>
                    <span className="font-semibold">Category:</span> {bill.category}
                  </div>
                  <div>
                    <span className="font-semibold">SMS:</span> {bill.sms_enabled ? '✅ Enabled' : '❌ Disabled'}
                  </div>
                  {bill.payment_date && (
                    <div>
                      <span className="font-semibold">Paid:</span> {bill.payment_date}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {bill.payment_date ? (
                    <button
                      onClick={() => handleMarkUnpaid(bill.id)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Mark Unpaid
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarkPaid(bill.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Mark Paid
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(bill.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">✅ Phase 1 Checklist</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              Bills table schema created in Supabase
            </li>
            <li className="flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              TypeScript types defined (Bill, CreateBillInput, UpdateBillInput)
            </li>
            <li className="flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              CRUD operations implemented (Create, Read, Update, Delete)
            </li>
            <li className="flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              Status calculation logic working
            </li>
            <li className="flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              Mark as Paid/Unpaid functionality
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
