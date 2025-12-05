const FeatureFlag = require('../schemas/FeatureFlag');

module.exports = {
  async listFlags({ q = '', limit = 50, offset = 0 } = {}) {
    let query = {};
    if (q) {
      query.$or = [
        { flagName: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    const items = await FeatureFlag.find(query)
      .sort({ _id: -1 })
      .limit(Number(limit))
      .skip(Number(offset));
    const total = await FeatureFlag.countDocuments(query);
    return { items: items.map(i => i.toJSON()), total, limit, offset };
  },

  async getFlag(keyOrId) {
    const flag = await FeatureFlag.findOne({ flagName: keyOrId });
    if (flag) return flag.toJSON();
    return null;
  },

  async createFlag({ key, description = '', enabled = false, conditions = {} }) {
    const flag = new FeatureFlag({
      flagName: key,
      description,
      enabled,
      metadata: conditions
    });
    await flag.save();
    return flag.toJSON();
  },

  async updateFlag(id, patch) {
    const updateData = {};
    for (const [k, v] of Object.entries(patch)) {
      if (k === 'key') updateData.flagName = v;
      else updateData[k] = v;
    }
    const flag = await FeatureFlag.findByIdAndUpdate(id, updateData, { new: true });
    return flag ? flag.toJSON() : null;
  },

  async deleteFlag(id) {
    await FeatureFlag.findByIdAndDelete(id);
    return { ok: true };
  }
};
