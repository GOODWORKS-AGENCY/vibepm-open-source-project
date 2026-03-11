export interface Project {
  id: string;
  name: string;
  description: string;
  stack: ProjectStack;
  phases: Phase[];
  tasks: Task[];
  knowledgeFiles: KnowledgeFile[];
  generatedFiles: GeneratedFile[];
  xp: { current: number; level: number };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStack {
  framework: string;
  language: string;
  buildTool: string;
  backend: string;
  ui: string;
  stateManagement: string;
  forms: string;
  validation: string;
}

export interface Phase {
  id: string;
  number: number;
  name: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
}

export interface Task {
  taskCode: string;
  title: string;
  description: string;
  phase: string;
  category: TaskCategory;
  assignedTo: string;
  priority: number;
  xpReward: number;
  status: TaskStatus;
  progressPct: number;
  dependencies: string[];
  watReferences: string[];
  notes?: string;
  startedAt?: string;
  completedAt?: string;
}

export type TaskCategory = 'feature' | 'infra' | 'ai' | 'ui' | 'orchestration';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';

export interface KnowledgeFile {
  path: string;
  type: 'skill' | 'tool' | 'workflow' | 'index' | 'config';
  content: string;
}

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface BrainDumpEntry {
  id: string;
  title: string;
  content: string;
}

export interface AIAnalysis {
  projectName: string;
  description: string;
  stack: ProjectStack;
  entities: string[];
  modules: Module[];
  phases: Phase[];
}

export interface Module {
  name: string;
  description: string;
  route: string;
  entities: string[];
  actions: string[];
  relatedModules: string[];
}

export const GAMIFICATION_LEVELS = [
  { level: 1, title: 'Apprentice', xpRequired: 0, badge: '🔰' },
  { level: 2, title: 'Builder', xpRequired: 100, badge: '🔨' },
  { level: 3, title: 'Craftsman', xpRequired: 250, badge: '⚒️' },
  { level: 4, title: 'Engineer', xpRequired: 500, badge: '⚙️' },
  { level: 5, title: 'Specialist', xpRequired: 800, badge: '🎯' },
  { level: 6, title: 'Expert', xpRequired: 1200, badge: '💎' },
  { level: 7, title: 'Master', xpRequired: 1700, badge: '🏆' },
  { level: 8, title: 'Visionary', xpRequired: 2300, badge: '🔮' },
  { level: 9, title: 'Architect', xpRequired: 3000, badge: '🏛️' },
  { level: 10, title: 'Legend', xpRequired: 4000, badge: '👑' },
  { level: 11, title: 'Titan', xpRequired: 5500, badge: '⚡' },
  { level: 12, title: 'Transcendent', xpRequired: 7000, badge: '🌟' },
  { level: 13, title: 'Mythic', xpRequired: 8500, badge: '🐉' },
  { level: 14, title: 'Eternal', xpRequired: 10000, badge: '♾️' },
  { level: 15, title: 'Ascended', xpRequired: 12000, badge: '🌌' },
] as const;

// ─── Agent Runtime Types ─────────────────────────────────────────────────────

export type AgentStatus = 'idle' | 'running' | 'paused' | 'terminated';

export interface Agent {
  id: string;
  user_id: string;
  agent_id: string;
  status: AgentStatus;
  budget_monthly_cents: number;
  spent_monthly_cents: number;
  budget_reset_at: string;
  session_id: string | null;
  session_params: Record<string, unknown>;
  last_heartbeat_at: string | null;
  heartbeat_interval_sec: number;
  max_concurrent_runs: number;
  created_at: string;
  updated_at: string;
}

export type HeartbeatRunStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled' | 'timed_out';
export type InvocationSource = 'scheduler' | 'manual' | 'callback' | 'system';

export interface HeartbeatRun {
  id: string;
  user_id: string;
  agent_id: string;
  status: HeartbeatRunStatus;
  invocation_source: InvocationSource;
  task_code: string | null;
  context_snapshot: Record<string, unknown>;
  started_at: string | null;
  finished_at: string | null;
  duration_ms: number | null;
  usage_json: Record<string, unknown>;
  result_json: Record<string, unknown>;
  error_message: string | null;
  created_at: string;
}

export interface RunLog {
  id: string;
  run_id: string;
  stream: 'stdout' | 'stderr' | 'system';
  chunk: string;
  seq: number;
  created_at: string;
}

export interface CostEvent {
  id: string;
  user_id: string;
  agent_id: string;
  task_code: string | null;
  provider: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost_cents: number;
  run_id: string | null;
  metadata: Record<string, unknown>;
  occurred_at: string;
  created_at: string;
}

export interface ActivityLogEntry {
  id: string;
  user_id: string;
  actor: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: Record<string, unknown>;
  created_at: string;
}

export type CommentType = 'note' | 'blocker' | 'resolution' | 'review' | 'system';

export interface TaskComment {
  id: string;
  user_id: string;
  task_code: string;
  author: string;
  body: string;
  comment_type: CommentType;
  created_at: string;
}

export interface CostSummary {
  period_days: number;
  total_cost_cents: number;
  total_input_tokens: number;
  total_output_tokens: number;
  event_count: number;
  by_agent: Record<string, { cost_cents: number; events: number }>;
  by_model: Record<string, { cost_cents: number; events: number }>;
}

export type WakeupStatus = 'queued' | 'claimed' | 'finished' | 'failed';

export interface WakeupRequest {
  id: string;
  user_id: string;
  agent_id: string;
  status: WakeupStatus;
  idempotency_key: string | null;
  coalesced_count: number;
  requested_by: string;
  reason: string | null;
  task_code: string | null;
  run_id: string | null;
  requested_at: string;
  claimed_at: string | null;
  finished_at: string | null;
  error: string | null;
  created_at: string;
}

export interface ConfigRevision {
  id: string;
  user_id: string;
  agent_id: string;
  revision_number: number;
  before_config: Record<string, unknown>;
  after_config: Record<string, unknown>;
  changed_keys: string[];
  source: 'patch' | 'register' | 'rollback' | 'system';
  rolled_back_from_revision_id: string | null;
  created_at: string;
}

export interface DashboardData {
  tasks: { pending: number; in_progress: number; completed: number; blocked: number };
  agents: { idle: number; running: number; paused: number; terminated: number };
  costs: { month_spend_cents: number; month_budget_cents: number; utilization_pct: number };
  runs: {
    active: number;
    stale: number;
    stale_runs: Array<{
      id: string;
      agent_id: string;
      task_code: string | null;
      started_at: string;
      elapsed_min: number;
    }>;
  };
  wakeups: { pending: number };
  xp: { earned: number; total: number };
  progress_pct: number;
}

export interface DoctorCheck {
  name: string;
  status: 'ok' | 'warn' | 'fail';
  message: string;
  can_repair?: boolean;
}

export interface DoctorResult {
  status: 'ok' | 'warn' | 'fail';
  checks: DoctorCheck[];
  summary: string;
}
