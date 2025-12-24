class ProviderPortfolio {
  constructor(supabase) {
    this.supabase = supabase;
  }

  // Add portfolio image
  async addImage(portfolioData) {
    const { data, error } = await this.supabase
      .from('provider_portfolio')
      .insert([{
        provider_id: portfolioData.provider_id,
        image_url: portfolioData.image_url,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Remove portfolio image
  async removeImage(portfolioId) {
    const { data, error } = await this.supabase
      .from('provider_portfolio')
      .delete()
      .eq('id', portfolioId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get all portfolio images for a provider
  async getByProviderId(providerId) {
    const { data, error } = await this.supabase
      .from('provider_portfolio')
      .select('*')
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Get portfolio by ID
  async findById(id) {
    const { data, error } = await this.supabase
      .from('provider_portfolio')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Count portfolio images for a provider
  async countByProviderId(providerId) {
    const { count, error } = await this.supabase
      .from('provider_portfolio')
      .select('*', { count: 'exact', head: true })
      .eq('provider_id', providerId);

    if (error) throw error;
    return count;
  }
}

module.exports = ProviderPortfolio;