/**
 * SaadhanaBoard API Client SDK - TypeScript Definitions
 */

export interface ClientOptions {
  baseURL: string;
  token?: string;
}

export interface UserData {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: UserData;
  token: string;
}

export interface ProfileData {
  id: string;
  userId: string;
  bio: string;
  avatar: string;
  spiritualPath: string;
  practiceGoals: string[];
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface WaitlistData {
  name: string;
  email: string;
  reason?: string;
}

export interface FollowData {
  followerId: string;
  followedId: string;
  createdAt: string;
}

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export interface AnalyticsOptions {
  timeframe?: string;
  granularity?: string;
  groupBy?: string;
  year?: number;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface PracticeTrend {
  date: string;
  count: number;
}

export interface CompletionRate {
  category: string;
  rate: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string;
}

export interface HeatmapData {
  date: string;
  count: number;
}

export interface CategoryInsight {
  category: string;
  totalPractices: number;
  completionRate: number;
}

export class SaadhanaBoardClient {
  constructor(options: ClientOptions);
  
  setToken(token: string): void;
  request(endpoint: string, options?: any): Promise<any>;
  
  auth: AuthAPI;
  profile: ProfileAPI;
  analytics: AnalyticsAPI;
}

export class AuthAPI {
  constructor(client: SaadhanaBoardClient);
  
  register(userData: RegisterData): Promise<AuthResponse>;
  login(credentials: LoginData): Promise<AuthResponse>;
  joinWaitlist(waitlistData: WaitlistData): Promise<any>;
  getCurrentUser(): Promise<{ user: UserData }>;
}

export class ProfileAPI {
  constructor(client: SaadhanaBoardClient);
  
  get(): Promise<{ profile: ProfileData }>;
  update(profileData: Partial<ProfileData>): Promise<{ profile: ProfileData }>;
  follow(userId: string): Promise<any>;
  unfollow(userId: string): Promise<any>;
  getFollowers(userId: string, options?: PaginationOptions): Promise<any>;
  getFollowing(userId: string, options?: PaginationOptions): Promise<any>;
  getFollowStats(userId: string): Promise<any>;
  isFollowing(userId: string): Promise<{ isFollowing: boolean }>;
}

export class AnalyticsAPI {
  constructor(client: SaadhanaBoardClient);
  
  getPracticeTrends(options?: AnalyticsOptions): Promise<PracticeTrend[]>;
  getCompletionRates(options?: AnalyticsOptions): Promise<CompletionRate[]>;
  getStreaks(): Promise<StreakData>;
  getComparative(options?: AnalyticsOptions): Promise<any>;
  getDetailedReport(dateRange: DateRange): Promise<any>;
  getHeatmap(options?: AnalyticsOptions): Promise<HeatmapData[]>;
  getCategoryInsights(): Promise<CategoryInsight[]>;
  exportCSV(options?: any): Promise<Blob>;
  exportPDF(options?: any): Promise<Blob>;
}

export default SaadhanaBoardClient;