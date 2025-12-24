class ProviderServices {
  constructor(supabase) {
    this.supabase = supabase;
  }

  // Add service to provider
  async addService(providerServiceData) {
    const { data, error } = await this.supabase
      .from('provider_services')
      .insert([{
        provider_id: providerServiceData.provider_id,
        service_id: providerServiceData.service_id,
        specialization: providerServiceData.specialization,
        min_price: providerServiceData.min_price,
        max_price: providerServiceData.max_price
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Remove service from provider
  async removeService(providerServiceId) {
    const { data, error } = await this.supabase
      .from('provider_services')
      .delete()
      .eq('id', providerServiceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update provider service
  async update(id, updateData) {
    const { data, error } = await this.supabase
      .from('provider_services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get services by provider ID
  async getByProviderId(providerId) {
    const { data, error } = await this.supabase
      .from('provider_services')
      .select(`
        *,
        service:services(*)
      `)
      .eq('provider_id', providerId);

    if (error) throw error;
    return data;
  }

  // Get providers by service ID
  async getByServiceId(serviceId) {
    const { data, error } = await this.supabase
      .from('provider_services')
      .select(`
        *,
        provider:service_providers(*)
      `)
      .eq('service_id', serviceId);

    if (error) throw error;
    return data;
  }

  // Get provider service by provider and service IDs
  async getByProviderAndService(providerId, serviceId) {
    const { data, error } = await this.supabase
      .from('provider_services')
      .select('*')
      .match({ provider_id: providerId, service_id: serviceId })
      .single();

    if (error) return null;
    return data;
  }

  // Get providers with specific service in a city
  async getProvidersByServiceAndLocation(serviceId, city) {
    const { data, error } = await this.supabase
      .from('provider_services')
      .select(`
        *,
        provider:service_providers(*)
      `)
      .eq('service_id', serviceId)
      .eq('provider.city', city);

    if (error) throw error;
    return data;
  }
}

module.exports = ProviderServices;