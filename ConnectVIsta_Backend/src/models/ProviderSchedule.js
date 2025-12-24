class ProviderSchedule {
  constructor(supabase) {
    this.supabase = supabase;
  }

  // Create or update provider schedule
  async upsert(scheduleData) {
    // Check if schedule exists
    const existing = await this.findByProviderId(scheduleData.provider_id);
    
    if (existing) {
      // Update existing schedule
      const { data, error } = await this.supabase
        .from('provider_schedule')
        .update({
          response_time: scheduleData.response_time,
          service_area_radius_km: scheduleData.service_area_radius_km,
          weekly_schedule: scheduleData.weekly_schedule,
          is_available: scheduleData.is_available !== undefined ? scheduleData.is_available : true
        })
        .eq('provider_id', scheduleData.provider_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new schedule
      const { data, error } = await this.supabase
        .from('provider_schedule')
        .insert([{
          provider_id: scheduleData.provider_id,
          response_time: scheduleData.response_time,
          service_area_radius_km: scheduleData.service_area_radius_km,
          weekly_schedule: scheduleData.weekly_schedule,
          is_available: scheduleData.is_available !== undefined ? scheduleData.is_available : true
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  // Get schedule by provider ID
  async findByProviderId(providerId) {
    const { data, error } = await this.supabase
      .from('provider_schedule')
      .select(`
        *,
        provider:service_providers(*)
      `)
      .eq('provider_id', providerId)
      .single();

    if (error) return null;
    return data;
  }

  // Update availability
  async updateAvailability(providerId, isAvailable) {
    const { data, error } = await this.supabase
      .from('provider_schedule')
      .update({ is_available: isAvailable })
      .eq('provider_id', providerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get available providers in a location
  async getAvailableProvidersInArea(latitude, longitude, radiusKm, serviceId = null) {
    // Note: This requires PostGIS extension in Supabase
    // For now, we'll return providers by city
    let query = this.supabase
      .from('provider_schedule')
      .select(`
        *,
        provider:service_providers(*)
      `)
      .eq('is_available', true);

    if (serviceId) {
      query = query.eq('provider.provider_services.service_id', serviceId);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    // Filter by radius (simplified - in production, use PostGIS)
    const filteredProviders = data.filter(schedule => {
      // Calculate distance logic here
      // For now, return all available providers
      return true;
    });

    return filteredProviders;
  }

  // Check if provider is available at a specific time
  async checkAvailability(providerId, date, time) {
    const schedule = await this.findByProviderId(providerId);
    if (!schedule || !schedule.is_available) return false;

    const dayOfWeek = new Date(date).getDay(); // 0 = Sunday, 1 = Monday, etc.
    const weeklySchedule = schedule.weekly_schedule || {};
    const daySchedule = weeklySchedule[dayOfWeek];

    if (!daySchedule || daySchedule.is_off) return false;

    // Check if time is within working hours
    const requestedTime = new Date(`${date}T${time}`);
    const startTime = new Date(`${date}T${daySchedule.start_time}`);
    const endTime = new Date(`${date}T${daySchedule.end_time}`);

    return requestedTime >= startTime && requestedTime <= endTime;
  }
}

module.exports = ProviderSchedule;