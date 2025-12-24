class ProviderSubscription {
  constructor(supabase) {
    this.supabase = supabase;
  }

  // Subscribe provider to a plan
  async subscribe(subscriptionData) {
    const { data, error } = await this.supabase
      .from('provider_subscriptions')
      .insert([{
        provider_id: subscriptionData.provider_id,
        subscription_id: subscriptionData.subscription_id,
        start_date: new Date().toISOString(),
        end_date: this.calculateEndDate(subscriptionData.duration_days),
        is_active: true
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Calculate end date
  calculateEndDate(durationDays) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);
    return endDate.toISOString();
  }

  // Get active subscription for provider
  async getActiveSubscription(providerId) {
    const { data, error } = await this.supabase
      .from('provider_subscriptions')
      .select(`
        *,
        subscription:subscriptions(*)
      `)
      .eq('provider_id', providerId)
      .eq('is_active', true)
      .gte('end_date', new Date().toISOString())
      .single();

    if (error) return null;
    return data;
  }

  // Get all subscriptions for provider
  async getByProviderId(providerId) {
    const { data, error } = await this.supabase
      .from('provider_subscriptions')
      .select(`
        *,
        subscription:subscriptions(*)
      `)
      .eq('provider_id', providerId)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Cancel subscription
  async cancelSubscription(providerSubscriptionId) {
    const { data, error } = await this.supabase
      .from('provider_subscriptions')
      .update({ is_active: false })
      .eq('id', providerSubscriptionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Check if subscription is active
  async isSubscriptionActive(providerId) {
    const activeSubscription = await this.getActiveSubscription(providerId);
    return activeSubscription !== null;
  }

  // Get subscription expiry date
  async getExpiryDate(providerId) {
    const activeSubscription = await this.getActiveSubscription(providerId);
    return activeSubscription ? activeSubscription.end_date : null;
  }

  // Update subscription end date (for renewal)
  async renewSubscription(providerSubscriptionId, durationDays) {
    const currentSubscription = await this.findById(providerSubscriptionId);
    if (!currentSubscription) throw new Error('Subscription not found');

    const newEndDate = this.calculateEndDate(durationDays);

    const { data, error } = await this.supabase
      .from('provider_subscriptions')
      .update({ 
        end_date: newEndDate,
        is_active: true 
      })
      .eq('id', providerSubscriptionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Find by ID
  async findById(id) {
    const { data, error } = await this.supabase
      .from('provider_subscriptions')
      .select(`
        *,
        subscription:subscriptions(*),
        provider:service_providers(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Get expiring subscriptions (for cron job)
  async getExpiringSubscriptions(daysBefore = 3) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysBefore);

    const { data, error } = await this.supabase
      .from('provider_subscriptions')
      .select(`
        *,
        subscription:subscriptions(*),
        provider:service_providers(*)
      `)
      .eq('is_active', true)
      .lte('end_date', expiryDate.toISOString())
      .gte('end_date', new Date().toISOString());

    if (error) throw error;
    return data;
  }
}

module.exports = ProviderSubscription;