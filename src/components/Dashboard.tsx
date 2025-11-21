import { useMemo } from 'react'
import type { Bill } from '../types/bill'

interface DashboardProps {
  bills: Bill[]
}

export default function Dashboard({ bills }: DashboardProps) {
  // Calculate budget summary
  const summary = useMemo(() => {
    const totalBills = bills.reduce((sum, bill) => sum + bill.amount, 0)
    const totalPaid = bills
      .filter(bill => bill.payment_date)
      .reduce((sum, bill) => sum + bill.amount, 0)
    const remainingBalance = totalBills - totalPaid
    const progressPercentage = totalBills > 0 ? (totalPaid / totalBills) * 100 : 0

    // Count bills by status
    const statusCounts = {
      paid: bills.filter(b => b.status === 'paid').length,
      due_soon: bills.filter(b => b.status === 'due_soon').length,
      overdue: bills.filter(b => b.status === 'overdue').length,
      upcoming: bills.filter(b => b.status === 'upcoming').length
    }

    return {
      totalBills,
      totalPaid,
      remainingBalance,
      progressPercentage,
      statusCounts,
      totalCount: bills.length
    }
  }, [bills])

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bills */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bills</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${summary.totalBills.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{summary.totalCount} bills</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Paid */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Paid</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ${summary.totalPaid.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{summary.statusCounts.paid} paid</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Remaining Balance */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                ${summary.remainingBalance.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {summary.totalCount - summary.statusCounts.paid} unpaid
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Progress</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {summary.progressPercentage.toFixed(0)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">completion rate</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Payment Progress</h3>
          <span className="text-sm font-medium text-gray-600">
            {summary.progressPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(summary.progressPercentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>${summary.totalPaid.toFixed(2)} paid</span>
          <span>${summary.remainingBalance.toFixed(2)} remaining</span>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bills by Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Overdue */}
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-3xl font-bold text-red-600">{summary.statusCounts.overdue}</div>
            <div className="text-sm font-medium text-red-700 mt-1">Overdue</div>
          </div>

          {/* Due Soon */}
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-3xl font-bold text-yellow-600">{summary.statusCounts.due_soon}</div>
            <div className="text-sm font-medium text-yellow-700 mt-1">Due Soon</div>
          </div>

          {/* Upcoming */}
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-3xl font-bold text-blue-600">{summary.statusCounts.upcoming}</div>
            <div className="text-sm font-medium text-blue-700 mt-1">Upcoming</div>
          </div>

          {/* Paid */}
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-600">{summary.statusCounts.paid}</div>
            <div className="text-sm font-medium text-green-700 mt-1">Paid</div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {summary.totalCount === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No bills yet</h3>
          <p className="mt-2 text-sm text-gray-500">Get started by adding your first bill to track your budget.</p>
        </div>
      )}
    </div>
  )
}
