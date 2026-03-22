import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { supportService } from '../services/supportService';

const NeedSupportModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    attachments: []
  });

  const categories = [
    { value: 'technical', label: 'Technical Issue' },
    { value: 'billing', label: 'Billing & Payment' },
    { value: 'account', label: 'Account' },
    { value: 'booking', label: 'Booking Issue' },
    { value: 'verification', label: 'Verification' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: '#4CAF50' },
    { value: 'medium', label: 'Medium', color: '#FFA500' },
    { value: 'high', label: 'High', color: '#FF6B6B' },
    { value: 'urgent', label: 'Urgent', color: '#DC143C' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.description.length < 10) {
      toast.error('Description must be at least 10 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await supportService.createSupportRequest({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        attachments: formData.attachments
      });

      if (response.success) {
        toast.success(response.message);
        setFormData({
          title: '',
          description: '',
          category: 'other',
          priority: 'medium',
          attachments: []
        });
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create support request');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 10 }}>
      <div
        className="rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: '#000000' }}>
                Request Support
              </h2>
              <p style={{ color: '#666666' }}>
                Let us know how we can help you
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-2xl hover:opacity-70"
              style={{ color: '#000000' }}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block font-semibold mb-2" style={{ color: '#000000' }}>
                Subject <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg border"
                style={{
                  backgroundColor: '#F8F8F8',
                  borderColor: '#E0E0E0',
                  color: '#000000'
                }}
                placeholder="What do you need help with?"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold mb-2" style={{ color: '#000000' }}>
                Description <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <textarea
                required
                className="w-full px-4 py-3 rounded-lg border resize-none"
                style={{
                  backgroundColor: '#F8F8F8',
                  borderColor: '#E0E0E0',
                  color: '#000000'
                }}
                rows="5"
                placeholder="Please describe your issue in detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <p style={{ color: '#666666', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                {formData.description.length} / 5000 characters
              </p>
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#000000' }}>
                  Category
                </label>
                <select
                  className="w-full px-4 py-3 rounded-lg border"
                  style={{
                    backgroundColor: '#F8F8F8',
                    borderColor: '#E0E0E0',
                    color: '#000000'
                  }}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2" style={{ color: '#000000' }}>
                  Priority
                </label>
                <select
                  className="w-full px-4 py-3 rounded-lg border"
                  style={{
                    backgroundColor: '#F8F8F8',
                    borderColor: '#E0E0E0',
                    color: '#000000'
                  }}
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  {priorities.map((pri) => (
                    <option key={pri.value} value={pri.value}>
                      {pri.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Info Box */}
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: '#E8F5E9',
                borderColor: '#C8E6C9',
                color: '#2E7D32'
              }}
            >
              <p style={{ fontSize: '0.875rem' }}>
                <strong>💡 Tip:</strong> Provide as much detail as possible to help our team resolve your issue faster.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-lg border font-semibold"
                style={{
                  borderColor: '#E0E0E0',
                  color: '#000000',
                  backgroundColor: '#F8F8F8'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-lg font-semibold text-white flex items-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NeedSupportModal;
