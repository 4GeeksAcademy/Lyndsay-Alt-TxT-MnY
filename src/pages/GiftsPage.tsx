import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import type { Gift } from '../types/gift';
import type { CreateGiftInput, UpdateGiftInput } from '../types/gift';
import { EVENT_TYPES } from '../types/gift';
import {
  getGifts,
  createGift,
  updateGift,
  deleteGift,
  markGiftAsPurchased,
  markGiftAsUnpurchased,
} from '../services/giftService';
import { GiftList } from '../components/GiftList';
import { GiftForm } from '../components/GiftForm';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

export const GiftsPage = () => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [giftToDelete, setGiftToDelete] = useState<string | null>(null);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPurchased, setFilterPurchased] = useState<string>('all');

  useEffect(() => {
    loadGifts();
  }, []);

  const loadGifts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getGifts();
      setGifts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gifts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: CreateGiftInput) => {
    try {
      setIsSaving(true);
      setError(null);

      if (editingGift) {
        const updated = await updateGift(editingGift.id, data as UpdateGiftInput);
        setGifts(gifts.map((g) => (g.id === updated.id ? updated : g)));
      } else {
        const newGift = await createGift(data);
        setGifts([...gifts, newGift]);
      }

      setIsModalOpen(false);
      setEditingGift(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save gift');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (gift: Gift) => {
    setEditingGift(gift);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setGiftToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!giftToDelete) return;

    try {
      setError(null);
      await deleteGift(giftToDelete);
      setGifts(gifts.filter((g) => g.id !== giftToDelete));
      setIsDeleteDialogOpen(false);
      setGiftToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete gift');
    }
  };

  const handleTogglePurchased = async (id: string, purchased: boolean) => {
    try {
      setError(null);
      const updated = purchased
        ? await markGiftAsPurchased(id)
        : await markGiftAsUnpurchased(id);
      setGifts(gifts.map((g) => (g.id === updated.id ? updated : g)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update gift');
    }
  };

  const handleAddGift = () => {
    setEditingGift(null);
    setIsModalOpen(true);
  };

  // Filter gifts
  const filteredGifts = gifts.filter((gift) => {
    if (filterType !== 'all' && gift.event_type !== filterType) return false;
    if (filterPurchased === 'purchased' && !gift.purchased) return false;
    if (filterPurchased === 'unpurchased' && gift.purchased) return false;
    return true;
  });

  // Calculate dashboard metrics
  const totalBudget = gifts.reduce((sum, gift) => sum + gift.amount, 0);
  const purchasedAmount = gifts
    .filter((gift) => gift.purchased)
    .reduce((sum, gift) => sum + gift.amount, 0);
  const remainingBudget = totalBudget - purchasedAmount;
  const upcomingGifts = gifts.filter((gift) => {
    const eventDate = new Date(gift.event_date);
    const today = new Date();
    const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return !gift.purchased && daysUntil >= 0 && daysUntil <= 30;
  });

  // Group upcoming gifts by month
  const upcomingByMonth = upcomingGifts.reduce((acc, gift) => {
    const month = format(new Date(gift.event_date), 'MMMM yyyy');
    if (!acc[month]) acc[month] = [];
    acc[month].push(gift);
    return acc;
  }, {} as Record<string, Gift[]>);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading gifts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Gift Budget Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Budget</div>
            <div className="text-3xl font-bold text-gray-800">${totalBudget.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Already Purchased</div>
            <div className="text-3xl font-bold text-green-600">${purchasedAmount.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Remaining</div>
            <div className="text-3xl font-bold text-blue-600">${remainingBudget.toFixed(2)}</div>
          </div>
        </div>

        {/* Upcoming Gifts Section */}
        {Object.keys(upcomingByMonth).length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-lg mb-3 text-yellow-900">
              📅 Upcoming Events (Next 30 Days)
            </h3>
            {Object.entries(upcomingByMonth).map(([month, monthGifts]) => (
              <div key={month} className="mb-3">
                <div className="font-medium text-yellow-800 mb-1">{month}</div>
                <ul className="space-y-1 ml-4">
                  {monthGifts.map((gift) => (
                    <li key={gift.id} className="text-sm text-yellow-900">
                      {EVENT_TYPES.find((t) => t.value === gift.event_type)?.icon} {gift.gift_name}{' '}
                      for {gift.recipient_name} - ${gift.amount.toFixed(2)} (
                      {format(new Date(gift.event_date), 'MMM d')})
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Controls Section */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Event Types</option>
            {EVENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>

          <select
            value={filterPurchased}
            onChange={(e) => setFilterPurchased(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Gifts</option>
            <option value="unpurchased">Not Purchased</option>
            <option value="purchased">Purchased</option>
          </select>
        </div>

        <button
          onClick={handleAddGift}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          + Add Gift
        </button>
      </div>

      {/* Gifts List */}
      <GiftList
        gifts={filteredGifts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTogglePurchased={handleTogglePurchased}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGift(null);
        }}
        title={editingGift ? 'Edit Gift' : 'Add New Gift'}
      >
        <GiftForm
          onSubmit={handleSubmit}
          initialData={
            editingGift
              ? {
                  gift_name: editingGift.gift_name,
                  recipient_name: editingGift.recipient_name,
                  amount: editingGift.amount,
                  event_type: editingGift.event_type,
                  event_date: editingGift.event_date,
                  purchased: editingGift.purchased,
                  notes: editingGift.notes || undefined,
                }
              : undefined
          }
          isLoading={isSaving}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Gift"
        message="Are you sure you want to delete this gift? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setGiftToDelete(null);
        }}
      />
    </div>
  );
};
