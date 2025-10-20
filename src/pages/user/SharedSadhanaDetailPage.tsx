import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/services/api';
import SadhanaCard from '@/components/SadhanaCard';
import SadhanaComments from '@/components/sadhana/SadhanaComments';

const SharedSadhanaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getSharedSadhanaDetails(id)
      .then((res) => setItem(res.sadhana || res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!item) return <div className="p-6">Sadhana not found or not accessible.</div>;

  return (
    <div className="p-6">
      <SadhanaCard sadhana={item} showSocialFeatures />
      <div className="mt-6">
        <SadhanaComments sadhanaId={item.sadhana_id || item.id} />
      </div>
    </div>
  );
};

export default SharedSadhanaDetailPage;
