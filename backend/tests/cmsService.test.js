const proxyquire = require('proxyquire');
const sinon = require('sinon');
const assert = require('assert');

describe('cmsService', () => {
  let cmsService;
  let dbStub;

  beforeEach(() => {
    dbStub = { query: sinon.stub() };
    cmsService = proxyquire('../services/cmsService', {
      '../config/db': dbStub,
      '../utils/themeRegistry': { isValidThemeId: () => true, getRegistry: () => [] }
    });
  });

  it('publishAsset should snapshot and publish', async () => {
    // Call sequence in publishAsset:
    // 0: SELECT * FROM cms_assets WHERE id = $1
    // 1: SELECT COALESCE(MAX(version),0) ... from cms_version_history (inside _createVersionSnapshot)
    // 2: INSERT INTO cms_version_history ... (inside _createVersionSnapshot)
    // 3: UPDATE cms_assets SET status = 'published', version = ... RETURNING *
    dbStub.query.onCall(0).resolves({ rows: [{ id: 1, title: 'a', status: 'draft', version: 1 }] });
    dbStub.query.onCall(1).resolves({ rows: [{ maxv: 1 }] });
    dbStub.query.onCall(2).resolves({ rows: [] });
    dbStub.query.onCall(3).resolves({ rows: [{ id: 1, title: 'a', status: 'published', version: 2 }] });
    const res = await cmsService.publishAsset(1, 'admin-1');
    assert.strictEqual(res && res.status, 'published');
  });

  it('searchAssets should return results', async () => {
    dbStub.query.onFirstCall().resolves({ rows: [{ id: 1, title: 'match', description: 'd' }] });
    dbStub.query.onSecondCall().resolves({ rows: [{ total: 1 }] });
    const out = await cmsService.searchAssets({ q: 'match', tags: [] });
    assert.strictEqual(out.total, 1);
  });
});
