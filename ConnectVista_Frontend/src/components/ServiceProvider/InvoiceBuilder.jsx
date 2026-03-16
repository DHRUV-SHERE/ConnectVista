import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, X, Plus, IndianRupee, Trash2, Wallet, 
  CreditCard, Loader2, CheckCircle, Download, QrCode, Smartphone 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { invoiceAPI } from '../../services/invoiceAPI';
import { generateInvoicePDF } from '../../utils/invoicePDF';

const InvoiceBuilder = ({ booking, walletBalance, onClose, onSuccess }) => {
  const [items, setItems] = useState([{ description: '', amount: '' }]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25);
  const timerRef = useRef(null);

  useEffect(() => {
    if (showQRCode && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && showQRCode) {
      handleOnlinePaymentSuccess();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showQRCode, timeLeft]);

  const handleOnlinePaymentSuccess = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      setIsSubmitting(true);
      const response = await invoiceAPI.completeOnlinePayment(generatedInvoice._id);
      if (response.success) {
        toast.success('Payment Received! Job Completed.');
        setGeneratedInvoice(response.data);
        setShowQRCode(false);
      }
    } catch (error) {
      toast.error('Failed to verify payment');
      setShowQRCode(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const visitingCharge = booking.visitingCharge || 0;
  
  const totals = useMemo(() => {
    const subTotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const grandTotal = subTotal + visitingCharge;
    const platformFee = grandTotal * 0.02; // 2%
    return { subTotal, grandTotal, platformFee };
  }, [items, visitingCharge]);

  const handleAddItem = () => {
    setItems([...items, { description: '', amount: '' }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const isCashDisabled = walletBalance < 100 || walletBalance < totals.platformFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const validItems = items.filter(item => item.description.trim() && item.amount > 0);
    if (validItems.length === 0) {
      toast.error('Please add at least one service item');
      return;
    }

    if (paymentMethod === 'cash' && isCashDisabled) {
      toast.error('Insufficient wallet balance to accept cash payment');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await invoiceAPI.generateInvoice({
        bookingId: booking._id,
        items: validItems,
        paymentMethod
      });

      if (response.success) {
        if (paymentMethod === 'online') {
          setGeneratedInvoice(response.data);
          setShowQRCode(true);
          setTimeLeft(25);
        } else {
          toast.success('Service completed successfully!');
          setGeneratedInvoice(response.data);
        }
      }
    } catch (error) {
      toast.error(error.message || 'Failed to generate invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async () => {
    if (generatedInvoice) {
      await generateInvoicePDF(generatedInvoice);
    }
  };

  const handleFinalClose = () => {
    onSuccess(generatedInvoice);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={(generatedInvoice && !showQRCode) ? handleFinalClose : (showQRCode ? null : onClose)}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {showQRCode ? (
            <motion.div
              key="qrcode"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-8 flex flex-col items-center text-center space-y-6"
            >
              <div className="p-4 bg-white rounded-3xl shadow-xl border-8 border-blue-50">
                <div className="relative">
                  <QrCode size={200} className="text-gray-800" />
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[1px] animate-pulse">
                     <Loader2 size={40} className="text-blue-600 animate-spin" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Scan to Pay ₹{generatedInvoice?.grandTotal}</h2>
                <p className="opacity-60 flex items-center justify-center gap-2">
                  <Smartphone size={18} /> Ask customer to scan this QR code
                </p>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden max-w-xs">
                <motion.div 
                  className="bg-blue-600 h-full"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 25, ease: "linear" }}
                />
              </div>
              
              <div className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                Waiting for payment confirmation... {timeLeft}s
              </div>

              <p className="text-xs opacity-50 max-w-xs">
                Do not close this window. System will automatically detect the payment and finalize the booking.
              </p>
            </motion.div>
          ) : !generatedInvoice || (generatedInvoice.paymentMethod === 'online' && generatedInvoice.paymentStatus === 'pending') ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col h-full overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Generate Invoice</h2>
                    <p className="text-sm opacity-60">Complete service for {booking.seekerId?.name}</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <form id="invoice-form" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm uppercase tracking-wider opacity-60">Service Items</h3>
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="text-sm font-medium flex items-center gap-1 text-blue-600 hover:text-blue-700"
                      >
                        <Plus size={16} /> Add Item
                      </button>
                    </div>

                    {items.map((item, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="e.g. Pipe Repair"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border-color)' }}
                            required
                          />
                        </div>
                        <div className="w-32 relative">
                          <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                          <input
                            type="number"
                            placeholder="Amount"
                            value={item.amount}
                            onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                            className="w-full pl-8 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border-color)' }}
                            required
                            min="0"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          disabled={items.length === 1}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}

                    {/* Summary Table */}
                    <div className="mt-8 p-6 rounded-2xl border bg-gray-50/50" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--background)' }}>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="opacity-60">Service Subtotal</span>
                          <span className="font-medium">₹{totals.subTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="opacity-60">Visiting Charge (Fixed)</span>
                          <span className="font-medium">₹{visitingCharge.toLocaleString()}</span>
                        </div>
                        <div className="pt-3 border-t flex justify-between items-center" style={{ borderColor: 'var(--border-color)' }}>
                          <span className="font-bold">Grand Total</span>
                          <span className="text-xl font-bold text-blue-600">₹{totals.grandTotal.toLocaleString()}</span>
                        </div>
                        <div className="mt-4 p-3 rounded-xl bg-blue-50/50 text-xs border border-blue-100 text-blue-700">
                          <div className="flex justify-between">
                            <span>Platform Fee (2%) to be deducted:</span>
                            <span className="font-bold">₹{totals.platformFee.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mt-6">
                      <h3 className="font-semibold text-sm uppercase tracking-wider opacity-60 mb-3">Payment Method</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('cash')}
                          className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                            paymentMethod === 'cash' ? 'border-blue-600 bg-blue-50/30' : 'border-transparent bg-gray-50/50'
                          } ${isCashDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-200'}`}
                          style={{ backgroundColor: paymentMethod === 'cash' ? 'var(--accent-fade)' : 'var(--background)', borderColor: paymentMethod === 'cash' ? 'var(--accent-color)' : 'var(--border-color)' }}
                        >
                          <Wallet size={24} className={paymentMethod === 'cash' ? 'text-blue-600' : 'opacity-40'} />
                          <span className="font-semibold text-sm">Cash Payment</span>
                          {isCashDisabled && (
                            <span className="text-[10px] text-red-500 font-medium">Low Wallet Balance</span>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('online')}
                          className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                            paymentMethod === 'online' ? 'border-blue-600 bg-blue-50/30' : 'border-transparent bg-gray-50/50'
                          } hover:border-blue-200`}
                          style={{ backgroundColor: paymentMethod === 'online' ? 'var(--accent-fade)' : 'var(--background)', borderColor: paymentMethod === 'online' ? 'var(--accent-color)' : 'var(--border-color)' }}
                        >
                          <CreditCard size={24} className={paymentMethod === 'online' ? 'text-blue-600' : 'opacity-40'} />
                          <span className="font-semibold text-sm">Online (QR/Link)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="p-6 border-t flex gap-4" style={{ borderColor: 'var(--border-color)' }}>
                <button
                  onClick={onClose}
                  className="flex-1 py-4 rounded-xl font-bold border hover:bg-gray-50 transition-colors"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  Cancel
                </button>
                <button
                  form="invoice-form"
                  type="submit"
                  disabled={isSubmitting || (paymentMethod === 'cash' && isCashDisabled)}
                  className="flex bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center gap-2"
                  style={{ flex: 2, backgroundColor: 'var(--accent-color)' }}
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <CheckCircle size={20} />
                  )}
                  {paymentMethod === 'cash' ? 'Confirm Cash & Deduct Fee' : 'Generate QR Code'}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 flex flex-col items-center text-center space-y-6"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner">
                <CheckCircle size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black">Job Completed!</h2>
                <p className="opacity-60 max-w-sm mx-auto">
                  The service has been finalized and the invoice <b>{generatedInvoice.invoiceNumber}</b> has been generated.
                </p>
              </div>

              <div className="w-full p-6 rounded-2xl border bg-gray-50/50 space-y-3" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border-color)' }}>
                <div className="flex justify-between text-sm">
                  <span className="opacity-60">Customer</span>
                  <span className="font-bold">{booking.seekerId?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-60">Total Amount</span>
                  <span className="font-bold text-blue-600">₹{generatedInvoice.grandTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-60">Payment Mode</span>
                  <span className="font-bold uppercase">{generatedInvoice.paymentMethod}</span>
                </div>
              </div>

              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={handleDownload}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--accent-color)' }}
                >
                  <Download size={20} /> Download Invoice PDF
                </button>
                <button
                  onClick={handleFinalClose}
                  className="w-full py-4 rounded-xl font-bold border hover:bg-gray-50 transition-colors"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  Done & Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default InvoiceBuilder;
