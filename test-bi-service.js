import biService from './backend/services/biReportService.js';

async function testBIService() {
  try {
    console.log('Testing BI Service...');
    
    const snapshot = await biService.getKPISnapshot();
    console.log('KPI Snapshot:', snapshot);
    
    const communityMetrics = await biService.getCommunityHealthMetrics();
    console.log('Community Metrics:', communityMetrics);
    
    const engagement = await biService.getEngagementAnalytics();
    console.log('Engagement Analytics:', engagement);
    
  } catch (error) {
    console.error('Error testing BI Service:', error.message);
  }
}

testBIService();