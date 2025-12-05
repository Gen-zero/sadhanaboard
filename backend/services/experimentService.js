const Experiment = require('../schemas/Experiment');

module.exports = {
  async listExperiments({ q = '', limit = 50, offset = 0 } = {}) {
    let query = {};
    if (q) {
      query.$or = [
        { experimentName: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    const items = await Experiment.find(query)
      .sort({ _id: -1 })
      .limit(Number(limit))
      .skip(Number(offset));
    const total = await Experiment.countDocuments(query);
    return { items: items.map(i => i.toJSON()), total, limit, offset };
  },

  async getExperiment(keyOrId) {
    const experiment = await Experiment.findOne({ experimentName: keyOrId });
    if (experiment) return experiment.toJSON();
    return null;
  },

  async createExperiment(payload) {
    const {
      key,
      description = '',
      variants = {},
      trafficAllocation = {},
      startedAt = null,
      endedAt = null,
      active = true,
      metadata = {}
    } = payload;

    const experiment = new Experiment({
      experimentName: key,
      description,
      results: { variants, trafficAllocation, metadata },
      startDate: startedAt,
      actualEndDate: endedAt,
      status: active ? 'running' : 'planning'
    });
    await experiment.save();
    return experiment.toJSON();
  },

  async updateExperiment(id, patch) {
    const updateData = {};
    for (const [k, v] of Object.entries(patch)) {
      if (k === 'key') updateData.experimentName = v;
      else updateData[k] = v;
    }
    const experiment = await Experiment.findByIdAndUpdate(id, updateData, { new: true });
    return experiment ? experiment.toJSON() : null;
  },

  async deleteExperiment(id) {
    await Experiment.findByIdAndDelete(id);
    return { ok: true };
  }
};
