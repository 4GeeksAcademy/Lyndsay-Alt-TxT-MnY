import type { Gift } from '../types/gift';
import { GiftCard } from './GiftCard';

interface GiftListProps {
  gifts: Gift[];
  onEdit: (gift: Gift) => void;
  onDelete: (id: string) => void;
  onTogglePurchased: (id: string, purchased: boolean) => void;
}

export const GiftList = ({ gifts, onEdit, onDelete, onTogglePurchased }: GiftListProps) => {
  if (gifts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500 text-lg">No gifts to display</p>
        <p className="text-gray-400 text-sm mt-2">
          Add your first gift to start tracking your gift budget
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {gifts.map((gift) => (
        <GiftCard
          key={gift.id}
          gift={gift}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePurchased={onTogglePurchased}
        />
      ))}
    </div>
  );
};
