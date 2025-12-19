import React, { useState, useEffect } from 'react';
import { useSadhanaProgressContext } from '@/contexts/SadhanaProgressContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SynchronizationTest = () => {
  const [testSadhanaId, setTestSadhanaId] = useState<string>('test-sadhana-1');
  const [testDate, setTestDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const { 
    allProgress, 
    updateProgress, 
    isDateCompleted, 
    getProgressForDate 
  } = useSadhanaProgressContext();

  const handleToggleCompletion = async () => {
    const currentStatus = isDateCompleted(testSadhanaId, testDate);
    await updateProgress(testSadhanaId, {
      progressDate: testDate,
      completed: !currentStatus
    });
  };

  const currentProgress = getProgressForDate(testSadhanaId, testDate);
  const isCompleted = isDateCompleted(testSadhanaId, testDate);

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-black border border-amber-500/30">
      <CardHeader>
        <CardTitle className="text-amber-500">Synchronization Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-amber-200 mb-1">Sadhana ID</label>
            <input
              type="text"
              value={testSadhanaId}
              onChange={(e) => setTestSadhanaId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-amber-900/50 rounded text-amber-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-200 mb-1">Date</label>
            <input
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-amber-900/50 rounded text-amber-100"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleToggleCompletion}
            className={`flex-1 ${isCompleted ? 'bg-green-700 hover:bg-green-800' : 'bg-amber-700 hover:bg-amber-800'}`}
          >
            {isCompleted ? 'Mark as Not Completed' : 'Mark as Completed'}
          </Button>
        </div>

        <div className="bg-gray-800/50 p-4 rounded border border-amber-900/30">
          <h3 className="text-amber-500 font-semibold mb-2">Current Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-amber-200">Completed:</span>
              <span className={isCompleted ? 'text-green-400' : 'text-red-400'}>
                {isCompleted ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-200">Progress Data:</span>
              <span className="text-amber-100">
                {currentProgress ? JSON.stringify(currentProgress) : 'None'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded border border-amber-900/30">
          <h3 className="text-amber-500 font-semibold mb-2">All Progress Data</h3>
          <pre className="text-xs text-amber-100 overflow-auto max-h-40">
            {JSON.stringify(allProgress, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default SynchronizationTest;