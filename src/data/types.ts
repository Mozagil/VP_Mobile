export type Drill = {
  id: number;
  name: string;
  phase: string;
  skill: string;
  level: string;
  players: string;
  duration: string;
  desc: string;
  tags: string[];
};

export type TrainingPlan = {
  id: string;
  name: string;
  team?: string;
  goal?: string;
  location?: 'salon' | 'dis_saha' | null;
  level?: string | null;
  target_duration?: number | null;
  start_date?: string;
  duration_weeks?: number;
  sessions_per_week?: number;
  plan_type?: string;
  status?: string;
  created_at: string;
  updated_at?: string;
  drills: PlanDrill[];
};

export type PlanDrill = {
  id: string;
  drill_id: number;
  phase: string;
  completed: boolean;
  sort_order: number;
  custom_name?: string;
  custom_skill?: string;
  custom_duration?: number | null;
  note?: string | null;
};

export type Profile = {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  level: string | null;
  position: string | null;
  goals: string[];
  frequency: number | null;
  avatar_url: string | null;
  language: string;
  primary_goal: string | null;
  secondary_goal: string | null;
  session_duration: string | null;
  intensity: string | null;
  preferred_days: string[];
  equipment_status: string | null;
};

export type ScheduledSession = {
  id: string;
  user_id: string;
  plan_id: string;
  session_date: string;
  session_time?: string | null;
  week_number: number;
  day_number: number;
  completed: boolean;
  completed_at: string | null;
};
