import React from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import type { UserSegmentationFilters } from '@/types/admin';

export default function UserSegmentationFilters({ value = {}, onChange }: { value?: Partial<UserSegmentationFilters>; onChange: (v: Partial<UserSegmentationFilters>) => void }) {
  return (
    <div className="p-4 bg-background/40 rounded-md">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Experience Level</label>
          <Select value={value.experience_level ?? '__any'} onValueChange={(v) => onChange({ ...value, experience_level: v === '__any' ? undefined : (v as any) })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__any">Any</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm">Onboarding</label>
          <div className="flex items-center space-x-2">
            <Checkbox checked={!!value.onboarding_completed} onCheckedChange={(v) => onChange({ ...value, onboarding_completed: !!v })} />
            <span className="text-sm">Completed</span>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <label className="text-sm">Presets</label>
        <div className="mt-2 flex space-x-2">
          <Badge onClick={() => onChange({ ...value, preset: 'new_users' } as any)}>New Users</Badge>
          <Badge onClick={() => onChange({ ...value, preset: 'active_practitioners' } as any)}>Active Practitioners</Badge>
          <Badge onClick={() => onChange({ ...value, preset: 'advanced_students' } as any)}>Advanced</Badge>
        </div>
      </div>
    </div>
  );
}
