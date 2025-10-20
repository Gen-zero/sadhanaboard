import React, { useState } from 'react';
import CommunityActivityStream from '@/components/admin/CommunityActivityStream';
import ContentModerationPanel from '@/components/admin/ContentModerationPanel';
import EventManagementPanel from '@/components/admin/EventManagementPanel';
import MentorshipManagementPanel from '@/components/admin/MentorshipManagementPanel';
import SpiritualMilestoneTracker from '@/components/admin/SpiritualMilestoneTracker';
import CommunityEngagementAnalytics from '@/components/admin/CommunityEngagementAnalytics';
import useCommunityAdmin from '@/hooks/useCommunityAdmin';

export default function AdminCommunityPage() {
  const [tab, setTab] = useState('activity');
  const { posts, comments, reports, activity } = useCommunityAdmin();

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <button onClick={() => setTab('activity')} className={`px-3 py-1 rounded ${tab==='activity'?'bg-blue-600 text-white':'bg-gray-100'}`}>Activity</button>
        <button onClick={() => setTab('moderation')} className={`px-3 py-1 rounded ${tab==='moderation'?'bg-blue-600 text-white':'bg-gray-100'}`}>Moderation</button>
        <button onClick={() => setTab('events')} className={`px-3 py-1 rounded ${tab==='events'?'bg-blue-600 text-white':'bg-gray-100'}`}>Events</button>
        <button onClick={() => setTab('mentorship')} className={`px-3 py-1 rounded ${tab==='mentorship'?'bg-blue-600 text-white':'bg-gray-100'}`}>Mentorship</button>
        <button onClick={() => setTab('milestones')} className={`px-3 py-1 rounded ${tab==='milestones'?'bg-blue-600 text-white':'bg-gray-100'}`}>Milestones</button>
        <button onClick={() => setTab('analytics')} className={`px-3 py-1 rounded ${tab==='analytics'?'bg-blue-600 text-white':'bg-gray-100'}`}>Analytics</button>
      </div>

  {tab === 'activity' && <CommunityActivityStream initial={activity} />}
  {tab === 'moderation' && <ContentModerationPanel />}
      {tab === 'events' && <EventManagementPanel />}
      {tab === 'mentorship' && <MentorshipManagementPanel />}
      {tab === 'milestones' && <SpiritualMilestoneTracker />}
      {tab === 'analytics' && <CommunityEngagementAnalytics />}
    </div>
  );
}

