class Notification {
  constructor(supabase) {
    this.supabase = supabase;
  }

  // Create notification
  async create(notificationData) {
    const { data, error } = await this.supabase
      .from('notifications')
      .insert([{
        user_id: notificationData.user_id,
        booking_id: notificationData.booking_id || null,
        message: notificationData.message,
        category: notificationData.category || 'SYSTEM',
        is_read: false,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    const { data, error } = await this.supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Mark all notifications as read for user
  async markAllAsRead(userId) {
    const { data, error } = await this.supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)
      .select();

    if (error) throw error;
    return data;
  }

  // Get notifications by user ID
  async getByUserId(userId, filters = {}, page = 1, limit = 20) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = this.supabase
      .from('notifications')
      .select(`
        *,
        booking:bookings(*)
      `, { count: 'exact' })
      .eq('user_id', userId);

    // Apply filters
    if (filters.is_read !== undefined) {
      query = query.eq('is_read', filters.is_read);
    }
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }

    const { data, error, count } = await query
      .range(start, end)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, total: count, page, limit };
  }

  // Get unread notification count
  async getUnreadCount(userId) {
    const { count, error } = await this.supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return count;
  }

  // Delete notification
  async delete(notificationId) {
    const { data, error } = await this.supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Create booking notification
  async createBookingNotification(booking, type) {
    let message = '';
    let category = 'BOOKING';

    switch(type) {
      case 'CREATED':
        message = `New booking request from ${booking.seeker_name}`;
        break;
      case 'CONFIRMED':
        message = `Your booking with ${booking.provider_name} has been confirmed`;
        break;
      case 'CANCELLED':
        message = `Booking has been cancelled`;
        break;
      case 'COMPLETED':
        message = `Booking has been completed`;
        break;
    }

    return this.create({
      user_id: type === 'CREATED' ? booking.provider_user_id : booking.seeker_user_id,
      booking_id: booking.id,
      message,
      category
    });
  }
}

module.exports = Notification;