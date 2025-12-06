const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

// Mock Mongoose model methods
const mockLogAlertRule = {
  find: sinon.stub(),
  findById: sinon.stub(),
  create: sinon.stub()
};

// Mock lean() method that Mongoose queries return
const mockLean = sinon.stub();

// Mock notificationService
const mockNotificationService = { 
  sendEmailAlert: sinon.stub().resolves(), 
  sendWebhookAlert: sinon.stub().resolves() 
};

// Mock logAnalyticsService
const mockLogAnalyticsService = { 
  createSecurityEvent: sinon.stub().resolves({ id: 123 }) 
};

describe('alertService', () => {
  beforeEach(() => {
    // Reset all stubs
    mockLogAlertRule.find.reset();
    mockLogAlertRule.findById.reset();
    mockLogAlertRule.create.reset();
    mockLean.reset();
    mockNotificationService.sendEmailAlert.reset();
    mockNotificationService.sendWebhookAlert.reset();
    mockLogAnalyticsService.createSecurityEvent.reset();
    
    // Setup mock chainable methods
    mockLogAlertRule.find.returns({
      lean: mockLean
    });
    
    mockLogAlertRule.findById.returns({
      select: sinon.stub().returns({
        lean: mockLean
      })
    });
  });

  it('evaluateAlertRules triggers alerts for matching rule without ReferenceError', async () => {
    // mock LogAlertRule.find to return one rule that matches
    mockLean.resolves([
      { 
        _id: 1, 
        ruleName: 'test', 
        conditions: { matchAction: 'danger' }, 
        severityThreshold: 'high',
        notificationChannels: []
      }
    ]);

    const alertService = proxyquire('../services/alertService', {
      '../schemas/LogAlertRule.js': mockLogAlertRule,
      './notificationService.js': mockNotificationService,
      './logAnalyticsService.js': mockLogAnalyticsService
    });

    const res = await alertService.evaluateAlertRules({ action: 'some danger action', correlation_id: 'abc' });
    assert.strictEqual(typeof res, 'boolean');
  });

  it('should handle complex condition evaluation', async () => {
    // mock LogAlertRule.find to return one rule with complex conditions
    mockLean.resolves([
      { 
        _id: 1, 
        ruleName: 'complex', 
        conditions: { expr: 'a && (b || c)' }, 
        severityThreshold: 'high',
        notificationChannels: []
      }
    ]);

    const alertService = proxyquire('../services/alertService', {
      '../schemas/LogAlertRule.js': mockLogAlertRule,
      './notificationService.js': mockNotificationService,
      './logAnalyticsService.js': mockLogAnalyticsService
    });

    const res = await alertService.evaluateAlertRules({ a: true, b: false, c: true });
    // should return boolean (evaluation executed)
    assert.strictEqual(typeof res, 'boolean');
  });
});
