import { differenceInDays, format } from 'date-fns';
import type { Gift } from '../types/gift';
import { EVENT_TYPES } from '../types/gift';

interface GiftCardProps {
  gift: Gift;
  onEdit: (gift: Gift) => void;
  onDelete: (id: string) => void;
  onTogglePurchased: (id: string, purchased: boolean) => void;
}

export const GiftCard = ({ gift, onEdit, onDelete, onTogglePurchased }: GiftCardProps) => {
  const eventType = EVENT_TYPES.find((type) => type.value === gift.event_type);
  const eventDate = new Date(gift.event_date);
  const today = new Date();
  const daysUntil = differenceInDays(eventDate, today);

  const getDaysUntilText = () => {
    if (daysUntil < 0) {
      return `${Math.abs(daysUntil)} days ago`;
    } else if (daysUntil === 0) {
      return 'Today';
    } else if (daysUntil === 1) {
      return 'Tomorrow';
    } else {
      return `${daysUntil} days away`;
    }
  };

  const getDaysUntilColor = () => {
    if (gift.purchased) return 'text-gray-500';
    if (daysUntil < 0) return 'text-gray-500';
    if (daysUntil <= 7) return 'text-red-600 font-semibold';
    if (daysUntil <= 30) return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow ${gift.purchased ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{eventType?.icon || '🎁'}</span>
          <div>
            <h3 className="font-semibold text-lg">{gift.gift_name}</h3>
            <p className="text-sm text-gray-600">for {gift.recipient_name}</p>
          </div>
        </div>
        {gift.purchased && (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
            ✓ Purchased
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Amount:</span>
          <span className="font-semibold">${gift.amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Event:</span>
          <span>{eventType?.label || gift.event_type}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Date:</span>
          <span>{format(eventDate, 'MMM d, yyyy')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Status:</span>
          <span className={getDaysUntilColor()}>{getDaysUntilText()}</span>
        </div>
        {gift.purchase_date && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Purchased on:</span>
            <span>{format(new Date(gift.purchase_date), 'MMM d, yyyy')}</span>
          </div>
        )}
        {gift.notes && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-600 italic">{gift.notes}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!gift.purchased ? (
          <button
            onClick={() => onTogglePurchased(gift.id, true)}
            className="flex-1 bg-green-600 text-white py-1.5 px-3 rounded text-sm hover:bg-green-700 transition-colors"
          >
            Mark Purchased
          </button>
        ) : (
          <button
            onClick={() => onTogglePurchased(gift.id, false)}
            className="flex-1 bg-gray-600 text-white py-1.5 px-3 rounded text-sm hover:bg-gray-700 transition-colors"
          >
            Mark Unpurchased
          </button>
        )}
        <button
          onClick={() => onEdit(gift)}
          className="flex-1 bg-blue-600 text-white py-1.5 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(gift.id)}
          className="flex-1 bg-red-600 text-white py-1.5 px-3 rounded text-sm hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
