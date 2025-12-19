import { useEffect, useState } from 'react';
import { useCustomSadhanas } from '@/hooks/useCustomSadhanas';

const DebugCustomSadhanas = () => {
  const { customSadhanas, saveCustomSadhana } = useCustomSadhanas();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    // Check localStorage directly
    try {
      const stored = localStorage.getItem('custom-sadhanas');
      setDebugInfo({
        localStorageData: stored ? JSON.parse(stored) : null,
        customSadhanasHook: customSadhanas
      });
    } catch (error) {
      console.error('Error reading localStorage:', error);
    }
  }, [customSadhanas]);

  const handleSaveTestSadhana = () => {
    const testData: any = {
      purpose: "Test Purpose",
      goal: "Test Goal",
      deity: "Test Deity",
      message: "Test Message",
      offerings: ["Offering 1", "Offering 2"],
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      durationDays: 40,
      name: "Test Custom Sadhana",
      description: "This is a test custom sadhana"
    };

    const saved = saveCustomSadhana(testData);
    console.log('Saved custom sadhana:', saved);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg m-4">
      <h2 className="text-xl font-bold mb-4">Debug Custom Sadhanas</h2>
      
      <div className="mb-4">
        <button 
          onClick={handleSaveTestSadhana}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
        >
          Save Test Sadhana
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Refresh Data
        </button>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Debug Info:</h3>
        <pre className="bg-black/50 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DebugCustomSadhanas;