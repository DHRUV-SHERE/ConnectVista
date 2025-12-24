class Subscription {
  constructor(supabase) {
    this.supabase = supabase;
  }

  // Create subscription plan
  async create(subscriptionData) {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .insert([{
        name: subscriptionData.name,
        price: subscriptionData.price,
        duration_days: subscriptionData.duration_days,
        rank_boost: subscriptionData.rank_boost || 0,
        features: subscriptionData.features || []
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get subscription by ID
  async findById(id) {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Update subscription
  async update(id, updateData) {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get all subscriptions
  async getAll() {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .select('*')
      .order('price', { ascending: true });

    if (error) throw error;
    return data;
  }

  // Delete subscription
  async delete(id) {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get active subscriptions
  async getActiveSubscriptions() {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .select('*')
      .order('price', { ascending: true });

    if (error) throw error;
    return data;
  }
}

module.exports = Subscription;