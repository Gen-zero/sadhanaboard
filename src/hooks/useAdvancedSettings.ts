import { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';

export default function useAdvancedSettings() {
  const [loading, setLoading] = useState(false);
  const [featureFlags, setFeatureFlags] = useState<any[]>([]);
  const [experiments, setExperiments] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<any[]>([]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [ff, ex, ch, ints] = await Promise.all([
        adminApi.listFeatureFlags({ limit: 200 }),
        adminApi.listExperiments({ limit: 200 }),
        adminApi.listNotificationChannels({ limit: 200 }),
        adminApi.listIntegrations({ limit: 200 })
      ]);
      setFeatureFlags(ff.items || []);
      setExperiments(ex.items || []);
      setChannels(ch.items || []);
      setIntegrations(ints.items || []);
    } catch (e) {
      console.error('Failed to load advanced settings', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  // Define loadAll using useCallback to prevent unnecessary re-renders
  // Note: We intentionally keep loadAll as a regular function since it's only called on mount
  // and through the reload property, and doesn't need to be a dependency anywhere

  return {
    loading,
    featureFlags,
    experiments,
    channels,
    integrations,
    reload: loadAll,
    // expose adminApi so managers can call create/update/delete
    api: adminApi
  };
}
