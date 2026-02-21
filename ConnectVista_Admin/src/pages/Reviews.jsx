import { useState } from 'react';
import { Search, Star, Flag } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const mockReviews = [
  { id: '1', service: 'Plumbing', provider: 'Mike Smith', seeker: 'John Doe', rating: 5, comment: 'Excellent service! Very professional and timely.', date: '2024-12-15', status: 'published' },
  { id: '2', service: 'Electrical', provider: 'Tom Brown', seeker: 'Jane Wilson', rating: 4, comment: 'Good work, slightly delayed but overall satisfied.', date: '2024-12-14', status: 'published' },
  { id: '3', service: 'House Cleaning', provider: 'Sarah Davis', seeker: 'Bob Johnson', rating: 2, comment: 'Not satisfied with the work quality.', date: '2024-12-13', status: 'flagged' },
  { id: '4', service: 'Painting', provider: 'Mike Wilson', seeker: 'Alice Brown', rating: 5, comment: 'Amazing job! Will definitely recommend.', date: '2024-12-12', status: 'published' },
  { id: '5', service: 'AC Repair', provider: 'John Smith', seeker: 'Charlie Davis', rating: 3, comment: 'Average service, could be better.', date: '2024-12-11', status: 'published' },
  { id: '6', service: 'Pest Control', provider: 'David Lee', seeker: 'Emma White', rating: 4, comment: 'Good experience overall.', date: '2024-12-10', status: 'published' },
];

export default function Reviews() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const filteredReviews = mockReviews.filter(review => {
    const matchesSearch = 
      review.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.seeker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { key: 'service', header: 'Service' },
    { key: 'provider', header: 'Provider' },
    { key: 'seeker', header: 'Reviewed By' },
    { 
      key: 'rating', 
      header: 'Rating',
      render: (value) => (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
            />
          ))}
          <span className="ml-1 text-sm text-gray-600">({value})</span>
        </div>
      )
    },
    { 
      key: 'comment', 
      header: 'Comment',
      render: (value) => (
        <p className="max-w-xs truncate text-gray-600">{value}</p>
      )
    },
    { key: 'date', header: 'Date' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'published' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {value}
        </span>
      )
    },
  ];

  const handleView = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleFlag = (review) => {
    if (window.confirm('Are you sure you want to flag this review?')) {
      console.log('Flag review:', review.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-3 w-full">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredReviews}
        onEdit={handleView}
        onDelete={handleFlag}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedReview(null);
        }}
        title="Review Details"
      >
        {selectedReview && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < selectedReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-lg font-medium text-gray-800">({selectedReview.rating}/5)</span>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">"{selectedReview.comment}"</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-medium text-gray-800">{selectedReview.service}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Provider</p>
                <p className="font-medium text-gray-800">{selectedReview.provider}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reviewed By</p>
                <p className="font-medium text-gray-800">{selectedReview.seeker}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-800">{selectedReview.date}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
