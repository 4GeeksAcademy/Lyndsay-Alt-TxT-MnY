import { useForm } from 'react-hook-form';
import type { CreateGiftInput } from '../types/gift';
import { EVENT_TYPES } from '../types/gift';

interface GiftFormProps {
  onSubmit: (data: CreateGiftInput) => Promise<void>;
  initialData?: Partial<CreateGiftInput>;
  isLoading?: boolean;
}

export const GiftForm = ({ onSubmit, initialData, isLoading = false }: GiftFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGiftInput>({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="gift_name" className="block text-sm font-medium text-gray-700 mb-1">
          Gift Name
        </label>
        <input
          id="gift_name"
          type="text"
          {...register('gift_name', {
            required: 'Gift name is required',
            minLength: { value: 2, message: 'Gift name must be at least 2 characters' },
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Nintendo Switch"
          disabled={isLoading}
        />
        {errors.gift_name && (
          <p className="text-red-500 text-sm mt-1">{errors.gift_name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="recipient_name" className="block text-sm font-medium text-gray-700 mb-1">
          Recipient
        </label>
        <input
          id="recipient_name"
          type="text"
          {...register('recipient_name', {
            required: 'Recipient name is required',
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Sarah"
          disabled={isLoading}
        />
        {errors.recipient_name && (
          <p className="text-red-500 text-sm mt-1">{errors.recipient_name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Estimated Amount
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          {...register('amount', {
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be greater than 0' },
            valueAsNumber: true,
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0.00"
          disabled={isLoading}
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="event_type" className="block text-sm font-medium text-gray-700 mb-1">
          Event Type
        </label>
        <select
          id="event_type"
          {...register('event_type', { required: 'Event type is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="">Select an event type...</option>
          {EVENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.icon} {type.label}
            </option>
          ))}
        </select>
        {errors.event_type && (
          <p className="text-red-500 text-sm mt-1">{errors.event_type.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 mb-1">
          Event Date
        </label>
        <input
          id="event_date"
          type="date"
          {...register('event_date', { required: 'Event date is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        {errors.event_date && (
          <p className="text-red-500 text-sm mt-1">{errors.event_date.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          {...register('notes')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Gift ideas, preferences, links..."
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center">
        <input
          id="purchased"
          type="checkbox"
          {...register('purchased')}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          disabled={isLoading}
        />
        <label htmlFor="purchased" className="ml-2 block text-sm text-gray-700">
          Already purchased
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Saving...' : initialData ? 'Update Gift' : 'Add Gift'}
      </button>
    </form>
  );
};
