import { useCallback, useEffect, useState } from 'react';
import { cmsApi } from '@/services/cmsApi';
import type { CmsAsset, CmsTheme, CmsTemplate } from '@/types/cms';

export function useCmsData() {
  const [assets, setAssets] = useState<CmsAsset[]>([]);
  const [themes, setThemes] = useState<CmsTheme[]>([]);
  const [templates, setTemplates] = useState<CmsTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [themesLoading, setThemesLoading] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(false);

  const loadAssets = useCallback(async () => {
    setLoading(true);
    try {
      const r = await cmsApi.listAssets({ limit: 50 });
      setAssets(r.items || r.assets || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  const loadThemes = useCallback(async () => {
    setThemesLoading(true);
    try {
      const r = await cmsApi.listThemes({ limit: 50 });
      setThemes(r.items || r.themes || r);
    } catch (e) { console.error(e); } finally { setThemesLoading(false); }
  }, []);

  const loadTemplates = useCallback(async () => {
    setTemplatesLoading(true);
    try {
      const r = await cmsApi.listTemplates({ limit: 50 });
      setTemplates(r.items || r.templates || r);
    } catch (e) { console.error(e); } finally { setTemplatesLoading(false); }
  }, []);

  useEffect(() => { loadAssets(); loadThemes(); loadTemplates(); }, [loadAssets, loadThemes, loadTemplates]);

  return { assets, themes, templates, loading, themesLoading, templatesLoading, loadAssets, loadThemes, loadTemplates };
}

export default useCmsData;
