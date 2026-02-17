// Enums
export enum RoleType {
  ADMIN = 'ADMIN',
  COACH = 'COACH',
  ATHLETE = 'ATHLETE',
}

export enum MuscleGroup {
  CHEST = 'CHEST',
  BACK = 'BACK',
  SHOULDERS = 'SHOULDERS',
  BICEPS = 'BICEPS',
  TRICEPS = 'TRICEPS',
  FOREARMS = 'FOREARMS',
  ABS = 'ABS',
  QUADS = 'QUADS',
  HAMSTRINGS = 'HAMSTRINGS',
  GLUTES = 'GLUTES',
  CALVES = 'CALVES',
}

export enum Equipment {
  BARBELL = 'BARBELL',
  DUMBBELL = 'DUMBBELL',
  MACHINE = 'MACHINE',
  CABLE = 'CABLE',
  BODYWEIGHT = 'BODYWEIGHT',
  RESISTANCE_BAND = 'RESISTANCE_BAND',
  KETTLEBELL = 'KETTLEBELL',
  OTHER = 'OTHER',
}

export enum ExperienceLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  ELITE = 'ELITE',
}

export enum Units {
  METRIC = 'METRIC',
  IMPERIAL = 'IMPERIAL',
}

export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export enum AuditAction {
  USER_REGISTERED = 'USER_REGISTERED',
  USER_LOGGED_IN = 'USER_LOGGED_IN',
  USER_LOGGED_OUT = 'USER_LOGGED_OUT',
  TOKEN_REFRESHED = 'TOKEN_REFRESHED',
  PASSWORD_RESET_REQUESTED = 'PASSWORD_RESET_REQUESTED',
  PASSWORD_RESET_COMPLETED = 'PASSWORD_RESET_COMPLETED',
  ROLE_CHANGED = 'ROLE_CHANGED',
  EXERCISE_CREATED = 'EXERCISE_CREATED',
  EXERCISE_MODERATED = 'EXERCISE_MODERATED',
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// Auth Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  roles: RoleType[];
  iat?: number;
  exp?: number;
}

// User Types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  roles: RoleType[];
  profile?: {
    height?: number;
    weight?: number;
    units: Units;
    goals?: string;
    experienceLevel: ExperienceLevel;
  };
}

// Exercise Types
export interface ExerciseBase {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  videoUrl?: string;
  muscleGroups: MuscleGroup[];
  equipment: Equipment[];
  isGlobal: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Workout Types
export interface WorkoutSet {
  id: string;
  setNumber: number;
  targetReps?: number;
  targetWeight?: number;
  targetRpe?: number;
  restTime?: number;
  tempo?: string;
  notes?: string;
  groupId?: string;
}

export interface WorkoutTemplateExercise {
  id: string;
  exerciseId: string;
  exercise?: ExerciseBase;
  order: number;
  sets: WorkoutSet[];
  notes?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: WorkoutTemplateExercise[];
  isArchived: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

// Session Types
export interface SessionSet {
  id: string;
  setNumber: number;
  actualReps?: number;
  actualWeight?: number;
  actualRpe?: number;
  volume?: number;
  estimated1RM?: number;
  isPR: boolean;
  notes?: string;
}

export interface SessionExercise {
  id: string;
  exerciseId: string;
  exercise?: ExerciseBase;
  order: number;
  sets: SessionSet[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  templateId?: string;
  template?: WorkoutTemplate;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  exercises: SessionExercise[];
  notes?: string;
  isCompleted: boolean;
}

// Progress Types
export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  bestWeight: number;
  bestReps: number;
  bestEstimated1RM: number;
  bestVolume: number;
  achievedAt: Date;
}

export interface VolumeDataPoint {
  date: Date;
  volume: number;
}

export interface OneRMDataPoint {
  date: Date;
  exerciseId: string;
  exerciseName: string;
  estimated1RM: number;
}

// Calendar Types
export interface CalendarEntry {
  id: string;
  date: Date;
  type: 'workout' | 'rest' | 'cardio';
  templateId?: string;
  template?: WorkoutTemplate;
  title?: string;
  notes?: string;
  isCompleted: boolean;
}

// Body Metrics Types
export interface BodyMetric {
  id: string;
  date: Date;
  weight?: number;
  bodyFat?: number;
  notes?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Stats Types
export interface DashboardStats {
  weeklyVolume: number;
  currentStreak: number;
  totalWorkouts: number;
  currentWeight?: number;
  recentPRs: PersonalRecord[];
}
