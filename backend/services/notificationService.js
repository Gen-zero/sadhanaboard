const AdminIntegration = require('../schemas/AdminIntegration');

module.exports = {
  async listChannels({ limit = 50, offset = 0 } = {}) {
    const items = await AdminIntegration.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(offset));
    const total = await AdminIntegration.countDocuments();
    return { items: items.map(i => i.toJSON()), total, limit, offset };
  },

  async getChannel(id) {
    const channel = await AdminIntegration.findById(id);
    return channel ? channel.toJSON() : null;
  },

  async createChannel({ name, type, config = {}, enabled = true }) {
    const channel = new AdminIntegration({
      integrationName: name,
      integrationKey: `${type}-${Date.now()}`,
      configuration: config,
      enabled
    });
    await channel.save();
    return channel.toJSON();
  },

  async updateChannel(id, patch) {
    const updateData = {};
    for (const [k, v] of Object.entries(patch)) {
      if (k === 'name') updateData.integrationName = v;
      else if (k === 'config') updateData.configuration = v;
      else updateData[k] = v;
    }
    const channel = await AdminIntegration.findByIdAndUpdate(id, updateData, { new: true });
    return channel ? channel.toJSON() : null;
  },

  async deleteChannel(id) {
    await AdminIntegration.findByIdAndDelete(id);
    return { ok: true };
  }
};
