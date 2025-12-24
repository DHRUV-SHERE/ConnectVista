class ServiceSeeker {
  constructor(supabase) {
    this.supabase = supabase;
  }

  // Create service seeker profile
  async create(seekerData) {
    const { data, error } = await this.supabase
      .from('service_seekers')
      .insert([{
        user_id: seekerData.user_id,
        name: seekerData.name,
        gender: seekerData.gender,
        address: seekerData.address,
        city: seekerData.city,
        state: seekerData.state,
        pin_code: seekerData.pin_code,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get seeker by ID
  async findById(id) {
    const { data, error } = await this.supabase
      .from('service_seekers')
      .select(`
        *,
        user:users(email, phone, role, is_active)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Get seeker by user ID
  async findByUserId(userId) {
    const { data, error } = await this.supabase
      .from('service_seekers')
      .select(`
        *,
        user:users(email, phone, role, is_active)
      `)
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data;
  }

  // Update seeker profile
  async update(id, updateData) {
    const { data, error } = await this.supabase
      .from('service_seekers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get all seekers with pagination
  async getAll(page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await this.supabase
      .from('service_seekers')
      .select(`
        *,
        user:users(email, phone)
      `, { count: 'exact' })
      .range(start, end)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, total: count, page, limit };
  }

  // Search seekers by city/state
  async searchByLocation(city = null, state = null) {
    let query = this.supabase
      .from('service_seekers')
      .select('*');

    if (city) {
      query = query.ilike('city', `%${city}%`);
    }
    if (state) {
      query = query.ilike('state', `%${state}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}
module.exports = ServiceSeeker;