import { useEffect, useState } from 'react';
import { Crown, Calendar } from 'lucide-react';
import API from '../services/api';

export default function SubscriptionBadge() {
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const fetchSub = async () => {
      try {
        const res = await API.get('/subscriptions/my-subscription');
        if (res.data.success && res.data.data) {
          setSubscription(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSub();
  }, []);

  if (!subscription) return null;

  return (
    <div className="p-4 rounded-xl border-2" style={{ backgroundColor: 'var(--success-light)', borderColor: 'var(--accent-color)' }}>
      <div className="flex items-center gap-2 mb-2">
        <Crown size={20} style={{ color: 'var(--accent-color)' }} />
        <span className="font-bold" style={{ color: 'var(--text-color)' }}>{subscription.plan} Plan</span>
      </div>
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
        <Calendar size={16} />
        <span>Expires: {new Date(subscription.endDate).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
