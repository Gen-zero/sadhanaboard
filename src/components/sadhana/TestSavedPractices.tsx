import { useState } from 'react';
import { useCustomSadhanas } from '@/hooks/useCustomSadhanas';

const TestSavedPractices = () => {
  const { customSadhanas, saveCustomSadhana } = useCustomSadhanas();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    purpose: '',
    goal: '',
    deity: ''
  });

  const handleSave = () => {
    const testData: any = {
      ...formData,
      offerings: ['Test Offering'],
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      durationDays: 40,
    };

    saveCustomSadhana(testData);
    setShowForm(false);
    setFormData({
      name: '',
      description: '',
      purpose: '',
      goal: '',
      deity: ''
    });
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg m-4">
      <h2 className="text-2xl font-bold mb-4">Test Saved Practices</h2>
      
      <button 
        onClick={() => setShowForm(!showForm)}
        className="px-4 py-2 bg-blue-600 text-white rounded mb-4 hover:bg-blue-700"
      >
        {showForm ? 'Cancel' : 'Add Test Practice'}
      </button>

      {showForm && (
        <div className="mb-6 p-4 bg-gray-800 rounded">
          <h3 className="text-xl font-semibold mb-3">Add Test Practice</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Practice Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
            <input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
            <input
              type="text"
              placeholder="Purpose"
              value={formData.purpose}
              onChange={(e) => setFormData({...formData, purpose: e.target.value})}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
            <input
              type="text"
              placeholder="Goal"
              value={formData.goal}
              onChange={(e) => setFormData({...formData, goal: e.target.value})}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
            <input
              type="text"
              placeholder="Deity"
              value={formData.deity}
              onChange={(e) => setFormData({...formData, deity: e.target.value})}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save Practice
            </button>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-3">Saved Practices ({customSadhanas.length})</h3>
        {customSadhanas.length === 0 ? (
          <p className="text-gray-400">No saved practices yet.</p>
        ) : (
          <div className="space-y-3">
            {customSadhanas.map((sadhana) => (
              <div key={sadhana.id} className="p-3 bg-gray-800 rounded">
                <h4 className="font-bold">{sadhana.name || 'Unnamed Practice'}</h4>
                <p className="text-sm text-gray-300">{sadhana.description || 'No description'}</p>
                <p className="text-xs text-gray-500">Created: {new Date(sadhana.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSavedPractices;