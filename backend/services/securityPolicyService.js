const AdminIntegration = require('../schemas/AdminIntegration');

module.exports = {
  async listPolicies({ limit = 50, offset = 0 } = {}) {
    const items = await AdminIntegration.find()
      .sort({ _id: -1 })
      .limit(Number(limit))
      .skip(Number(offset));
    const total = await AdminIntegration.countDocuments();
    return { items: items.map(i => i.toJSON()), total, limit, offset };
  },

  async getPolicy(id) {
    const policy = await AdminIntegration.findById(id);
    return policy ? policy.toJSON() : null;
  },

  async createPolicy({ name, description = '', rules = [], enabled = true }) {
    const policy = new AdminIntegration({
      integrationName: name,
      description,
      configuration: { rules },
      enabled
    });
    await policy.save();
    return policy.toJSON();
  },

  async updatePolicy(id, patch) {
    const updateData = {};
    for (const [k, v] of Object.entries(patch)) {
      if (k === 'name') updateData.integrationName = v;
      else updateData[k] = v;
    }
    const policy = await AdminIntegration.findByIdAndUpdate(id, updateData, { new: true });
    return policy ? policy.toJSON() : null;
  },

  async deletePolicy(id) {
    await AdminIntegration.findByIdAndDelete(id);
    return { ok: true };
  }
};
