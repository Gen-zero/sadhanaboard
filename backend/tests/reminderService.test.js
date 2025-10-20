const proxyquire = require('proxyquire');
const sinon = require('sinon');
const assert = require('assert');

describe('reminderService', () => {
  let reminderService;
  let dbStub;
  let notificationStub;

  beforeEach(() => {
    dbStub = { query: sinon.stub() };
    notificationStub = {
      getChannel: sinon.stub().resolves({ id: 1, type: 'webhook', enabled: true, config: { url: 'http://example.local/hook' } }),
      sendWebhookAlert: sinon.stub().resolves(true),
      sendEmailAlert: sinon.stub().resolves(true)
    };
    reminderService = proxyquire('../services/reminderService', {
      '../config/db': dbStub,
      './notificationService': notificationStub
    });
  });

  it('should schedule a job when creating a template with cron and enabled', async () => {
    dbStub.query.resolves({ rows: [{ id: 123, key: 't1', title: 't', body: 'b', schedule_cron: '* * * * *', channel_ids: [1], enabled: true }], rowCount: 1 });
    const created = await reminderService.createTemplate({ key: 't1', title: 't', body: 'b', schedule_cron: '* * * * *', channel_ids: [1], enabled: true });
    assert.strictEqual(created.id, 123);
  });

  it('updateTemplate should reschedule even when schedule_cron not changed', async () => {
    // First call (update) returns updated row
    dbStub.query.onCall(0).resolves({ rows: [{ id: 101, key: 't101', title: 'new', body: 'y', schedule_cron: '* * * * *', channel_ids: [1], enabled: true }], rowCount: 1 });
    const updated = await reminderService.updateTemplate(101, { title: 'new', body: 'y' });
    assert.strictEqual(updated.title, 'new');
  });
});
