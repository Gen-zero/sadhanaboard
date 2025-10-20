const db = require('../config/db');
const biReportService = require('./biReportService');
const notificationService = require('./notificationService');
let cron = null;
try { cron = require('node-cron'); } catch (e) { console.warn('node-cron not installed'); }

let cronParser = null;
try { cronParser = require('cron-parser'); } catch (e) { /* optional; getNextExecutionTime will return null if absent */ }

const scheduled = new Map();

const scheduler = {
  async getAllScheduledReports() {
    const r = await db.query('SELECT * FROM scheduled_reports ORDER BY created_at DESC');
    return r.rows;
  },

  async createScheduledReport(templateId, cron_expression, recipients = [], output_format = 'pdf', created_by = null, opts = {}) {
    const name = opts.name || `Schedule for template ${templateId}`;
    const description = opts.description || null;
    const timezone = opts.timezone || 'UTC';
    const r = await db.query('INSERT INTO scheduled_reports (template_id, name, description, cron_expression, timezone, recipients, output_format, active, created_by, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,true,$8,NOW()) RETURNING *', [templateId, name, description, cron_expression, timezone, JSON.stringify(recipients || []), output_format, created_by]);
    const rec = r.rows[0];
    // compute next_run if parser available
    try { if (cronParser && rec.cron_expression) { const next = cronParser.parseExpression(rec.cron_expression, { tz: rec.timezone || 'UTC' }).next().toDate(); await db.query('UPDATE scheduled_reports SET next_run = $1 WHERE id = $2', [next.toISOString(), rec.id]); rec.next_run = next.toISOString(); } } catch (e) { /* ignore */ }
    // schedule it
    try { if (rec.active && cron) { scheduler.scheduleReport(rec.id, rec.cron_expression); } } catch (e) { console.error('Failed to schedule:', e); }
    return rec;
  },

  async updateScheduledReport(id, updates) {
    const sql = `UPDATE scheduled_reports SET name = COALESCE($1,name), description = COALESCE($2,description), cron_expression = COALESCE($3, cron_expression), timezone = COALESCE($4, timezone), recipients = COALESCE($5, recipients), output_format = COALESCE($6, output_format), active = COALESCE($7, active), updated_at = NOW() WHERE id = $8 RETURNING *`;
    const vals = [updates.name || null, updates.description || null, updates.cron_expression || null, updates.timezone || null, updates.recipients ? JSON.stringify(updates.recipients) : null, updates.output_format || null, typeof updates.active === 'boolean' ? updates.active : null, id];
    const r = await db.query(sql, vals);
    const rec = r.rows[0];
    if (rec) {
      scheduler.unscheduleReport(rec.id);
      if (rec.active && cron) scheduler.scheduleReport(rec.id, rec.cron_expression);
      // update next_run
      try { if (cronParser && rec.cron_expression) { const next = cronParser.parseExpression(rec.cron_expression, { tz: rec.timezone || 'UTC' }).next().toDate(); await db.query('UPDATE scheduled_reports SET next_run = $1 WHERE id = $2', [next.toISOString(), rec.id]); rec.next_run = next.toISOString(); } } catch (e) {}
    }
    return rec;
  },

  async deleteScheduledReport(id) {
    await db.query('DELETE FROM scheduled_reports WHERE id = $1', [id]);
    scheduler.unscheduleReport(id);
    return { ok: true };
  },

  scheduleReport(id, cronExpression) {
    if (!cron) throw new Error('node-cron not available');
    // unschedule existing
    scheduler.unscheduleReport(id);
    const task = cron.schedule(cronExpression, async () => {
      try {
        await scheduler.executeScheduledReport(id);
      } catch (e) { console.error('Scheduled execution error', e); }
    });
    scheduled.set(id, task);
    return true;
  },

  unscheduleReport(id) {
    const t = scheduled.get(id);
    if (t) { try { t.destroy(); } catch (e) {} scheduled.delete(id); }
  },

  async executeScheduledReport(id) {
    // fetch schedule
    const r = await db.query('SELECT * FROM scheduled_reports WHERE id = $1', [id]);
    const rec = r.rows[0];
    if (!rec) throw new Error('Scheduled report not found');
    // create execution entry
    const start = new Date().toISOString();
    const execR = await db.query('INSERT INTO report_executions (scheduled_id, template_id, status, started_at, created_at) VALUES ($1,$2,$3,$4,NOW()) RETURNING *', [rec.id, rec.template_id, 'running', start]);
    const exec = execR.rows[0];
    try {
      const result = await biReportService.executeReportTemplate(rec.template_id, {});
      // store result: finished_at, status, result_url or result_data
      const finished = new Date().toISOString();
      await db.query('UPDATE report_executions SET finished_at = $1, status = $2, result_data = $3, result_url = $4 WHERE id = $5', [finished, 'completed', JSON.stringify(result), result.result_url || null, exec.id]);
      // deliver via email/notification
      try { await notificationService.sendReportToRecipients(rec.recipients || [], result, rec.output_format || 'pdf'); } catch (e) { console.error('Failed to send report to recipients', e); }
      // emit via global io if present
      try { if (global.__ADMIN_IO__) global.__ADMIN_IO__.to('bi-executions').emit('bi:execution-status', { executionId: exec.id, status: 'completed' }); } catch (e) {}
      return { ok: true, execution: exec };
    } catch (e) {
      const finished = new Date().toISOString();
      await db.query('UPDATE report_executions SET finished_at = $1, status = $2, error = $3 WHERE id = $4', [finished, 'failed', String(e), exec.id]);
      try { if (global.__ADMIN_IO__) global.__ADMIN_IO__.to('bi-executions').emit('bi:execution-status', { executionId: exec.id, status: 'failed', message: String(e) }); } catch (e2) {}
      throw e;
    }
  },

  getNextExecutionTime(cronExpression) {
    try { if (!cronParser) return null; return cronParser.parseExpression(cronExpression).next().toString(); } catch (e) { return null; }
  },
};

module.exports = scheduler;
