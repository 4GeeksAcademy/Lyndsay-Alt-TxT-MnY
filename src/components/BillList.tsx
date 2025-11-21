import { useState, useMemo } from 'react'
import BillCard from './BillCard'
import type { Bill, BillStatus, BillCategory } from '../types/bill'

interface BillListProps {
  bills: Bill[]
  onMarkPaid: (id: string) => void
  onMarkUnpaid: (id: string) => void
  onEdit: (bill: Bill) => void
  onDelete: (id: string) => void
}

export default function BillList({ bills, onMarkPaid, onMarkUnpaid, onEdit, onDelete }: BillListProps) {
  const [statusFilter, setStatusFilter] = useState<BillStatus | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<BillCategory | 'all'>('all')

  // Get unique categories from bills
  const categories = useMemo(() => {
    const uniqueCategories = new Set(bills.map(bill => bill.category))
    return Array.from(uniqueCategories).sort()
  }, [bills])

  // Filter bills
  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      const statusMatch = statusFilter === 'all' || bill.status === statusFilter
      const categoryMatch = categoryFilter === 'all' || bill.category === categoryFilter
      return statusMatch && categoryMatch
    })
  }, [bills, statusFilter, categoryFilter])

  // Group bills by status
  const billsByStatus = useMemo(() => {
    return {
      overdue: filteredBills.filter(b => b.status === 'overdue'),
      due_soon: filteredBills.filter(b => b.status === 'due_soon'),
      upcoming: filteredBills.filter(b => b.status === 'upcoming'),
      paid: filteredBills.filter(b => b.status === 'paid')
    }
  }, [filteredBills])

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Status Filter */}
        <div className="flex-1">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BillStatus | 'all')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="overdue">Overdue ({billsByStatus.overdue.length})</option>
            <option value="due_soon">Due Soon ({billsByStatus.due_soon.length})</option>
            <option value="upcoming">Upcoming ({billsByStatus.upcoming.length})</option>
            <option value="paid">Paid ({billsByStatus.paid.length})</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex-1">
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Category
          </label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as BillCategory | 'all')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bills Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredBills.length} of {bills.length} bills
        </p>
      </div>

      {/* Empty State */}
      {filteredBills.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No bills found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by adding your first bill'}
          </p>
        </div>
      )}

      {/* Bills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBills.map(bill => (
          <BillCard
            key={bill.id}
            bill={bill}
            onMarkPaid={onMarkPaid}
            onMarkUnpaid={onMarkUnpaid}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}
