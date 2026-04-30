export type Status = '완성' | '진행중' | '검토중' | '계획';

export type CategoryId = '일상자동화' | '콘텐츠엔진' | '수익화후보' | '학습자산화';

export interface Manual {
  title: string;
  path: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  color: string;
  accent: string;
  description: string;
  purpose: string;
}

export interface Agent {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  status: Status;
  progress: number;
  tools: string[];
  flow: string[];
  command_example: string;
  ability: string;
  frequency: string;
  call_count_month: number;
  linked_projects: string[];
  linked_agents: string[];
  manuals: Manual[];
  completed_at: string | null;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  status: Status;
  progress: number;
  deadline: string | null;
  deadline_type: '외부' | '내부';
  deadline_label: string;
  agents: string[];
  next_action: string;
  manuals: Manual[];
  github_repo: string;
  created_at: string;
  updated_at: string;
}

export type DashboardItem = (Agent & { __type: 'agent' }) | (Project & { __type: 'project' });
