import { z } from 'zod';

// Post statuses aligned with DB/service conventions
export const PostStatus = z.union([
  z.literal('draft'),
  z.literal('published'),
  z.literal('flagged'),
  z.literal('removed'),
]);
export type PostStatus = z.infer<typeof PostStatus>;

export const MentorshipStatus = z.union([z.literal('active'), z.literal('completed'), z.literal('cancelled'), z.literal('pending')]);
export type MentorshipStatus = z.infer<typeof MentorshipStatus>;

export const ActivityType = z.union([z.literal('post'), z.literal('comment'), z.literal('like'), z.literal('follow'), z.literal('milestone'), z.literal('admin_action')]);
export type ActivityType = z.infer<typeof ActivityType>;

export const CommunityPost = z.object({
  id: z.number(),
  user_id: z.number().nullable().optional(),
  content: z.string(),
  post_type: z.string().nullable().optional(),
  status: PostStatus,
  metadata: z.any().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  user_name: z.string().optional(),
});
export type CommunityPost = z.infer<typeof CommunityPost>;

export const CommunityComment = z.object({
  id: z.number(),
  post_id: z.number(),
  user_id: z.number().nullable().optional(),
  content: z.string(),
  status: z.string().optional(),
  metadata: z.any().optional(),
  created_at: z.string().optional(),
  user_name: z.string().optional(),
});
export type CommunityComment = z.infer<typeof CommunityComment>;

export const CommunityReport = z.object({
  id: z.number(),
  reporter_id: z.number().nullable().optional(),
  reported_content_type: z.string(),
  reported_content_id: z.number(),
  reason: z.string().optional(),
  status: z.string().optional(),
  admin_notes: z.string().optional(),
  resolved_by: z.number().nullable().optional(),
  resolved_at: z.string().nullable().optional(),
  created_at: z.string().optional(),
});
export type CommunityReport = z.infer<typeof CommunityReport>;

export const CommunityEvent = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  event_type: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  location: z.string().optional(),
  max_participants: z.number().optional(),
  created_by: z.number().optional(),
  status: z.string().optional(),
  metadata: z.any().optional(),
  created_at: z.string().optional(),
});
export type CommunityEvent = z.infer<typeof CommunityEvent>;

export const MentorshipPair = z.object({
  id: z.number(),
  mentor_id: z.number().nullable().optional(),
  mentee_id: z.number().nullable().optional(),
  program_type: z.string().optional(),
  status: MentorshipStatus,
  started_at: z.string().optional(),
  ended_at: z.string().optional(),
  metadata: z.any().optional(),
  mentor_name: z.string().optional(),
  mentee_name: z.string().optional(),
});
export type MentorshipPair = z.infer<typeof MentorshipPair>;

export const SpiritualMilestone = z.object({
  id: z.number(),
  user_id: z.number().optional(),
  milestone_type: z.string(),
  milestone_data: z.any().optional(),
  achieved_at: z.string().optional(),
});
export type SpiritualMilestone = z.infer<typeof SpiritualMilestone>;

export const ActivityStreamEntry = z.object({
  id: z.number(),
  user_id: z.number().nullable().optional(),
  activity_type: ActivityType,
  target_type: z.string().optional(),
  target_id: z.number().optional(),
  activity_data: z.any().optional(),
  created_at: z.string().optional(),
});
export type ActivityStreamEntry = z.infer<typeof ActivityStreamEntry>;

// Pagination helpers
export type Paginated<T> = { items: T[]; total: number; page: number; limit: number; totalPages: number };

export const GetActivityParams = z.object({ limit: z.number().optional(), offset: z.number().optional(), userId: z.number().optional(), type: z.string().optional(), from: z.string().optional(), to: z.string().optional() });
export type GetActivityParams = z.infer<typeof GetActivityParams>;

