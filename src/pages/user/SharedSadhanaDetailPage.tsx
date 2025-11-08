import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/services/api';
import SadhanaCard from '@/components/SadhanaCard';
import SadhanaComments from '@/components/sadhana/SadhanaComments';
import { Sadhana } from '@/types/sadhana';

// Define a more permissive type for the API response
interface ApiResponse {
  [key: string]: unknown;
}

interface SharedSadhanaItem {
  id?: string | number;
  sadhana_id?: string | number;
  title?: string;
  description?: string;
  completed?: boolean;
  category?: string;
  priority?: string;
  [key: string]: unknown;
}

const SharedSadhanaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Sadhana | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    // Type the response properly
    api.getSharedSadhanaDetails(id)
      .then((res: ApiResponse) => {
        // Handle both possible response structures
        let sharedItem: SharedSadhanaItem;
        if (res && typeof res === 'object' && 'sadhana' in res && res.sadhana) {
          sharedItem = res.sadhana as SharedSadhanaItem;
        } else {
          sharedItem = res as SharedSadhanaItem;
        }
        
        // Convert to Sadhana type with default values for missing properties
        const sadhanaItem: Sadhana = {
          id: Number(sharedItem.id || sharedItem.sadhana_id || 0),
          title: typeof sharedItem.title === 'string' ? sharedItem.title : 'Untitled',
          description: typeof sharedItem.description === 'string' ? sharedItem.description : '',
          completed: typeof sharedItem.completed === 'boolean' ? sharedItem.completed : false,
          category: (typeof sharedItem.category === 'string' && ['daily', 'goal'].includes(sharedItem.category)) ? sharedItem.category as 'daily' | 'goal' : 'daily',
          priority: (typeof sharedItem.priority === 'string' && ['low', 'medium', 'high'].includes(sharedItem.priority)) ? sharedItem.priority as 'low' | 'medium' | 'high' : 'medium',
        };
        
        setItem(sadhanaItem);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!item) return <div className="p-6">Sadhana not found or not accessible.</div>;

  return (
    <div className="p-6">
      {/* Removed showSocialFeatures prop which doesn't exist in SadhanaCardProps */}
      <SadhanaCard sadhana={item} />
      <div className="mt-6">
        <SadhanaComments sadhanaId={(item as unknown as {sadhana_id?: string}).sadhana_id?.toString() || item.id.toString()} />
      </div>
    </div>
  );
};

export default SharedSadhanaDetailPage;