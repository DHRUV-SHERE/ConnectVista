class ProviderVerification {
  constructor(supabase) {
    this.supabase = supabase;
  }

  // Submit verification document
  async submitVerification(verificationData) {
    const { data, error } = await this.supabase
      .from('provider_verification')
      .insert([{
        provider_id: verificationData.provider_id,
        document_type: verificationData.document_type,
        document_url: verificationData.document_url,
        status: 'PENDING',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update verification status (admin only)
  async updateStatus(verificationId, status, reviewedBy) {
    const { data, error } = await this.supabase
      .from('provider_verification')
      .update({
        status: status,
        reviewed_by: reviewedBy,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', verificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get verification by ID
  async findById(id) {
    const { data, error } = await this.supabase
      .from('provider_verification')
      .select(`
        *,
        provider:service_providers(*),
        reviewer:users(email, phone)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Get verifications by provider ID
  async getByProviderId(providerId) {
    const { data, error } = await this.supabase
      .from('provider_verification')
      .select('*')
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Get all pending verifications
  async getPendingVerifications(page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await this.supabase
      .from('provider_verification')
      .select(`
        *,
        provider:service_providers(*)
      `, { count: 'exact' })
      .eq('status', 'PENDING')
      .range(start, end)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { data, total: count, page, limit };
  }

  // Get verification by status
  async getByStatus(status, page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await this.supabase
      .from('provider_verification')
      .select(`
        *,
        provider:service_providers(*)
      `, { count: 'exact' })
      .eq('status', status)
      .range(start, end)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, total: count, page, limit };
  }
}

module.exports = ProviderVerification;