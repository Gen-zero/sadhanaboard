import React from 'react';

export default function ExperimentManager({ advanced }: any) {
  return (
    <div>
      <h2 className="text-lg font-medium mb-2">A/B Experiments</h2>
      {advanced.loading ? <div>Loading...</div> : (
        <div className="space-y-2">
          {advanced.experiments.map((e: any) => (
            <div key={e.id} className="p-2 border rounded">
              <div className="font-medium">{e.key}</div>
              <div className="text-sm text-muted-foreground">{e.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
