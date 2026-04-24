import { useState, useEffect } from 'react';
import { 
  FileText, Search, Download, Calendar, 
  MapPin, IndianRupee, Tag, Loader2, Filter,
  ArrowRight, ExternalLink, User, Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { invoiceAPI } from '../../services/invoiceAPI';
import { generateInvoicePDF } from '../../utils/invoicePDF';

const ServiceProviderInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, cash, online
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await invoiceAPI.getProviderInvoices();
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
    const matchesFilter = filter === 'all' || inv.paymentMethod === filter;
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         inv.seekerId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      backgroundColor: 'var(--background)',
      color: 'var(--text-color)',
      padding: '1rem',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 'bold',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Receipt size={32} style={{ color: 'var(--accent-color)' }} />
            Business Invoices
          </h1>
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            flex: 1,
            justifyContent: 'flex-end',
            minWidth: '300px'
          }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
              <input 
                type="text"
                placeholder="Search by Invoice # or Customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.75rem',
                  color: 'var(--text-color)',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        scrollbarWidth: 'none'
      }}>
        {['all', 'online', 'cash'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.625rem 1.5rem',
              backgroundColor: filter === f ? 'var(--accent-color)' : 'var(--card-bg)',
              color: filter === f ? 'white' : 'var(--text-color)',
              border: `1px solid ${filter === f ? 'var(--accent-color)' : 'var(--border-color)'}`,
              borderRadius: '0.75rem',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              textTransform: 'capitalize',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Invoice List */}
      {filteredInvoices.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 350px), 1fr))',
          gap: '1.5rem'
        }}>
          {filteredInvoices.map((invoice) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={invoice._id} 
              style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '1rem',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--accent-fade)',
                  color: 'var(--accent-color)',
                  borderRadius: '0.75rem'
                }}>
                  <FileText size={24} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '10px', fontWeight: '900', opacity: 0.4, margin: 0, letterSpacing: '0.05em' }}>
                    {invoice.invoiceNumber}
                  </p>
                  <p style={{ fontSize: '0.75rem', opacity: 0.6, margin: '0.25rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                    <Calendar size={12} /> {new Date(invoice.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: 0 }}>
                  {invoice.seekerId?.name || 'Customer'}
                </h3>
              </div>

              <div style={{
                padding: '1rem',
                backgroundColor: 'var(--background)',
                borderRadius: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.6 }}>
                  <span>Payment Via</span>
                  <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{invoice.paymentMethod}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '500' }}>Final Amount</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--accent-color)' }}>
                    ₹{invoice.grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  onClick={() => downloadInvoice(invoice)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    backgroundColor: 'var(--accent-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}
                >
                  <Download size={18} /> Download PDF
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '5rem 1rem',
          backgroundColor: 'var(--card-bg)',
          borderRadius: '1rem',
          border: '1px solid var(--border-color)',
          opacity: 0.5
        }}>
          <Receipt size={64} style={{ margin: '0 auto 1.5rem' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>No Invoices Found</h3>
          <p style={{ margin: 0 }}>Service receipts will appear here once you complete jobs.</p>
        </div>
      )}
    </div>
  );
};

export default ServiceProviderInvoices;
