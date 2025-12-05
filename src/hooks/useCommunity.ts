import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * Query key factory for community
 */
export const communityKeys = {
  all: ['community'] as const,
  feed: () => [...communityKeys.all, 'feed'] as const,
  feedWithParams: (params?: any) => [...communityKeys.feed(), params] as const,
  posts: () => [...communityKeys.all, 'posts'] as const,
  post: (id: string) => [...communityKeys.posts(), id] as const,
  comments: () => [...communityKeys.all, 'comments'] as const,
  commentsForPost: (postId: string) => [...communityKeys.comments(), postId] as const,
  likes: () => [...communityKeys.all, 'likes'] as const,
};

/**
 * Hook: Fetch community feed (paginated)
 */
export const useCommunityFeed = (initialLimit: number = 20) => {
  return useInfiniteQuery({
    queryKey: communityKeys.feed(),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await api.getCommunityFeed({
        limit: initialLimit,
        offset: pageParam,
      });
      return response;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // If we got less items than limit, we've reached the end
      if (lastPage.feed?.length < initialLimit) {
        return undefined;
      }
      return allPages.length * initialLimit;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });
};

/**
 * Hook: Flatten infinite query data for easier access
 */
export const useCommunityFeedFlat = (initialLimit: number = 20) => {
  const { data, ...rest } = useCommunityFeed(initialLimit);

  const flatFeed = data?.pages.flatMap((page) => page.feed || []) || [];

  return {
    feed: flatFeed,
    ...rest,
  };
};

/**
 * Hook: Create a community post
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: {
      content: string;
      sadhanaId?: string;
      attachments?: any[];
    }) => {
      const response = await api.post('/sadhanas/community/feed', postData);
      return response;
    },
    onSuccess: (newPost) => {
      // Invalidate feed to refetch
      queryClient.invalidateQueries({ queryKey: communityKeys.feed() });
      // Add to cache
      queryClient.setQueryData(communityKeys.post(newPost.id), newPost);
    },
    onError: (error) => {
      console.error('Failed to create post:', error);
    },
  });
};

/**
 * Hook: Delete a community post
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      await api.delete(`/sadhanas/community/feed/${postId}`);
      return postId;
    },
    onSuccess: (deletedPostId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: communityKeys.post(deletedPostId) });
      // Invalidate feed
      queryClient.invalidateQueries({ queryKey: communityKeys.feed() });
    },
    onError: (error) => {
      console.error('Failed to delete post:', error);
    },
  });
};

/**
 * Hook: Like a post
 */
export const useLikePost = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post(`/sadhanas/community/feed/${postId}/like`);
      return response;
    },
    // Optimistic update
    onMutate: async () => {
      // Cancel outgoing
      await queryClient.cancelQueries({ queryKey: communityKeys.post(postId) });

      // Get current data
      const previousPost = queryClient.getQueryData(communityKeys.post(postId));

      // Optimistic update
      queryClient.setQueryData(communityKeys.post(postId), (old: any) => ({
        ...old,
        likeCount: (old?.likeCount || 0) + 1,
        userLiked: true,
      }));

      return { previousPost };
    },
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(communityKeys.post(postId), updatedPost);
      queryClient.invalidateQueries({ queryKey: communityKeys.feed() });
    },
    onError: (error, variables, context: any) => {
      if (context?.previousPost) {
        queryClient.setQueryData(communityKeys.post(postId), context.previousPost);
      }
      console.error('Failed to like post:', error);
    },
  });
};

/**
 * Hook: Unlike a post
 */
export const useUnlikePost = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post(`/sadhanas/community/feed/${postId}/unlike`);
      return response;
    },
    // Optimistic update
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: communityKeys.post(postId) });

      const previousPost = queryClient.getQueryData(communityKeys.post(postId));

      queryClient.setQueryData(communityKeys.post(postId), (old: any) => ({
        ...old,
        likeCount: Math.max((old?.likeCount || 1) - 1, 0),
        userLiked: false,
      }));

      return { previousPost };
    },
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(communityKeys.post(postId), updatedPost);
      queryClient.invalidateQueries({ queryKey: communityKeys.feed() });
    },
    onError: (error, variables, context: any) => {
      if (context?.previousPost) {
        queryClient.setQueryData(communityKeys.post(postId), context.previousPost);
      }
      console.error('Failed to unlike post:', error);
    },
  });
};

/**
 * Hook: Toggle like on a post
 */
export const useToggleLikePost = (postId: string) => {
  const likePost = useLikePost(postId);
  const unlikePost = useUnlikePost(postId);

  return useMutation({
    mutationFn: async (shouldLike: boolean) => {
      if (shouldLike) {
        return likePost.mutateAsync();
      } else {
        return unlikePost.mutateAsync();
      }
    },
    onError: (error) => {
      console.error('Failed to toggle like:', error);
    },
  });
};

/**
 * Hook: Post a comment on a post
 */
export const useCreateComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentData: { content: string }) => {
      const response = await api.post(`/sadhanas/community/feed/${postId}/comments`, commentData);
      return response;
    },
    onSuccess: (newComment) => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({
        queryKey: communityKeys.commentsForPost(postId),
      });
      // Invalidate post
      queryClient.invalidateQueries({ queryKey: communityKeys.post(postId) });
    },
    onError: (error) => {
      console.error('Failed to create comment:', error);
    },
  });
};

/**
 * Hook: Fetch comments for a post
 */
export const usePostComments = (postId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: communityKeys.commentsForPost(postId),
    queryFn: async () => {
      const response = await api.get(`/sadhanas/community/feed/${postId}/comments`);
      return response;
    },
    enabled: !!postId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });
};

/**
 * Hook: Get community statistics
 */
export const useCommunityStats = () => {
  const query = useCommunityFeedFlat();
  const feedData = query.feed;
  const { isLoading } = query;

  const stats = {
    totalPosts: feedData?.length || 0,
    totalLikes: feedData?.reduce((sum: number, post: any) => sum + (post.likeCount || 0), 0) || 0,
    avgLikesPerPost: feedData?.length
      ? Math.round(feedData.reduce((sum: number, post: any) => sum + (post.likeCount || 0), 0) / feedData.length)
      : 0,
    totalComments: feedData?.reduce((sum: number, post: any) => sum + (post.commentCount || 0), 0) || 0,
  };

  return {
    stats,
    isLoading,
  };
};
