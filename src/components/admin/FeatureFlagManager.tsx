import React from 'react';

export default function FeatureFlagManager({ advanced }: any) {
  return (
    <div>
      <h2 className="text-lg font-medium mb-2">Feature Flags</h2>
      <div className="space-y-2">
        {advanced.loading ? <div>Loading...</div> : (
          advanced.featureFlags.map((f: any) => (
            <div key={f.id} className="p-2 border rounded">
              <div className="font-medium">{f.key}</div>
              <div className="text-sm text-muted-foreground">{f.description}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
