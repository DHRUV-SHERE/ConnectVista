class Booking {
  constructor(supabase) {
    this.supabase = supabase;
  }

  // Create new booking
  async create(bookingData) {
    const { data, error } = await this.supabase
      .from('bookings')
      .insert([{
        seeker_id: bookingData.seeker_id,
        provider_id: bookingData.provider_id,
        service_id: bookingData.service_id,
        booking_date: bookingData.booking_date,
        booking_time: bookingData.booking_time,
        priority: bookingData.priority || 'NORMAL',
        service_address: bookingData.service_address,
        additional_note: bookingData.additional_note,
        base_price: bookingData.base_price,
        extra_charge: bookingData.extra_charge || 0,
        total_price: bookingData.total_price,
        status: 'PENDING',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get booking by ID
  async findById(id) {
    const { data, error } = await this.supabase
      .from('bookings')
      .select(`
        *,
        seeker:service_seekers(*),
        provider:service_providers(*),
        service:services(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Update booking status
  async updateStatus(bookingId, status) {
    const { data, error } = await this.supabase
      .from('bookings')
      .update({ status: status })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get bookings by seeker ID
  async getBySeekerId(seekerId, filters = {}, page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = this.supabase
      .from('bookings')
      .select(`
        *,
        provider:service_providers(*),
        service:services(*)
      `, { count: 'exact' })
      .eq('seeker_id', seekerId);

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.startDate) {
      query = query.gte('booking_date', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('booking_date', filters.endDate);
    }

    const { data, error, count } = await query
      .range(start, end)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, total: count, page, limit };
  }

  // Get bookings by provider ID
  async getByProviderId(providerId, filters = {}, page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = this.supabase
      .from('bookings')
      .select(`
        *,
        seeker:service_seekers(*),
        service:services(*)
      `, { count: 'exact' })
      .eq('provider_id', providerId);

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters.date) {
      query = query.eq('booking_date', filters.date);
    }

    const { data, error, count } = await query
      .range(start, end)
      .order('booking_date', { ascending: true })
      .order('booking_time', { ascending: true });

    if (error) throw error;
    return { data, total: count, page, limit };
  }

  // Update booking
  async update(id, updateData) {
    const { data, error } = await this.supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Calculate booking statistics
  async getStatistics(providerId, startDate, endDate) {
    // Get total bookings
    const { count: totalBookings, error: error1 } = await this.supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('provider_id', providerId)
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error1) throw error1;

    // Get completed bookings
    const { count: completedBookings, error: error2 } = await this.supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('provider_id', providerId)
      .eq('status', 'COMPLETED')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error2) throw error2;

    // Get total revenue
    const { data: revenueData, error: error3 } = await this.supabase
      .from('bookings')
      .select('total_price')
      .eq('provider_id', providerId)
      .eq('status', 'COMPLETED')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error3) throw error3;

    const totalRevenue = revenueData.reduce((sum, booking) => sum + (booking.total_price || 0), 0);

    return {
      totalBookings,
      completedBookings,
      cancelledBookings: totalBookings - completedBookings,
      completionRate: totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
      totalRevenue
    };
  }

  // Get bookings for today
  async getTodaysBookings(providerId) {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await this.supabase
      .from('bookings')
      .select(`
        *,
        seeker:service_seekers(name, phone),
        service:services(name)
      `)
      .eq('provider_id', providerId)
      .eq('booking_date', today)
      .in('status', ['PENDING', 'CONFIRMED', 'IN_PROGRESS'])
      .order('booking_time', { ascending: true });

    if (error) throw error;
    return data;
  }
}

module.exports = Booking;