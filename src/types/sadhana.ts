
export interface Sadhana {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  category: 'daily' | 'goal';
  dueDate?: string;
  time?: string;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
  reflection?: string;
  sadhanaId?: number; // Link to the sadhana that created this task
}

export type PrivacyLevel = 'public' | 'friends' | 'private';

export interface SharedSadhana extends Sadhana {
  // Sharing metadata
  isShared: boolean;
  privacyLevel?: PrivacyLevel;
  sharedAt?: string;
  shareCount?: number;
  viewCount?: number;

  // Social metadata
  likeCount?: number;
  commentCount?: number;
  userHasLiked?: boolean;

  // Owner info (for community feed)
  ownerName?: string;
  ownerAvatar?: string;
  ownerId?: string;
}

export interface SadhanaComment {
  id: string;
  sadhanaId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  parentCommentId?: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;

  replies?: SadhanaComment[];
}

export interface CommunityFeedFilters {
  sortBy?: 'recent' | 'popular';
  searchQuery?: string;
}

export interface CommunityFeedResponse {
  feed: SharedSadhana[];
  total: number;
  hasMore: boolean;
}
