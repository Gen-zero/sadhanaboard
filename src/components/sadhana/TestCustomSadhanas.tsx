import { useCustomSadhanas } from '@/hooks/useCustomSadhanas';

const TestCustomSadhanas = () => {
  const { customSadhanas, saveCustomSadhana, deleteCustomSadhana } = useCustomSadhanas();

  const handleSaveTestSadhana = () => {
    const testData = {
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

  const handleDeleteSadhana = (id: string) => {
    deleteCustomSadhana(id);
    console.log('Deleted custom sadhana with id:', id);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Test Custom Sadhanas</h2>
      
      <div className="mb-4">
        <button 
          onClick={handleSaveTestSadhana}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Test Sadhana
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Saved Custom Sadhanas:</h3>
        {customSadhanas.length === 0 ? (
          <p>No custom sadhanas saved yet.</p>
        ) : (
          <ul className="space-y-2">
            {customSadhanas.map((sadhana) => (
              <li key={sadhana.id} className="p-2 bg-gray-700 rounded flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{sadhana.name}</h4>
                  <p className="text-sm text-gray-300">{sadhana.description}</p>
                </div>
                <button 
                  onClick={() => handleDeleteSadhana(sadhana.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TestCustomSadhanas;