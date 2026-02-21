import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import API from '../../services/api';

const plans = [
  { name: 'Basic', monthly: 499, yearly: 4999, features: ['10 Bookings/month', 'Basic Support', 'Profile Listing'] },
  { name: 'Professional', monthly: 999, yearly: 9999, features: ['50 Bookings/month', 'Priority Support', 'Featured Listing', 'Analytics'] },
  { name: 'Business', monthly: 1999, yearly: 19999, features: ['Unlimited Bookings', '24/7 Support', 'Top Listing', 'Advanced Analytics', 'Marketing Tools'] },
  { name: 'Enterprise', monthly: 4999, yearly: 49999, features: ['Everything in Business', 'Dedicated Manager', 'Custom Integration', 'API Access'] }
];

export default function ServiceProviderSubscription() {
  const navigate = useNavigate();
  const [duration, setDuration] = useState('monthly');
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const res = await API.get('/subscriptions/my-subscription');
      if (res.data.success && res.data.data) {
        setCurrentSubscription(res.data.data);
        setDuration(res.data.data.duration);
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Cancel subscription?')) return;
    try {
      await API.post('/subscriptions/cancel');
      toast.success('Subscription cancelled');
      setCurrentSubscription(null);
    } catch (err) {
      toast.error('Failed to cancel');
    }
  };

  const handleSelectPlan = (planName) => {
    const plan = plans.find(p => p.name === planName);
    const amount = duration === 'yearly' ? plan.yearly : plan.monthly;
    
    navigate('/payment', {
      state: { amount, plan: planName, duration }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: 'var(--accent-color)' }} />
      </div>
    );
  }

  // If user has active subscription, show only that plan details
  if (currentSubscription) {
    const currentPlan = plans.find(p => p.name === currentSubscription.plan);
    const amount = currentSubscription.duration === 'yearly' ? currentPlan.yearly : currentPlan.monthly;

    return (
      <div className="min-h-screen py-12 px-4" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold mb-4" style={{ color: 'var(--text-color)' }}>
              Your Active Subscription
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Manage your current plan</p>
          </div>

          <div className="rounded-2xl shadow-2xl p-8 border-2" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--accent-color)' }}>
            <div className="text-center mb-6">
              <div className="inline-block px-4 py-2 rounded-full mb-4" style={{ backgroundColor: 'var(--success-light)' }}>
                <span className="font-bold" style={{ color: 'var(--success-dark)' }}>✓ ACTIVE</span>
              </div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-color)' }}>{currentSubscription.plan} Plan</h2>
              <p className="text-5xl font-extrabold mb-4" style={{ color: 'var(--accent-color)' }}>₹{amount.toLocaleString()}</p>
              <p className="text-lg" style={{ color: 'var(--text-color)', opacity: 0.7 }}>per {currentSubscription.duration === 'yearly' ? 'year' : 'month'}</p>
            </div>

            <div className="border-t border-b py-6 my-6" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-color)' }}>Plan Features:</h3>
              <ul className="space-y-3">
                {currentPlan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3" style={{ color: 'var(--text-color)' }}>
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--hover-bg)' }}>
              <div className="flex justify-between items-center">
                <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>Subscription Started:</span>
                <span className="font-semibold" style={{ color: 'var(--text-color)' }}>{new Date(currentSubscription.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>Expires On:</span>
                <span className="font-semibold" style={{ color: 'var(--text-color)' }}>{new Date(currentSubscription.endDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setCurrentSubscription(null);
                  setLoading(false);
                }}
                className="py-4 rounded-xl font-bold text-white hover:opacity-90 transition-all"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                Upgrade Plan
              </button>
              <button
                onClick={handleCancel}
                className="py-4 rounded-xl font-bold hover:opacity-90 transition-all"
                style={{ backgroundColor: '#ef4444', color: 'white' }}
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No active subscription - show all plans
  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4" style={{ color: 'var(--text-color)' }}>
            Choose Your Plan
          </h1>
          <p className="text-xl" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Select the perfect plan for your business</p>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setDuration('monthly')}
            className="px-10 py-4 rounded-xl font-bold text-lg transition shadow-xl"
            style={duration === 'monthly' ? { backgroundColor: 'var(--accent-color)', color: 'white' } : { backgroundColor: 'var(--card-bg)', color: 'var(--text-color)', border: '2px solid var(--border-color)' }}
          >
            Monthly
          </button>
          <button
            onClick={() => setDuration('yearly')}
            className="px-10 py-4 rounded-xl font-bold text-lg transition shadow-xl"
            style={duration === 'yearly' ? { backgroundColor: 'var(--accent-color)', color: 'white' } : { backgroundColor: 'var(--card-bg)', color: 'var(--text-color)', border: '2px solid var(--border-color)' }}
          >
            Yearly <span className="text-sm ml-1">(Save 17%)</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, idx) => (
            <div 
              key={plan.name} 
              className="rounded-2xl shadow-xl p-8 border-2 hover:shadow-2xl transition transform hover:scale-105"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: idx === 1 ? 'var(--accent-color)' : 'var(--border-color)' }}
            >
              {idx === 1 && (
                <div className="text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4" style={{ backgroundColor: 'var(--accent-color)' }}>
                  POPULAR
                </div>
              )}
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>{plan.name}</h3>
              <div className="mb-6">
                <p className="text-5xl font-extrabold" style={{ color: 'var(--text-color)' }}>
                  ₹{(duration === 'yearly' ? plan.yearly : plan.monthly).toLocaleString()}
                </p>
                <p className="mt-2 font-medium" style={{ color: 'var(--text-color)', opacity: 0.6 }}>per {duration === 'yearly' ? 'year' : 'month'}</p>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3" style={{ color: 'var(--text-color)' }}>
                    <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelectPlan(plan.name)}
                className="w-full py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition text-white hover:opacity-90"
                style={{ backgroundColor: idx === 1 ? 'var(--accent-color)' : '#111827' }}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
