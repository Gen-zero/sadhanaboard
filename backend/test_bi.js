const biService = require('./services/biReportService');

async function testBI() {
  try {
    console.log('Testing BI service...');
    
    // Test KPI snapshot
    const kpiSnapshot = await biService.getKPISnapshot();
    console.log('KPI Snapshot:', JSON.stringify(kpiSnapshot, null, 2));
    
    // Test engagement analytics
    const engagement = await biService.getEngagementAnalytics();
    console.log('Engagement Analytics:', JSON.stringify(engagement, null, 2));
    
    // Test community health metrics
    const communityHealth = await biService.getCommunityHealthMetrics();
    console.log('Community Health Metrics:', JSON.stringify(communityHealth, null, 2));
    
    // Test report templates
    const templates = await biService.getReportTemplates();
    console.log('Report Templates:', JSON.stringify(templates, null, 2));
    
    console.log('All BI tests completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('BI test failed:', error.message);
    process.exit(1);
  }
}

testBI();