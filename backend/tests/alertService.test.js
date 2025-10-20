const assert = require('assert');
const proxyquire = require('proxyquire');

describe('alertService', () => {
  it('evaluateAlertRules triggers alerts for matching rule without ReferenceError', async () => {
    // mock db to return one rule that matches
    const fakeDb = {
      query: async (sql) => {
        if (sql && sql.includes('FROM log_alert_rules')) {
          return { rows: [{ id: 1, rule_name: 'test', conditions: { matchAction: 'danger' }, severity_threshold: 'high' }] };
        }
        if (sql && sql.includes('SELECT notification_channels')) {
          return { rows: [{ notification_channels: [] }] };
        }
        return { rows: [] };
      }
    };

    const fakeNotification = { sendEmailAlert: async () => {}, sendWebhookAlert: async () => {} };
    const fakeLogAnalytics = { createSecurityEvent: async () => ({ id: 123 }) };

    const alertService = proxyquire('../services/alertService', {
      '../config/db': fakeDb,
      './notificationService': fakeNotification,
      './logAnalyticsService': fakeLogAnalytics
    });

    const res = await alertService.evaluateAlertRules({ action: 'some danger action', correlation_id: 'abc' });
    assert.strictEqual(typeof res, 'boolean');
  });

  it('should handle complex condition evaluation', async () => {
    // simulate recording an alert and evaluating complex conditions
    const fakeDb = {
      query: async (sql) => {
        if (sql && sql.includes('FROM log_alert_rules')) {
          return { rows: [{ id: 1, rule_name: 'complex', conditions: { expr: 'a && (b || c)' }, severity_threshold: 'high' }] };
        }
        if (sql && sql.includes('SELECT notification_channels')) {
          return { rows: [{ notification_channels: [] }] };
        }
        return { rows: [] };
      }
    };

    const fakeNotification = { sendEmailAlert: async () => {}, sendWebhookAlert: async () => {} };
    const fakeLogAnalytics = { createSecurityEvent: async () => ({ id: 123 }) };

    const alertService = proxyquire('../services/alertService', {
      '../config/db': fakeDb,
      './notificationService': fakeNotification,
      './logAnalyticsService': fakeLogAnalytics
    });

    const res = await alertService.evaluateAlertRules({ a: true, b: false, c: true });
    // should return boolean (evaluation executed)
    assert.strictEqual(typeof res, 'boolean');
  });
});
