import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useCmsData from '@/hooks/useCmsData';
import { cmsApi } from '@/services/cmsApi';
// dynamic require for react-dropzone so code compiles even if package not installed yet
// fallback provides a no-op dropzone so the UI still renders (install react-dropzone for full DnD)
let useDropzone: any;
try {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useDropzone = require('react-dropzone').useDropzone;
} catch (e) {
  useDropzone = (opts: any) => ({ getRootProps: () => ({}), getInputProps: () => ({}), isDragActive: false });
}

export default function AssetManager() {
  const { assets, loading, loadAssets } = useCmsData();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [previewVariants, setPreviewVariants] = useState<any[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    if (!acceptedFiles || !acceptedFiles.length) return;
    setUploading(true);
    try {
      for (const f of acceptedFiles) {
        await cmsApi.uploadAsset(f, { title: f.name });
      }
      await loadAssets();
    } catch (e: any) {
      console.error('upload error', e);
      setError(e?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [loadAssets]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

  const showVariants = async (assetId: number) => {
    try {
      const r = await cmsApi.getAsset(assetId);
      const a = r.asset || r;
      setSelectedAsset(a);
      setPreviewVariants(r.variants || a.variants || []);
    } catch (e) {
      console.error('failed to load asset', e);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Asset Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button onClick={() => loadAssets()}>Refresh</Button>
              <div {...getRootProps()} className={`p-2 border rounded ${isDragActive ? 'bg-white/5' : ''}`}>
                <input {...getInputProps()} />
                <span className="text-sm">Drag & drop files here or click to upload</span>
              </div>
            </div>
            <div>
              {uploading ? <span>Uploading...</span> : null}
            </div>
          </div>

          {error && <div className="text-destructive mb-2">{error}</div>}

          <div>
            {loading ? <div>Loading...</div> : (
              <div className="grid grid-cols-4 gap-3">
                {assets.map(a => (
                  <div key={a.id} className="p-2 border rounded cursor-pointer" onClick={() => showVariants(a.id)}>
                    <div className="text-sm font-medium truncate">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.type}</div>
                    <div className="mt-2 text-xs text-muted-foreground">{a.file_path}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedAsset && (
            <div className="mt-4 p-3 border rounded">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium">{selectedAsset.title}</div>
                  <div className="text-xs text-muted-foreground">{selectedAsset.mime_type}</div>
                </div>
                <Button variant="ghost" onClick={() => { setSelectedAsset(null); setPreviewVariants([]); }}>Close</Button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {previewVariants.map(v => (
                  <div key={v.id} className="p-1 border rounded text-center">
                    <div className="text-xs font-medium">{v.variant_type}</div>
                    <img src={v.file_path} alt={v.variant_type} className="w-full h-20 object-cover mt-1" />
                    <div className="text-xs text-muted-foreground">{v.file_size} bytes</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
