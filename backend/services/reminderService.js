const cron = require('node-cron');
const cronParser = require('cron-parser');
const notificationService = require('./notificationService');
const { AdminReminderTemplate } = require('../models');

// Registry of scheduled cron jobs: templateId -> cron job
const scheduledJobs = new Map();

async function executeReminder(template) {
  try {
    const channelIds = template.channelIds || [];
    if (!channelIds.length) return;
    for (const channelId of channelIds) {
      try {
        const channel = await notificationService.getChannel(channelId);
        if (!channel || !channel.enabled) continue;
        const payload = { title: template.title || 'Reminder', body: template.body || '', metadata: template.metadata || {}, templateKey: template.key };
        if (channel.type === 'email') {
          const recipients = channel.config && channel.config.recipients ? channel.config.recipients : [];
          if (recipients.length) await notificationService.sendEmailAlert(recipients, payload);
        } else if (channel.type === 'webhook') {
          const url = channel.config && channel.config.url;
          if (url) await notificationService.sendWebhookAlert(url, payload);
        } else {
          // future: push, sms
        }
      } catch (err) {
        // avoid noisy console logs; rely on server-side logs if needed
      }
    }
  } catch (err) {
    // swallow errors in scheduled tasks
  }
}

function unscheduleTemplate(templateId) {
  const job = scheduledJobs.get(templateId);
  if (job) {
    try { job.stop(); } catch (e) {}
    scheduledJobs.delete(templateId);
  }
}

function scheduleTemplate(template) {
  unscheduleTemplate(template.id || template._id);
  if (!template || !template.enabled || !template.scheduleCron) return;
  try {
    cronParser.parseExpression(template.scheduleCron);
    const job = cron.schedule(template.scheduleCron, () => {
      executeReminder(template).catch(() => {});
    }, { scheduled: true, timezone: 'UTC' });
    scheduledJobs.set(template.id || template._id, job);
  } catch (err) {
    // invalid cron expression - ignore scheduling
  }
}

module.exports = {
  async listTemplates({ limit = 50, offset = 0 } = {}) {
    const total = await AdminReminderTemplate.countDocuments();
    const items = await AdminReminderTemplate.find().sort({ _id: -1 }).limit(limit).skip(offset).lean();
    return { items, total, limit, offset };
  },
  async getTemplate(id) {
    return await AdminReminderTemplate.findById(id).lean() || null;
  },
  async createTemplate({ key, title = '', body = '', schedule_cron = null, channel_ids = [], enabled = true, metadata = {} }) {
    const template = new AdminReminderTemplate({
      key,
      title,
      body,
      scheduleCron: schedule_cron,
      channelIds: channel_ids,
      enabled,
      metadata
    });
    await template.save();
    const result = template.toJSON();
    if (result.enabled && result.scheduleCron) scheduleTemplate(result);
    return result;
  },
  async updateTemplate(id, patch) {
    const updates = {};
    if (patch.hasOwnProperty('schedule_cron')) updates.scheduleCron = patch.schedule_cron;
    if (patch.hasOwnProperty('channel_ids')) updates.channelIds = patch.channel_ids;
    if (patch.hasOwnProperty('key')) updates.key = patch.key;
    if (patch.hasOwnProperty('title')) updates.title = patch.title;
    if (patch.hasOwnProperty('body')) updates.body = patch.body;
    if (patch.hasOwnProperty('enabled')) updates.enabled = patch.enabled;
    if (patch.hasOwnProperty('metadata')) updates.metadata = patch.metadata;
    if (!Object.keys(updates).length) return this.getTemplate(id);
    const template = await AdminReminderTemplate.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (template) scheduleTemplate(template);
    return template;
  },
  async deleteTemplate(id) {
    unscheduleTemplate(id);
    await AdminReminderTemplate.deleteOne({ _id: id });
    return { ok: true };
  },
  async triggerReminder(templateId) {
    const template = await this.getTemplate(templateId);
    if (!template) throw new Error(`Template ${templateId} not found`);
    await executeReminder(template);
    return { ok: true, triggered: template.key };
  },
  async initializeScheduledJobs() {
    try {
      const templates = await AdminReminderTemplate.find({ enabled: true, scheduleCron: { $ne: null } }).lean();
      for (const t of templates) scheduleTemplate(t);
      return { scheduled: templates.length };
    } catch (err) {
      return { scheduled: 0, error: err && err.message };
    }
  },
  getScheduledJobsStatus() {
    const jobs = [];
    for (const [templateId, job] of scheduledJobs.entries()) {
      jobs.push({ templateId, running: Boolean(job && job.running) });
    }
    return { total: jobs.length, jobs };
  }
};
