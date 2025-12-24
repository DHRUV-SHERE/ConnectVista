class ProviderSettings {
  constructor(supabase) {
    this.supabase = supabase;
  }

  // Create or update settings
  async upsert(settingsData) {
    // Check if settings exist
    const existing = await this.findByProviderId(settingsData.provider_id);
    
    if (existing) {
      // Update existing settings
      const { data, error } = await this.supabase
        .from('provider_settings')
        .update({
          notification_enabled: settingsData.notification_enabled !== undefined ? settingsData.notification_enabled : true,
          auto_accept_booking: settingsData.auto_accept_booking || false,
          show_phone: settingsData.show_phone || false,
          updated_at: new Date().toISOString()
        })
        .eq('provider_id', settingsData.provider_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new settings
      const { data, error } = await this.supabase
        .from('provider_settings')
        .insert([{
          provider_id: settingsData.provider_id,
          notification_enabled: settingsData.notification_enabled !== undefined ? settingsData.notification_enabled : true,
          auto_accept_booking: settingsData.auto_accept_booking || false,
          show_phone: settingsData.show_phone || false,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  // Get settings by provider ID
  async findByProviderId(providerId) {
    const { data, error } = await this.supabase
      .from('provider_settings')
      .select('*')
      .eq('provider_id', providerId)
      .single();

    if (error) return null;
    return data;
  }

  // Update specific setting
  async updateSetting(providerId, settingName, value) {
    const { data, error } = await this.supabase
      .from('provider_settings')
      .update({ 
        [settingName]: value,
        updated_at: new Date().toISOString()
      })
      .eq('provider_id', providerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get auto-accept providers
  async getAutoAcceptProviders() {
    const { data, error } = await this.supabase
      .from('provider_settings')
      .select(`
        *,
        provider:service_providers(*)
      `)
      .eq('auto_accept_booking', true);

    if (error) throw error;
    return data;
  }
}

module.exports = ProviderSettings;