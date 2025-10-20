const systemMetrics = require('../services/systemMetricsService');

module.exports = function metricsMiddleware(options = {}) {
  const sampleRate = options.sampleRate || 1.0; // 1.0 = sample everything
  return async function (req, res, next) {
    const start = Date.now();
    const onFinish = async () => {
      try {
        const duration = Date.now() - start;
        const meta = { path: req.path, query: req.query };
        const rec = {
          endpoint: req.path,
          method: req.method,
          status_code: res.statusCode || 200,
          response_time_ms: duration,
          requests_count: 1,
          error_count: res.statusCode >= 500 ? 1 : 0,
          meta
        };
        // sample
        if (Math.random() <= sampleRate) {
          await systemMetrics.storeApiMetric(rec);
        }
      } catch (e) { /* ignore */ }
    };
    res.on('finish', onFinish);
    res.on('close', onFinish);
    next();
  };
};
