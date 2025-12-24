const { createClient } = require('@supabase/supabase-js');

class User {
  constructor(supabase) {
    this.supabase = supabase;
  }

  // Create a new user
  async create(userData) {
    const { data, error } = await this.supabase
      .from('users')
      .insert([{
        email: userData.email,
        phone: userData.phone,
        password: userData.password, // Note: Hash password before storing!
        role: userData.role || 'SEEKER',
        is_active: userData.is_active !== undefined ? userData.is_active : true,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Find user by ID
  async findById(id) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Find user by email
  async findByEmail(email) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) return null; // User not found
    return data;
  }

  // Find user by phone
  async findByPhone(phone) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) return null;
    return data;
  }

  // Update user
  async update(id, updateData) {
    const { data, error } = await this.supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete user (soft delete by setting is_active to false)
  async delete(id) {
    const { data, error } = await this.supabase
      .from('users')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get all users with pagination
  async getAll(page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await this.supabase
      .from('users')
      .select('*', { count: 'exact' })
      .range(start, end)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, total: count, page, limit };
  }

  // Get users by role
  async findByRole(role, page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await this.supabase
      .from('users')
      .select('*', { count: 'exact' })
      .eq('role', role)
      .range(start, end)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, total: count, page, limit };
  }
}

module.exports = User;