class FavoriteServiceProvider {
  constructor(supabase) {
    this.supabase = supabase;
  }

  // Add provider to favorites
  async addFavorite(favoriteData) {
    const { data, error } = await this.supabase
      .from('favorite_service_providers')
      .insert([{
        seeker_id: favoriteData.seeker_id,
        provider_id: favoriteData.provider_id,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Remove provider from favorites
  async removeFavorite(seekerId, providerId) {
    const { data, error } = await this.supabase
      .from('favorite_service_providers')
      .delete()
      .match({ seeker_id: seekerId, provider_id: providerId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Check if provider is favorited
  async isFavorited(seekerId, providerId) {
    const { data, error } = await this.supabase
      .from('favorite_service_providers')
      .select('*')
      .match({ seeker_id: seekerId, provider_id: providerId })
      .single();

    return !error; // Returns true if favorite exists
  }

  // Get all favorites for a seeker
  async getBySeekerId(seekerId) {
    const { data, error } = await this.supabase
      .from('favorite_service_providers')
      .select(`
        *,
        provider:service_providers(*),
        seeker:service_seekers(*)
      `)
      .eq('seeker_id', seekerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Get all seekers who favorited a provider
  async getByProviderId(providerId) {
    const { data, error } = await this.supabase
      .from('favorite_service_providers')
      .select(`
        *,
        seeker:service_seekers(*)
      `)
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Count favorites for a provider
  async countByProviderId(providerId) {
    const { count, error } = await this.supabase
      .from('favorite_service_providers')
      .select('*', { count: 'exact', head: true })
      .eq('provider_id', providerId);

    if (error) throw error;
    return count;
  }
}

module.exports = FavoriteServiceProvider;