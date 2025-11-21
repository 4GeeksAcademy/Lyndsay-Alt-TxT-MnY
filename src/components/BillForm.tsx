import { useForm } from 'react-hook-form'
import type { CreateBillInput, BillCategory } from '../types/bill'

interface BillFormProps {
  onSubmit: (data: CreateBillInput) => void
  onCancel?: () => void
  defaultValues?: Partial<CreateBillInput>
  isLoading?: boolean
}

const categories: { value: BillCategory; label: string }[] = [
  { value: 'utilities', label: 'Utilities' },
  { value: 'rent_mortgage', label: 'Rent/Mortgage' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'subscriptions', label: 'Subscriptions' },
  { value: 'credit_cards', label: 'Credit Cards' },
  { value: 'loans', label: 'Loans' },
  { value: 'other', label: 'Other' }
]

export default function BillForm({ onSubmit, onCancel, defaultValues, isLoading }: BillFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateBillInput>({
    defaultValues: {
      sms_enabled: false,
      ...defaultValues
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Bill Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Bill Name *
        </label>
        <input
          {...register('name', { 
            required: 'Bill name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' }
          })}
          type="text"
          id="name"
          placeholder="e.g., Electric Bill, Netflix"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount ($) *
        </label>
        <input
          {...register('amount', { 
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be greater than 0' },
            valueAsNumber: true
          })}
          type="number"
          step="0.01"
          id="amount"
          placeholder="0.00"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
          Due Date *
        </label>
        <input
          {...register('due_date', { 
            required: 'Due date is required'
          })}
          type="date"
          id="due_date"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.due_date && (
          <p className="mt-1 text-sm text-red-600">{errors.due_date.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <select
          {...register('category', { 
            required: 'Category is required'
          })}
          id="category"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a category...</option>
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      {/* SMS Reminder Toggle */}
      <div className="flex items-center">
        <input
          {...register('sms_enabled')}
          type="checkbox"
          id="sms_enabled"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="sms_enabled" className="ml-2 block text-sm text-gray-700">
          Enable SMS reminders for this bill
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          {isLoading ? 'Saving...' : 'Save Bill'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
