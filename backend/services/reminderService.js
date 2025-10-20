const db = require('../config/db');
const cron = require('node-cron');
const cronParser = require('cron-parser');
const notificationService = require('./notificationService');

// Registry of scheduled cron jobs: templateId -> cron job
const scheduledJobs = new Map();

async function executeReminder(template) {
  try {
    const channelIds = template.channel_ids || [];
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
  unscheduleTemplate(template.id);
  if (!template || !template.enabled || !template.schedule_cron) return;
  try {
    cronParser.parseExpression(template.schedule_cron);
    const job = cron.schedule(template.schedule_cron, () => {
      executeReminder(template).catch(() => {});
    }, { scheduled: true, timezone: 'UTC' });
    scheduledJobs.set(template.id, job);
  } catch (err) {
    // invalid cron expression - ignore scheduling
  }
}

module.exports = {
  async listTemplates({ limit = 50, offset = 0 } = {}) {
    const res = await db.query(`SELECT * FROM admin_reminder_templates ORDER BY id DESC LIMIT $1 OFFSET $2`, [limit, offset]);
    return { items: res.rows, total: res.rowCount, limit, offset };
  },
  async getTemplate(id) {
    const res = await db.query(`SELECT * FROM admin_reminder_templates WHERE id = $1`, [id]);
    return res.rows[0] || null;
  },
  async createTemplate({ key, title = '', body = '', schedule_cron = null, channel_ids = [], enabled = true, metadata = {} }) {
    const res = await db.query(`INSERT INTO admin_reminder_templates(key,title,body,schedule_cron,channel_ids,enabled,metadata) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`, [key, title, body, schedule_cron, channel_ids, enabled, metadata]);
    const template = res.rows[0];
    if (template && template.enabled && template.schedule_cron) scheduleTemplate(template);
    return template;
  },
  async updateTemplate(id, patch) {
    const keys = [], values = []; let idx = 1;
    for (const k of Object.keys(patch)) { keys.push(`${k} = $${idx++}`); values.push(patch[k]); }
    if (!keys.length) return this.getTemplate(id);
    values.push(id);
    const res = await db.query(`UPDATE admin_reminder_templates SET ${keys.join(', ')} WHERE id = $${idx} RETURNING *`, values);
    const template = res.rows[0];
    // Always reschedule after any successful update so scheduled jobs use latest template data
    if (template) scheduleTemplate(template);
    return template;
  },
  async deleteTemplate(id) {
    unscheduleTemplate(id);
    await db.query(`DELETE FROM admin_reminder_templates WHERE id = $1`, [id]);
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
      const res = await db.query(`SELECT * FROM admin_reminder_templates WHERE enabled = true AND schedule_cron IS NOT NULL`);
      const templates = res.rows || [];
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
