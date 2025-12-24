class Services {
  constructor(supabase) {
    this.supabase = supabase;
  }

  // Create new service
  async create(serviceData) {
    const { data, error } = await this.supabase
      .from('services')
      .insert([{
        name: serviceData.name,
        description: serviceData.description,
        category: serviceData.category,
        is_active: serviceData.is_active !== undefined ? serviceData.is_active : true
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get service by ID
  async findById(id) {
    const { data, error } = await this.supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Update service
  async update(id, updateData) {
    const { data, error } = await this.supabase
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get all services with pagination
  async getAll(filters = {}, page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = this.supabase
      .from('services')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error, count } = await query
      .range(start, end)
      .order('name', { ascending: true });

    if (error) throw error;
    return { data, total: count, page, limit };
  }

  // Get services by category
  async getByCategory(category) {
    const { data, error } = await this.supabase
      .from('services')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  }

  // Get active services
  async getActiveServices() {
    const { data, error } = await this.supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  }

  // Search services
  async search(searchTerm) {
    const { data, error } = await this.supabase
      .from('services')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  }
}

module.exports = Services;