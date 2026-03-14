import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Sparkles, Send, Clock } from "lucide-react";
import { generateAIReview, getReviewTags } from "../../utils/gemini";
import { serviceAPI } from "../../services/serviceAPI";
import { toast } from "react-hot-toast";

const ReviewModal = ({ isOpen, onClose, booking, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    if (booking) {
      const serviceName = booking.serviceId?.name || "";
      setAvailableTags(getReviewTags(serviceName));
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAIByMagic = async () => {
    if (rating === 0) {
      toast.error("Please select a star rating first");
      return;
    }
    
    setIsGenerating(true);
    try {
      const generated = await generateAIReview(
        rating, 
        selectedTags, 
        booking.serviceId?.name || "Service"
      );
      if (generated) {
        setReviewText(generated);
        toast.success("AI review generated!");
      } else {
        toast.error("AI generation failed. Please try manual writing.");
      }
    } catch (error) {
      toast.error("AI generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await serviceAPI.submitReview({
        bookingId: booking._id,
        rating,
        reviewText
      });

      if (response.success) {
        toast.success("Review submitted successfully!");
        onSuccess && onSuccess();
        onClose();
      } else {
        toast.error(response.message || "Failed to submit review");
      }
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotNow = async () => {
    try {
      await serviceAPI.setReviewReminder(booking._id);
      toast.success("We'll remind you later!");
      onClose();
    } catch (error) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Rate Service</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              How was your experience with {booking.providerId?.businessName || "the provider"}?
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Star Rating */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform active:scale-90"
                >
                  <Star 
                    className={`w-10 h-10 ${
                      (hover || rating) >= star 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-gray-300 dark:text-slate-700"
                    } transition-colors duration-200`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-medium text-yellow-600 dark:text-yellow-500">
              {rating === 5 ? "Excellent!" : 
               rating === 4 ? "Very Good" : 
               rating === 3 ? "Average" : 
               rating === 2 ? "Below Average" : 
               rating === 1 ? "Poor" : "Select your rating"}
            </p>
          </div>

          {/* Quick Tags */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">What did you like?</p>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Review Text Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your Review</label>
              <button
                onClick={handleAIByMagic}
                disabled={isGenerating || rating === 0}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-pulse' : ''}`} />
                {isGenerating ? "Generating..." : "Generate with AI"}
              </button>
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us more about your experience..."
              className="w-full h-32 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none transition-all dark:text-white"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleNotNow}
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Not Now
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Review
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewModal;
