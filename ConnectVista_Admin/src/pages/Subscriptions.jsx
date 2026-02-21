import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const mockSubscriptions = [
  { id: '1', name: 'Basic', price: 0, duration: 'Forever', features: ['Basic profile', 'Up to 5 bookings/month', 'Email support'], providers: 150, status: 'active' },
  { id: '2', name: 'Professional', price: 29, duration: 'Monthly', features: ['Enhanced profile', 'Unlimited bookings', 'Priority support', 'Analytics'], providers: 85, status: 'active' },
  { id: '3', name: 'Business', price: 79, duration: 'Monthly', features: ['Premium profile', 'Unlimited bookings', '24/7 support', 'Advanced analytics', 'Featured listings'], providers: 42, status: 'active' },
  { id: '4', name: 'Enterprise', price: 199, duration: 'Monthly', features: ['All features', 'Dedicated manager', 'Custom branding', 'API access'], providers: 15, status: 'active' },
];

export default function Subscriptions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const columns = [
    { 
      key: 'name', 
      header: 'Plan Name',
      render: (value) => <span className="font-semibold text-gray-800">{value}</span>
    },
    { 
      key: 'price', 
      header: 'Price',
      render: (value) => <span className="font-medium">${value}{value > 0 ? '/mo' : ''}</span>
    },
    { key: 'duration', header: 'Duration' },
    { 
      key: 'features', 
      header: 'Features',
      render: (value) => (
        <span className="text-sm text-gray-600">{value.length} features</span>
      )
    },
    { 
      key: 'providers', 
      header: 'Active Providers',
      render: (value) => <span className="text-primary-600 font-medium">{value}</span>
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {value}
        </span>
      )
    },
  ];

  const handleEdit = (subscription) => {
    setSelectedSubscription(subscription);
    setIsModalOpen(true);
  };

  const handleDelete = (subscription) => {
    if (window.confirm(`Are you sure you want to delete the ${subscription.name} plan?`)) {
      console.log('Delete subscription:', subscription.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-4 h-4" />
          Add Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockSubscriptions.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{plan.name}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                plan.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {plan.status}
              </span>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-800">${plan.price}</span>
              <span className="text-gray-500">/{plan.duration === 'Forever' ? 'lifetime' : 'month'}</span>
            </div>
            <ul className="space-y-2 mb-4">
              {plan.features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  {feature}
                </li>
              ))}
              {plan.features.length > 3 && (
                <li className="text-sm text-primary-600">+{plan.features.length - 3} more</li>
              )}
            </ul>
            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={() => handleEdit(plan)}
                className="flex-1 px-3 py-2 text-sm text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(plan)}
                className="px-3 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSubscription(null);
        }}
        title="Edit Subscription Plan"
      >
        {selectedSubscription && (
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
              <input
                type="text"
                defaultValue={selectedSubscription.name}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  defaultValue={selectedSubscription.price}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <select
                  defaultValue={selectedSubscription.duration}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Forever">Forever</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
              <textarea
                defaultValue={selectedSubscription.features.join('\n')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                defaultValue={selectedSubscription.status}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Subscription Plan"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
            <input
              type="text"
              placeholder="Enter plan name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="Forever">Forever</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
            <textarea
              placeholder="Enter features (one per line)"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Add Plan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
