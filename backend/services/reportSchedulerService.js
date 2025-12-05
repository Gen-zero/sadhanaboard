const { ScheduledReport, ReportExecution } = require('../models');
const biReportService = require('./biReportService');
const notificationService = require('./notificationService');
let cron = null;
try { cron = require('node-cron'); } catch (e) { console.warn('node-cron not installed'); }

let cronParser = null;
try { cronParser = require('cron-parser'); } catch (e) { /* optional; getNextExecutionTime will return null if absent */ }

const scheduled = new Map();

const scheduler = {
  async getAllScheduledReports() {
    return await ScheduledReport.find().sort({ createdAt: -1 }).lean();
  },

  async createScheduledReport(templateId, cron_expression, recipients = [], output_format = 'pdf', created_by = null, opts = {}) {
    const name = opts.name || `Schedule for template ${templateId}`;
    const description = opts.description || null;
    const timezone = opts.timezone || 'UTC';
    const rec = new ScheduledReport({
      templateId,
      name,
      description,
      cronExpression: cron_expression,
      timezone,
      recipients: recipients || [],
      outputFormat: output_format,
      active: true,
      createdBy: created_by,
      createdAt: new Date()
    });
    await rec.save();
    const result = rec.toJSON();
    // compute next_run if parser available
    try {
      if (cronParser && result.cronExpression) {
        const next = cronParser.parseExpression(result.cronExpression, { tz: result.timezone || 'UTC' }).next().toDate();
        await ScheduledReport.findByIdAndUpdate(rec._id, { nextRun: next }, { new: true });
        result.nextRun = next;
      }
    } catch (e) { /* ignore */ }
    // schedule it
    try { if (result.active && cron) { scheduler.scheduleReport(rec._id, result.cronExpression); } } catch (e) { console.error('Failed to schedule:', e); }
    return result;
  },

  async updateScheduledReport(id, updates) {
    const updateData = {};
    if (updates.hasOwnProperty('name')) updateData.name = updates.name;
    if (updates.hasOwnProperty('description')) updateData.description = updates.description;
    if (updates.hasOwnProperty('cron_expression')) updateData.cronExpression = updates.cron_expression;
    if (updates.hasOwnProperty('timezone')) updateData.timezone = updates.timezone;
    if (updates.hasOwnProperty('recipients')) updateData.recipients = updates.recipients;
    if (updates.hasOwnProperty('output_format')) updateData.outputFormat = updates.output_format;
    if (updates.hasOwnProperty('active')) updateData.active = updates.active;
    updateData.updatedAt = new Date();
    const rec = await ScheduledReport.findByIdAndUpdate(id, updateData, { new: true }).lean();
    if (rec) {
      scheduler.unscheduleReport(rec._id);
      if (rec.active && cron) scheduler.scheduleReport(rec._id, rec.cronExpression);
      // update next_run
      try {
        if (cronParser && rec.cronExpression) {
          const next = cronParser.parseExpression(rec.cronExpression, { tz: rec.timezone || 'UTC' }).next().toDate();
          await ScheduledReport.findByIdAndUpdate(id, { nextRun: next }, { new: true });
          rec.nextRun = next;
        }
      } catch (e) {}
    }
    return rec;
  },

  async deleteScheduledReport(id) {
    await ScheduledReport.deleteOne({ _id: id });
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
    const rec = await ScheduledReport.findById(id).lean();
    if (!rec) throw new Error('Scheduled report not found');
    // create execution entry
    const start = new Date().toISOString();
    const exec = new ReportExecution({
      scheduledId: rec._id,
      templateId: rec.templateId,
      status: 'running',
      startedAt: start,
      createdAt: new Date()
    });
    await exec.save();
    const execData = exec.toJSON();
    try {
      const result = await biReportService.executeReportTemplate(rec.templateId, {});
      // store result: finished_at, status, result_url or result_data
      const finished = new Date().toISOString();
      await ReportExecution.findByIdAndUpdate(execData._id, {
        finishedAt: finished,
        status: 'completed',
        resultData: result,
        resultUrl: result.result_url || null
      });
      // deliver via email/notification
      try { await notificationService.sendReportToRecipients(rec.recipients || [], result, rec.outputFormat || 'pdf'); } catch (e) { console.error('Failed to send report to recipients', e); }
      // emit via global io if present
      try { if (global.__ADMIN_IO__) global.__ADMIN_IO__.to('bi-executions').emit('bi:execution-status', { executionId: execData._id, status: 'completed' }); } catch (e) {}
      return { ok: true, execution: execData };
    } catch (e) {
      const finished = new Date().toISOString();
      await ReportExecution.findByIdAndUpdate(execData._id, {
        finishedAt: finished,
        status: 'failed',
        error: String(e)
      });
      try { if (global.__ADMIN_IO__) global.__ADMIN_IO__.to('bi-executions').emit('bi:execution-status', { executionId: execData._id, status: 'failed', message: String(e) }); } catch (e2) {}
      throw e;
    }
  },

  getNextExecutionTime(cronExpression) {
    try { if (!cronParser) return null; return cronParser.parseExpression(cronExpression).next().toString(); } catch (e) { return null; }
  },
};

module.exports = scheduler;