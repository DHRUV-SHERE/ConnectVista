import { useState, useEffect } from 'react';
import { 
  Wallet, IndianRupee, TrendingUp, History, 
  ArrowUpRight, ArrowDownRight, CreditCard, Landmark, 
  Loader2, Plus, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { walletAPI } from '../../services/walletAPI';
import { useSocket } from '../../contexts/SocketContext';
import PaymentGateway from '../../components/PaymentGateway';

const ServiceProviderWallet = () => {
  const { markCategoryAsRead } = useSocket();
  const [loading, setLoading] = useState(true);

  // Mark payment notifications as read
  useEffect(() => {
    markCategoryAsRead('payment');
  }, [markCategoryAsRead]);
  const [walletDetails, setWalletDetails] = useState({
    walletBalance: 0,
    pendingEarnings: 0,
    transactions: []
  });
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchWalletDetails();
  }, []);

  const fetchWalletDetails = async () => {
    try {
      setLoading(true);
      const response = await walletAPI.getWalletDetails();
      if (response.success) setWalletDetails(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleTopUpInitiate = (e) => {
    e.preventDefault();
    if (!topUpAmount || topUpAmount <= 0) return;
    setShowTopUpModal(false);
    setShowPaymentGateway(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      setIsProcessing(true);
      const response = await walletAPI.topUpWallet(topUpAmount);
      if (response.success) {
        toast.success('Wallet topped up successfully!');
        setShowPaymentGateway(false);
        setTopUpAmount('');
        fetchWalletDetails();
      }
    } catch (error) {
      toast.error(error.message || 'Top-up recording failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayout = async () => {
    if (walletDetails.pendingEarnings <= 0) {
      toast.error('No earnings available for payout');
      return;
    }

    if (!window.confirm(`Request payout for ₹${walletDetails.pendingEarnings}?`)) return;

    try {
      setIsProcessing(true);
      const response = await walletAPI.requestPayout();
      if (response.success) {
        toast.success('Payout request submitted successfully!');
        fetchWalletDetails();
      }
    } catch (error) {
      toast.error(error.message || 'Payout request failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-8" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Wallet & Payments</h1>
          <p className="opacity-60">Manage your earnings, wallet balance, and payouts</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowTopUpModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            style={{ backgroundColor: 'var(--accent-color)' }}
          >
            <Plus size={20} /> Top Up Wallet
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Wallet Balance (Prepaid for Cash) */}
        <div className="p-6 rounded-2xl border bg-white shadow-sm relative overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Wallet size={24} />
            </div>
            {walletDetails.walletBalance < 100 && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full uppercase">
                <AlertCircle size={12} /> Low Balance
              </div>
            )}
          </div>
          <h3 className="text-sm opacity-60 font-medium">Prepaid Wallet Balance</h3>
          <p className="text-3xl font-bold mt-1">₹{walletDetails.walletBalance.toLocaleString()}</p>
          <p className="text-xs opacity-40 mt-2">Used for platform fees on cash payments</p>
        </div>

        {/* Pending Earnings (Online) */}
        <div className="p-6 rounded-2xl border bg-white shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <button 
              onClick={handlePayout}
              disabled={isProcessing || walletDetails.pendingEarnings <= 0}
              className="text-xs font-bold text-green-600 hover:text-green-700 flex items-center gap-1 disabled:opacity-50"
            >
              Request Payout <ArrowRight size={14} />
            </button>
          </div>
          <h3 className="text-sm opacity-60 font-medium">Pending Online Earnings</h3>
          <p className="text-3xl font-bold mt-1">₹{walletDetails.pendingEarnings.toLocaleString()}</p>
          <p className="text-xs opacity-40 mt-2">Will be automatically transferred weekly</p>
        </div>

        {/* Trust/Verification Info */}
        <div className="p-6 rounded-2xl border bg-blue-600 text-white shadow-lg" style={{ backgroundColor: 'var(--accent-color)' }}>
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck size={32} />
            <div>
              <h4 className="font-bold">CV Secure Payments</h4>
              <p className="text-xs opacity-80">Guaranteed 2-way protection</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 size={16} /> 2% Platform Commission
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 size={16} /> Instant Cash Settlements
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 size={16} /> Weekly Bank Withdrawals
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <History className="text-blue-600" /> Transaction History
          </h2>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {walletDetails.transactions.length > 0 ? (
              walletDetails.transactions.map((tx) => (
                <div key={tx._id} className="flex items-center justify-between p-4 rounded-xl border hover:bg-gray-50/50 transition" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      tx.type === 'topup' || tx.type === 'online_earning' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {tx.type === 'topup' || tx.type === 'online_earning' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{tx.description || tx.type.replace('_', ' ').toUpperCase()}</p>
                      <p className="text-xs opacity-40">{new Date(tx.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <p className="text-[10px] opacity-40 uppercase tracking-wider font-bold">Balance: ₹{tx.balanceAfter}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 opacity-40">
                <History size={48} className="mx-auto mb-4" />
                <p>No transactions found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Up Modal */}
      <AnimatePresence>
        {showTopUpModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowTopUpModal(false)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl"
              style={{ backgroundColor: 'var(--card-bg)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Plus className="text-blue-600" /> Top Up Wallet
              </h2>
              <form onSubmit={handleTopUpInitiate}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold opacity-60">Enter Amount (₹)</label>
                    <div className="relative">
                      <IndianRupee size={20} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
                      <input 
                        type="number"
                        placeholder="500"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:border-blue-600 outline-none transition-all text-xl font-bold"
                        style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)' }}
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[100, 500, 1000].map((amt) => (
                      <button 
                        key={amt}
                        type="button"
                        onClick={() => setTopUpAmount(amt.toString())}
                        className="py-2 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-600 font-bold text-sm transition"
                        style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}
                      >
                        +₹{amt}
                      </button>
                    ))}
                  </div>
                  <div className="pt-4 space-y-3">
                    <button 
                      type="submit" 
                      disabled={isProcessing || !topUpAmount}
                      className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                      style={{ backgroundColor: 'var(--accent-color)' }}
                    >
                      <CreditCard size={20} />
                      Proceed to Payment
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowTopUpModal(false)}
                      className="w-full py-2 opacity-60 hover:opacity-100 transition text-sm font-medium"
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Professional Payment Gateway */}
      {showPaymentGateway && (
        <PaymentGateway
          amount={parseFloat(topUpAmount)}
          plan="Wallet Top-up"
          duration="Instant Credit"
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentGateway(false)}
        />
      )}
    </div>
  );
};

export default ServiceProviderWallet;
