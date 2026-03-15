import { useState, useEffect } from 'react';
import { 
  FileText, Search, Download, Calendar, 
  MapPin, IndianRupee, Tag, Loader2, Filter,
  ArrowRight, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { invoiceAPI } from '../../services/invoiceAPI';
import { generateInvoicePDF } from '../../utils/invoicePDF';

const UserInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, cash, online

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await invoiceAPI.getSeekerInvoices();
      if (response.success) {
        setInvoices(response.data);
      }
    } catch (error) {
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    if (filter === 'all') return true;
    return inv.paymentMethod === filter;
  });

  const downloadInvoice = async (invoice) => {
    try {
      const toastId = toast.loading(`Generating PDF for ${invoice.invoiceNumber}...`);
      await generateInvoicePDF(invoice);
      toast.success('Invoice downloaded successfully', { id: toastId });
    } catch (error) {
      console.error('PDF Error:', error);
      toast.error('Failed to generate PDF');
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">My Service Invoices</h1>
        <p className="opacity-60">View and download your receipts for completed services</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
        {['all', 'online', 'cash'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all capitalize ${
              filter === f ? 'bg-blue-600 text-white shadow-md' : 'opacity-60 hover:opacity-100'
            }`}
            style={{ backgroundColor: filter === f ? 'var(--accent-color)' : 'transparent' }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Invoice Grid */}
      {filteredInvoices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvoices.map((invoice) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={invoice._id} 
              className="p-6 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all group"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <FileText size={24} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-tighter opacity-40">{invoice.invoiceNumber}</p>
                  <p className="text-xs font-bold opacity-60 flex items-center gap-1 justify-end">
                    <Calendar size={12} /> {new Date(invoice.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold truncate">{invoice.providerId?.businessName || invoice.providerId?.name}</h3>
                  <p className="text-xs opacity-60 flex items-center gap-1">
                    <Tag size={12} /> {invoice.bookingId?.serviceId?.name || 'Service Task'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50/50 space-y-2" style={{ backgroundColor: 'var(--bg-color)' }}>
                  <div className="flex justify-between text-xs opacity-60">
                    <span>Payment Method</span>
                    <span className="font-bold uppercase">{invoice.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Paid</span>
                    <span className="text-xl font-black text-blue-600">₹{invoice.grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => downloadInvoice(invoice)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition"
                    style={{ backgroundColor: 'var(--accent-color)' }}
                  >
                    <Download size={18} /> Invoice PDF
                  </button>
                  <button className="p-3 border rounded-xl hover:bg-gray-100 transition" style={{ borderColor: 'var(--border-color)' }}>
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 opacity-40">
          <FileText size={64} className="mx-auto mb-4" />
          <p className="text-xl font-bold">No invoices found</p>
          <p className="text-sm">Invoices appear here once your services are completed.</p>
        </div>
      )}
    </div>
  );
};

export default UserInvoices;
