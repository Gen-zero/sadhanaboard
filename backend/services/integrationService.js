const AdminIntegration = require('../schemas/AdminIntegration');

module.exports = {
  async listIntegrations({ limit = 50, offset = 0 } = {}) {
    const [items, total] = await Promise.all([
      AdminIntegration.find().sort({ _id: -1 }).limit(Number(limit)).skip(Number(offset)).lean(),
      AdminIntegration.countDocuments()
    ]);
    return { items, total, limit: Number(limit), offset: Number(offset) };
  },
  async getIntegration(id) {
    const result = await AdminIntegration.findById(id).lean();
    return result || null;
  },
  // Note: credentials are stored in JSONB. For production, encrypt credentials at rest.
  async createIntegration({ name, provider, credentials = {}, enabled = false, metadata = {} }) {
    const integration = new AdminIntegration({
      name, provider, credentials, enabled, metadata
    });
    const result = await integration.save();
    return result.toJSON();
  },
  async updateIntegration(id, patch) {
    if (!Object.keys(patch).length) return this.getIntegration(id);
    const result = await AdminIntegration.findByIdAndUpdate(id, patch, { new: true });
    return result?.toJSON();
  },
  async deleteIntegration(id) {
    await AdminIntegration.findByIdAndDelete(id);
    return { ok: true };
  }
};
