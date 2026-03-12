import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Smartphone, Building2, Wallet, X, Check, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import API from '../services/api';

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount, plan, duration, isPreSubscription, originalAmount } = location.state || {};

  const [step, setStep] = useState('method');
  const [method, setMethod] = useState('card');
  const [processing, setProcessing] = useState('');
  const [otp, setOtp] = useState('');
  const [result, setResult] = useState(null);
  
  const [cardData, setCardData] = useState({
    holderName: '',
    number: '',
    expiry: '',
    cvv: '',
    saveCard: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!amount || !plan || !duration) {
      navigate('/service-provider/subscription');
    }
  }, [amount, plan, duration, navigate]);

  const validateCard = (num) => {
    const arr = num.split('').reverse().map(x => parseInt(x));
    const sum = arr.reduce((acc, val, idx) => {
      if (idx % 2 !== 0) {
        val *= 2;
        if (val > 9) val -= 9;
      }
      return acc + val;
    }, 0);
    return sum % 10 === 0;
  };

  const getCardType = (num) => {
    if (num.startsWith('4')) return 'Visa';
    if (num.startsWith('5')) return 'Mastercard';
    if (num.startsWith('6')) return 'RuPay';
    return 'Card';
  };

  const formatCardNumber = (val) => {
    return val.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    return val.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substr(0, 5);
  };

  const validateForm = () => {
    const errs = {};
    const cardNum = cardData.number.replace(/\s/g, '');
    
    if (!cardData.holderName.trim()) errs.holderName = 'Required';
    if (cardNum.length !== 16) errs.number = 'Invalid card number';
    else if (!validateCard(cardNum)) errs.number = 'Invalid card';
    
    const [mm, yy] = cardData.expiry.split('/');
    if (!mm || !yy) errs.expiry = 'Required';
    else {
      const now = new Date();
      const expiry = new Date(2000 + parseInt(yy), parseInt(mm) - 1);
      if (expiry < now) errs.expiry = 'Card expired';
    }
    
    if (cardData.cvv.length !== 3) errs.cvv = 'Invalid CVV';
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePay = () => {
    if (method === 'card' && !validateForm()) return;
    setStep('processing');
    
    const steps = ['Connecting to bank...', 'Verifying details...', 'Requesting OTP...'];
    let i = 0;
    const interval = setInterval(() => {
      setProcessing(steps[i]);
      i++;
      if (i === steps.length) {
        clearInterval(interval);
        setTimeout(() => setStep('otp'), 500);
      }
    }, 1000);
  };

  const handleOtpSubmit = async () => {
    if (otp !== '123456') {
      setResult({ success: false, message: 'Invalid OTP' });
      setStep('result');
      return;
    }

    setStep('processing');
    setProcessing('Processing payment...');

    setTimeout(async () => {
      const txnId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      setResult({ 
        success: true, 
        transactionId: txnId,
        message: 'Payment successful!'
      });
      setStep('result');
      
      try {
        const token = localStorage.getItem('token');
        console.log('💳 Before API call - Token:', token);
        
        const response = await API.post('/subscriptions/subscribe', {
          plan,
          duration,
          isPreSubscription,
          paymentDetails: {
            transactionId: txnId,
            method,
            cardLast4: method === 'card' ? cardData.number.slice(-4) : null,
            cardType: method === 'card' ? getCardType(cardData.number.replace(/\s/g, '')) : null
          }
        });
        
        console.log('✅ Subscription API response:', response.data);
        
        setTimeout(() => {
          toast.success('Subscription activated!');
          navigate('/service-provider/subscription');
        }, 2000);
      } catch (err) {
        toast.error('Failed to activate subscription');
      }
    }, 2000);
  };

  const cardType = cardData.number ? getCardType(cardData.number.replace(/\s/g, '')) : '';

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={() => navigate('/service-provider/subscription')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-all"
            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }}
          >
            <ArrowLeft size={20} />
            <span>Back to Plans</span>
          </button>
          <div className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-color)' }}>
            🔒 Secure Payment
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          {/* Amount Section */}
          <div className="p-8 text-center border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
            <p className="text-sm mb-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Amount to Pay</p>
            {isPreSubscription ? (
              <div className="flex flex-col items-center">
                <p className="text-xl line-through text-red-500 opacity-60">₹{originalAmount?.toLocaleString()}</p>
                <div className="flex items-center gap-3">
                  <p className="text-5xl font-bold mb-2" style={{ color: 'var(--accent-color)' }}>₹{amount?.toLocaleString()}</p>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-sm font-bold animate-bounce">-20% OFF</span>
                </div>
                <p className="text-sm font-bold text-green-600 mb-2">Pre-subscription Discount Applied!</p>
              </div>
            ) : (
              <p className="text-5xl font-bold mb-2" style={{ color: 'var(--accent-color)' }}>₹{amount?.toLocaleString()}</p>
            )}
            <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.6 }}>{plan} Plan - {duration}</p>
            <div className="mt-4 inline-block px-4 py-2 rounded-lg text-xs" style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--accent-color)' }}>
              Demo Payment Gateway - No real transaction
            </div>
          </div>

          {/* Method Selection */}
          {step === 'method' && (
            <div className="p-8 space-y-4">
              <h3 className="font-semibold text-lg mb-4" style={{ color: 'var(--text-color)' }}>Select Payment Method</h3>
              
              {[
                { id: 'card', icon: CreditCard, label: 'Credit/Debit Card' },
                { id: 'upi', icon: Smartphone, label: 'UPI' },
                { id: 'netbanking', icon: Building2, label: 'Net Banking' },
                { id: 'wallet', icon: Wallet, label: 'Wallet' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className="w-full p-5 rounded-xl border-2 flex items-center gap-4 hover:opacity-80 transition-all"
                  style={{ 
                    borderColor: method === m.id ? 'var(--accent-color)' : 'var(--border-color)',
                    backgroundColor: method === m.id ? 'var(--hover-bg)' : 'var(--bg-color)',
                    color: 'var(--text-color)'
                  }}
                >
                  <m.icon size={28} style={{ color: 'var(--accent-color)' }} />
                  <span className="font-medium text-lg">{m.label}</span>
                  {method === m.id && <Check size={24} className="ml-auto" style={{ color: 'var(--accent-color)' }} />}
                </button>
              ))}

              <button
                onClick={() => setStep('form')}
                className="w-full py-4 rounded-xl font-bold text-white text-lg mt-6 hover:opacity-90 transition-all"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                Continue
              </button>
            </div>
          )}

          {/* Card Form */}
          {step === 'form' && method === 'card' && (
            <div className="p-8 space-y-5">
              <button onClick={() => setStep('method')} className="text-sm mb-2 hover:opacity-80" style={{ color: 'var(--accent-color)' }}>← Back</button>
              
              {/* Card Preview */}
              <div className="p-8 rounded-xl text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <div className="absolute top-4 right-4 text-sm opacity-80">{cardType}</div>
                <div className="mt-8 text-2xl tracking-wider font-mono">{cardData.number || '•••• •••• •••• ••••'}</div>
                <div className="flex justify-between mt-6">
                  <div>
                    <div className="text-xs opacity-70">Card Holder</div>
                    <div className="text-base mt-1">{cardData.holderName || 'YOUR NAME'}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-70">Expires</div>
                    <div className="text-base mt-1">{cardData.expiry || 'MM/YY'}</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>Card Holder Name</label>
                <input
                  type="text"
                  value={cardData.holderName}
                  onChange={(e) => setCardData({...cardData, holderName: e.target.value.toUpperCase()})}
                  className="w-full p-4 rounded-lg border text-lg"
                  style={{ backgroundColor: 'var(--bg-color)', borderColor: errors.holderName ? '#ef4444' : 'var(--border-color)', color: 'var(--text-color)' }}
                  placeholder="JOHN DOE"
                />
                {errors.holderName && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.holderName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>Card Number</label>
                <input
                  type="text"
                  value={cardData.number}
                  onChange={(e) => setCardData({...cardData, number: formatCardNumber(e.target.value.replace(/\D/g, '').substr(0, 16))})}
                  className="w-full p-4 rounded-lg border text-lg font-mono"
                  style={{ backgroundColor: 'var(--bg-color)', borderColor: errors.number ? '#ef4444' : 'var(--border-color)', color: 'var(--text-color)' }}
                  placeholder="1234 5678 9012 3456"
                />
                {errors.number && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.number}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>Expiry</label>
                  <input
                    type="text"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({...cardData, expiry: formatExpiry(e.target.value)})}
                    className="w-full p-4 rounded-lg border text-lg"
                    style={{ backgroundColor: 'var(--bg-color)', borderColor: errors.expiry ? '#ef4444' : 'var(--border-color)', color: 'var(--text-color)' }}
                    placeholder="MM/YY"
                  />
                  {errors.expiry && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.expiry}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>CVV</label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cardData.cvv}
                    onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '')})}
                    className="w-full p-4 rounded-lg border text-lg"
                    style={{ backgroundColor: 'var(--bg-color)', borderColor: errors.cvv ? '#ef4444' : 'var(--border-color)', color: 'var(--text-color)' }}
                    placeholder="123"
                  />
                  {errors.cvv && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.cvv}</p>}
                </div>
              </div>

              <button
                onClick={handlePay}
                className="w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                <Lock size={20} />
                Pay ₹{amount?.toLocaleString()}
              </button>
            </div>
          )}

          {/* Other Methods Form */}
          {step === 'form' && method !== 'card' && (
            <div className="p-8 space-y-4">
              <button onClick={() => setStep('method')} className="text-sm mb-2" style={{ color: 'var(--accent-color)' }}>← Back</button>
              <div className="text-center py-8">
                <p className="mb-4" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Enter your {method.toUpperCase()} details</p>
                <input
                  type="text"
                  className="w-full p-4 rounded-lg border text-lg"
                  style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
                  placeholder={method === 'upi' ? 'yourname@upi' : method === 'netbanking' ? 'Select Bank' : 'Select Wallet'}
                />
              </div>
              <button
                onClick={handlePay}
                className="w-full py-4 rounded-xl font-bold text-white text-lg hover:opacity-90 transition-all"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                Pay ₹{amount?.toLocaleString()}
              </button>
            </div>
          )}

          {/* Processing */}
          {step === 'processing' && (
            <div className="p-16 text-center">
              <div className="inline-block animate-spin rounded-full h-20 w-20 border-4 border-t-transparent mb-6" style={{ borderColor: 'var(--accent-color)', borderTopColor: 'transparent' }} />
              <p className="font-medium text-lg" style={{ color: 'var(--text-color)' }}>{processing}</p>
            </div>
          )}

          {/* OTP */}
          {step === 'otp' && (
            <div className="p-8 space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--hover-bg)' }}>
                  <Smartphone size={40} style={{ color: 'var(--accent-color)' }} />
                </div>
                <h3 className="font-bold text-2xl mb-2" style={{ color: 'var(--text-color)' }}>Enter OTP</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-color)', opacity: 0.6 }}>
                  OTP sent to your registered mobile
                </p>
                <p className="text-sm px-4 py-2 rounded-lg inline-block" style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--accent-color)' }}>
                  Demo OTP: 123456
                </p>
              </div>

              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full p-5 rounded-lg border text-center text-3xl tracking-widest font-mono"
                style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
                placeholder="000000"
              />

              <button
                onClick={handleOtpSubmit}
                disabled={otp.length !== 6}
                className="w-full py-4 rounded-xl font-bold text-white text-lg disabled:opacity-50 hover:opacity-90 transition-all"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                Verify & Pay
              </button>
            </div>
          )}

          {/* Result */}
          {step === 'result' && (
            <div className="p-12 text-center">
              {result.success ? (
                <>
                  <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce" style={{ backgroundColor: '#10b981' }}>
                    <Check size={50} className="text-white" />
                  </div>
                  <h3 className="font-bold text-3xl mb-3" style={{ color: 'var(--text-color)' }}>Payment Successful!</h3>
                  <p className="text-base mb-6" style={{ color: 'var(--text-color)', opacity: 0.6 }}>{result.message}</p>
                  <div className="p-6 rounded-lg mb-6" style={{ backgroundColor: 'var(--hover-bg)' }}>
                    <p className="text-sm mb-2" style={{ color: 'var(--text-color)', opacity: 0.6 }}>Transaction ID</p>
                    <p className="font-mono font-bold text-lg" style={{ color: 'var(--text-color)' }}>{result.transactionId}</p>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Redirecting to subscription page...</p>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#ef4444' }}>
                    <X size={50} className="text-white" />
                  </div>
                  <h3 className="font-bold text-3xl mb-3" style={{ color: 'var(--text-color)' }}>Payment Failed</h3>
                  <p className="text-base mb-6" style={{ color: 'var(--text-color)', opacity: 0.6 }}>{result.message}</p>
                  <button
                    onClick={() => { setStep('method'); setOtp(''); setResult(null); }}
                    className="px-8 py-3 rounded-lg font-medium text-lg hover:opacity-90 transition-all"
                    style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
                  >
                    Retry Payment
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
