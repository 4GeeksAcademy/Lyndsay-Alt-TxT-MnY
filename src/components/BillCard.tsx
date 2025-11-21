import { formatBillStatus, getStatusColorClass, getDaysUntilDue } from '../utils/billUtils'
import type { Bill } from '../types/bill'

interface BillCardProps {
  bill: Bill
  onMarkPaid: (id: string) => void
  onMarkUnpaid: (id: string) => void
  onEdit: (bill: Bill) => void
  onDelete: (id: string) => void
}

const categoryLabels: Record<string, string> = {
  utilities: 'Utilities',
  rent_mortgage: 'Rent/Mortgage',
  insurance: 'Insurance',
  subscriptions: 'Subscriptions',
  credit_cards: 'Credit Cards',
  loans: 'Loans',
  other: 'Other'
}

export default function BillCard({ bill, onMarkPaid, onMarkUnpaid, onEdit, onDelete }: BillCardProps) {
  const daysUntilDue = getDaysUntilDue(bill)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{bill.name}</h3>
          <p className="text-sm text-gray-500">{categoryLabels[bill.category] || bill.category}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColorClass(bill.status)}`}>
          {formatBillStatus(bill.status)}
        </span>
      </div>

      {/* Amount */}
      <div className="mb-3">
        <p className="text-3xl font-bold text-gray-900">${bill.amount.toFixed(2)}</p>
      </div>

      {/* Details */}
      <div className="space-y-1 mb-4 text-sm text-gray-600">
        <div className="flex justify-between">
          <span className="font-medium">Due Date:</span>
          <span>{new Date(bill.due_date).toLocaleDateString()}</span>
        </div>
        {!bill.payment_date && daysUntilDue >= 0 && (
          <div className="flex justify-between">
            <span className="font-medium">Days Until Due:</span>
            <span className={daysUntilDue <= 3 ? 'text-red-600 font-semibold' : ''}>
              {daysUntilDue} {daysUntilDue === 1 ? 'day' : 'days'}
            </span>
          </div>
        )}
        {bill.payment_date && (
          <div className="flex justify-between">
            <span className="font-medium">Paid On:</span>
            <span className="text-green-600">{new Date(bill.payment_date).toLocaleDateString()}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="font-medium">SMS Reminders:</span>
          <span>{bill.sms_enabled ? '✅ Enabled' : '❌ Disabled'}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        {bill.payment_date ? (
          <button
            onClick={() => onMarkUnpaid(bill.id)}
            className="flex-1 min-w-[120px] bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
          >
            Mark Unpaid
          </button>
        ) : (
          <button
            onClick={() => onMarkPaid(bill.id)}
            className="flex-1 min-w-[120px] bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
          >
            Mark Paid
          </button>
        )}
        <button
          onClick={() => onEdit(bill)}
          className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(bill.id)}
          className="flex-1 min-w-[120px] bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
