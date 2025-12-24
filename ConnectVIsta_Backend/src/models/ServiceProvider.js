class ServiceProvider {
  constructor(supabase) {
    this.supabase = supabase;
  }

  // Create service provider profile
  async create(providerData) {
    const { data, error } = await this.supabase
      .from('service_providers')
      .insert([{
        user_id: providerData.user_id,
        name: providerData.name,
        business_name: providerData.business_name,
        description: providerData.description,
        experience_years: providerData.experience_years || 0,
        business_address: providerData.business_address,
        city: providerData.city,
        state: providerData.state,
        pin_code: providerData.pin_code,
        languages: providerData.languages || [],
        rating: providerData.rating || 0,
        starting_price: providerData.starting_price || 0,
        emergency_charge: providerData.emergency_charge || 0,
        extra_charge_note: providerData.extra_charge_note,
        is_verified: providerData.is_verified || false,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get provider by ID
  async findById(id) {
    const { data, error } = await this.supabase
      .from('service_providers')
      .select(`
        *,
        user:users(email, phone, role, is_active)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Get provider by user ID
  async findByUserId(userId) {
    const { data, error } = await this.supabase
      .from('service_providers')
      .select(`
        *,
        user:users(email, phone, role, is_active)
      `)
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data;
  }

  // Update provider profile
  async update(id, updateData) {
    const { data, error } = await this.supabase
      .from('service_providers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get all providers with pagination and filters
  async getAll(filters = {}, page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = this.supabase
      .from('service_providers')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }
    if (filters.state) {
      query = query.ilike('state', `%${filters.state}%`);
    }
    if (filters.minRating) {
      query = query.gte('rating', filters.minRating);
    }
    if (filters.maxPrice) {
      query = query.lte('starting_price', filters.maxPrice);
    }
    if (filters.isVerified !== undefined) {
      query = query.eq('is_verified', filters.isVerified);
    }
    if (filters.languages && filters.languages.length > 0) {
      query = query.contains('languages', filters.languages);
    }

    const { data, error, count } = await query
      .range(start, end)
      .order('rating', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, total: count, page, limit };
  }

  // Search providers by name or business name
  async search(queryString) {
    const { data, error } = await this.supabase
      .from('service_providers')
      .select('*')
      .or(`name.ilike.%${queryString}%,business_name.ilike.%${queryString}%`)
      .order('rating', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Update provider rating (average calculation)
  async updateRating(providerId, newRating) {
    // Get current provider data
    const provider = await this.findById(providerId);
    
    // In a real app, you'd calculate average from all reviews
    // This is a simplified version
    const updatedRating = (provider.rating + newRating) / 2;
    
    const { data, error } = await this.supabase
      .from('service_providers')
      .update({ rating: updatedRating })
      .eq('id', providerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get top-rated providers
  async getTopRated(limit = 10) {
    const { data, error } = await this.supabase
      .from('service_providers')
      .select('*')
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  // Get providers by city
  async getByCity(city, page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await this.supabase
      .from('service_providers')
      .select('*', { count: 'exact' })
      .ilike('city', `%${city}%`)
      .range(start, end)
      .order('rating', { ascending: false });

    if (error) throw error;
    return { data, total: count, page, limit };
  }
}

module.exports = ServiceProvider;