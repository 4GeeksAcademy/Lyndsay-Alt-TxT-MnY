import { useState, useEffect } from 'react'
import Dashboard from '../components/Dashboard'
import BillForm from '../components/BillForm'
import BillList from '../components/BillList'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { 
  getBills, 
  createBill, 
  updateBill, 
  deleteBill, 
  markBillAsPaid, 
  markBillAsUnpaid 
} from '../services/billService'
import type { Bill, CreateBillInput, UpdateBillInput } from '../types/bill'

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingBill, setEditingBill] = useState<Bill | null>(null)
  
  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [billToDelete, setBillToDelete] = useState<string | null>(null)

  // Load bills on mount
  useEffect(() => {
    loadBills()
  }, [])

  const loadBills = async () => {
    setLoading(true)
    setError('')
    const { data, error } = await getBills()
    if (error) {
      setError(error.message)
    } else {
      setBills(data || [])
    }
    setLoading(false)
  }

  const handleAddBill = async (data: CreateBillInput) => {
    setLoading(true)
    const { error } = await createBill(data)
    if (error) {
      setError(error.message)
    } else {
      setIsAddModalOpen(false)
      await loadBills()
    }
    setLoading(false)
  }

  const handleEditBill = async (data: UpdateBillInput) => {
    if (!editingBill) return
    
    setLoading(true)
    const { error } = await updateBill(editingBill.id, data)
    if (error) {
      setError(error.message)
    } else {
      setIsEditModalOpen(false)
      setEditingBill(null)
      await loadBills()
    }
    setLoading(false)
  }

  const handleDeleteBill = async () => {
    if (!billToDelete) return
    
    setLoading(true)
    const { error } = await deleteBill(billToDelete)
    if (error) {
      setError(error.message)
    } else {
      setDeleteConfirmOpen(false)
      setBillToDelete(null)
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

  const openEditModal = (bill: Bill) => {
    setEditingBill(bill)
    setIsEditModalOpen(true)
  }

  const openDeleteConfirm = (id: string) => {
    setBillToDelete(id)
    setDeleteConfirmOpen(true)
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Bills</h1>
              <p className="mt-1 text-sm text-gray-600">Manage your bills and never miss a payment</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Bill
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
            <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && bills.length === 0 && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bills...</p>
          </div>
        )}

        {/* Dashboard */}
        {!loading || bills.length > 0 ? (
          <div className="space-y-8">
            <Dashboard bills={bills} />
            
            {/* Section Divider */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Bills</h2>
              <BillList
                bills={bills}
                onMarkPaid={handleMarkPaid}
                onMarkUnpaid={handleMarkUnpaid}
                onEdit={openEditModal}
                onDelete={openDeleteConfirm}
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* Add Bill Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Bill"
      >
        <BillForm
          onSubmit={handleAddBill}
          onCancel={() => setIsAddModalOpen(false)}
          isLoading={loading}
        />
      </Modal>

      {/* Edit Bill Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingBill(null)
        }}
        title="Edit Bill"
      >
        {editingBill && (
          <BillForm
            onSubmit={handleEditBill}
            onCancel={() => {
              setIsEditModalOpen(false)
              setEditingBill(null)
            }}
            defaultValues={{
              name: editingBill.name,
              amount: editingBill.amount,
              due_date: editingBill.due_date,
              category: editingBill.category,
              sms_enabled: editingBill.sms_enabled
            }}
            isLoading={loading}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Bill?"
        message="Are you sure you want to delete this bill? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteBill}
        onCancel={() => {
          setDeleteConfirmOpen(false)
          setBillToDelete(null)
        }}
      />
    </div>
  )
}
