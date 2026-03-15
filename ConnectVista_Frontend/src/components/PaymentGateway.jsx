import { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Building2, Wallet, X, Check, AlertCircle, Lock } from 'lucide-react';

const PaymentGateway = ({ amount, plan, duration, onSuccess, onClose }) => {
  const [step, setStep] = useState('method'); // method, form, otp, processing, result
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

  // Luhn Algorithm
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

    // Random 20% failure
    const failed = Math.random() < 0.2;

    setTimeout(async () => {
      if (failed) {
        setResult({ success: false, message: 'Payment declined by bank' });
        setStep('result');
      } else {
        const txnId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        setResult({ 
          success: true, 
          transactionId: txnId,
          message: 'Payment successful!'
        });
        setStep('result');
        
        // Call parent success handler
        setTimeout(() => {
          onSuccess({
            transactionId: txnId,
            method,
            cardLast4: method === 'card' ? cardData.number.slice(-4) : null,
            cardType: method === 'card' ? getCardType(cardData.number.replace(/\s/g, '')) : null
          });
        }, 2000);
      }
    }, 2000);
  };

  const cardType = cardData.number ? getCardType(cardData.number.replace(/\s/g, '')) : '';

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999] p-4 animate-fadeIn overflow-y-auto">
      <div className="rounded-2xl shadow-2xl max-w-md w-full my-auto animate-slideUp" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center sticky top-0 z-10" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-color)' }}>Secure Payment</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-color)', opacity: 0.6 }}>
              Demo Gateway - No real transaction
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:opacity-70 transition-all" style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-color)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Amount */}
        <div className="p-6 border-b text-center" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
          <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Amount to Pay</p>
          <p className="text-3xl font-bold mt-1" style={{ color: 'var(--accent-color)' }}>₹{amount.toLocaleString()}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-color)', opacity: 0.6 }}>{plan} - {duration}</p>
        </div>

        {/* Method Selection */}
        {step === 'method' && (
          <div className="p-6 space-y-4">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--text-color)' }}>Select Payment Method</h3>
            
            {[
              { id: 'card', icon: CreditCard, label: 'Credit/Debit Card' },
              { id: 'upi', icon: Smartphone, label: 'UPI' },
              { id: 'netbanking', icon: Building2, label: 'Net Banking' },
              { id: 'wallet', icon: Wallet, label: 'Wallet' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className="w-full p-4 rounded-xl border-2 flex items-center gap-3 hover:opacity-80 transition-all"
                style={{ 
                  borderColor: method === m.id ? 'var(--accent-color)' : 'var(--border-color)',
                  backgroundColor: method === m.id ? 'var(--hover-bg)' : 'var(--bg-color)',
                  color: 'var(--text-color)'
                }}
              >
                <m.icon size={24} style={{ color: 'var(--accent-color)' }} />
                <span className="font-medium" style={{ color: 'var(--text-color)' }}>{m.label}</span>
                {method === m.id && <Check size={20} className="ml-auto" style={{ color: 'var(--accent-color)' }} />}
              </button>
            ))}

            <button
              onClick={() => setStep('form')}
              className="w-full py-3 rounded-xl font-bold text-white mt-6 hover:opacity-90 transition-all"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              Continue
            </button>
          </div>
        )}

        {/* Card Form */}
        {step === 'form' && method === 'card' && (
          <div className="p-6 space-y-4">
            <button onClick={() => setStep('method')} className="text-sm mb-2" style={{ color: 'var(--accent-color)' }}>← Back</button>
            
            {/* Card Preview */}
            <div className="p-6 rounded-xl text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <div className="absolute top-4 right-4 text-xs opacity-70">{cardType}</div>
              <div className="mt-8 text-lg tracking-wider">{cardData.number || '•••• •••• •••• ••••'}</div>
              <div className="flex justify-between mt-4">
                <div>
                  <div className="text-xs opacity-70">Card Holder</div>
                  <div className="text-sm">{cardData.holderName || 'YOUR NAME'}</div>
                </div>
                <div>
                  <div className="text-xs opacity-70">Expires</div>
                  <div className="text-sm">{cardData.expiry || 'MM/YY'}</div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>Card Holder Name</label>
              <input
                type="text"
                value={cardData.holderName}
                onChange={(e) => setCardData({...cardData, holderName: e.target.value.toUpperCase()})}
                className="w-full p-3 rounded-lg border"
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
                className="w-full p-3 rounded-lg border"
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
                  className="w-full p-3 rounded-lg border"
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
                  className="w-full p-3 rounded-lg border"
                  style={{ backgroundColor: 'var(--bg-color)', borderColor: errors.cvv ? '#ef4444' : 'var(--border-color)', color: 'var(--text-color)' }}
                  placeholder="123"
                />
                {errors.cvv && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.cvv}</p>}
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={cardData.saveCard}
                onChange={(e) => setCardData({...cardData, saveCard: e.target.checked})}
                className="w-4 h-4"
              />
              <span className="text-sm" style={{ color: 'var(--text-color)' }}>Save card for future payments</span>
            </label>

            <button
              onClick={handlePay}
              className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              <Lock size={18} />
              Pay ₹{amount.toLocaleString()}
            </button>
          </div>
        )}

        {/* Other Methods Form */}
        {step === 'form' && method !== 'card' && (
          <div className="p-6 space-y-4">
            <button onClick={() => setStep('method')} className="text-sm mb-2" style={{ color: 'var(--accent-color)' }}>← Back</button>
            <div className="text-center py-8">
              <p style={{ color: 'var(--text-color)', opacity: 0.7 }}>Enter your {method.toUpperCase()} details</p>
              <input
                type="text"
                className="w-full p-3 rounded-lg border mt-4"
                style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
                placeholder={method === 'upi' ? 'yourname@upi' : method === 'netbanking' ? 'Select Bank' : 'Select Wallet'}
              />
            </div>
            <button
              onClick={handlePay}
              className="w-full py-3 rounded-xl font-bold text-white hover:opacity-90 transition-all"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              Pay ₹{amount.toLocaleString()}
            </button>
          </div>
        )}

        {/* Processing */}
        {step === 'processing' && (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mb-4" style={{ borderColor: 'var(--accent-color)', borderTopColor: 'transparent' }} />
            <p className="font-medium" style={{ color: 'var(--text-color)' }}>{processing}</p>
          </div>
        )}

        {/* OTP */}
        {step === 'otp' && (
          <div className="p-6 space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--hover-bg)' }}>
                <Smartphone size={32} style={{ color: 'var(--accent-color)' }} />
              </div>
              <h3 className="font-bold text-lg" style={{ color: 'var(--text-color)' }}>Enter OTP</h3>
              <p className="text-sm mt-2" style={{ color: 'var(--text-color)', opacity: 0.6 }}>
                OTP sent to your registered mobile
              </p>
              <p className="text-xs mt-2 px-4 py-2 rounded-lg inline-block" style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--accent-color)' }}>
                Demo OTP: 123456
              </p>
            </div>

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full p-4 rounded-lg border text-center text-2xl tracking-widest"
              style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
              placeholder="000000"
            />

            <button
              onClick={handleOtpSubmit}
              disabled={otp.length !== 6}
              className="w-full py-3 rounded-xl font-bold text-white disabled:opacity-50 hover:opacity-90 transition-all"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              Verify & Pay
            </button>
          </div>
        )}

        {/* Result */}
        {step === 'result' && (
          <div className="p-8 text-center">
            {result.success ? (
              <>
                <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center animate-bounce" style={{ backgroundColor: '#10b981' }}>
                  <Check size={40} className="text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--text-color)' }}>Payment Successful!</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-color)', opacity: 0.6 }}>{result.message}</p>
                <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: 'var(--hover-bg)' }}>
                  <p className="text-xs" style={{ color: 'var(--text-color)', opacity: 0.6 }}>Transaction ID</p>
                  <p className="font-mono font-bold" style={{ color: 'var(--text-color)' }}>{result.transactionId}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#ef4444' }}>
                  <X size={40} className="text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--text-color)' }}>Payment Failed</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-color)', opacity: 0.6 }}>{result.message}</p>
                <button
                  onClick={() => { setStep('method'); setOtp(''); setResult(null); }}
                  className="px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-all"
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
  );
};

export default PaymentGateway;
