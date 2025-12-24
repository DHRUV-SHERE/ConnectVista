class Reviews {
  constructor(supabase) {
    this.supabase = supabase;
  }

  // Create review
  async create(reviewData) {
    const { data, error } = await this.supabase
      .from('reviews')
      .insert([{
        booking_id: reviewData.booking_id,
        seeker_id: reviewData.seeker_id,
        provider_id: reviewData.provider_id,
        rating: reviewData.rating,
        review_text: reviewData.review_text,
        liked: reviewData.liked || false,
        is_read: false,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Add provider reply
  async addReply(reviewId, replyText) {
    const { data, error } = await this.supabase
      .from('reviews')
      .update({
        provider_reply: replyText,
        is_read: true
      })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get review by ID
  async findById(id) {
    const { data, error } = await this.supabase
      .from('reviews')
      .select(`
        *,
        seeker:service_seekers(name),
        provider:service_providers(name, business_name),
        booking:bookings(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Get reviews by provider ID
  async getByProviderId(providerId, page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await this.supabase
      .from('reviews')
      .select(`
        *,
        seeker:service_seekers(name, city),
        booking:bookings(service_id)
      `, { count: 'exact' })
      .eq('provider_id', providerId)
      .range(start, end)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, total: count, page, limit };
  }

  // Get reviews by seeker ID
  async getBySeekerId(seekerId) {
    const { data, error } = await this.supabase
      .from('reviews')
      .select(`
        *,
        provider:service_providers(name, business_name),
        booking:bookings(service_id)
      `)
      .eq('seeker_id', seekerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Get average rating for provider
  async getAverageRating(providerId) {
    const { data, error } = await this.supabase
      .from('reviews')
      .select('rating')
      .eq('provider_id', providerId);

    if (error) throw error;

    if (data.length === 0) return { average: 0, count: 0 };

    const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / data.length;

    return { average: parseFloat(average.toFixed(1)), count: data.length };
  }

  // Mark review as read
  async markAsRead(reviewId) {
    const { data, error } = await this.supabase
      .from('reviews')
      .update({ is_read: true })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get unread reviews for provider
  async getUnreadReviews(providerId) {
    const { data, error } = await this.supabase
      .from('reviews')
      .select(`
        *,
        seeker:service_seekers(name)
      `)
      .eq('provider_id', providerId)
      .eq('is_read', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}

module.exports = Reviews;