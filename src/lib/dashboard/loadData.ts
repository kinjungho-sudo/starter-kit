import projectsData from '../../data/projects.json';
import agentsData from '../../data/agents.json';
import categoriesData from '../../data/categories.json';
import type { Agent, Project, Category, DashboardItem } from './types';

export function getProjects(): Project[] {
  return projectsData.projects as Project[];
}

export function getAgents(): Agent[] {
  return agentsData.agents as Agent[];
}

export function getCategories(): Category[] {
  return categoriesData.categories as Category[];
}

export function getCategory(id: string): Category | undefined {
  return getCategories().find(c => c.id === id);
}

export function getAllItems(): DashboardItem[] {
  const projects = getProjects().map(p => ({ ...p, __type: 'project' as const }));
  const agents = getAgents().map(a => ({ ...a, __type: 'agent' as const }));
  return [...projects, ...agents];
}

export function calculateMetrics() {
  const items = getAllItems();
  const total = items.length;
  const completed = items.filter(i => i.status === '완성').length;
  const inProgress = items.filter(i => i.status === '진행중').length;
  const planned = items.filter(i => i.status === '계획').length;
  const overallProgress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const completedThisWeek = items.filter(i => {
    const completedAt = (i as any).completed_at;
    if (!completedAt) return false;
    return new Date(completedAt) >= sevenDaysAgo;
  }).length;

  const addedThisMonth = items.filter(i => {
    const createdAt = (i as any).created_at;
    if (!createdAt) return false;
    return new Date(createdAt) >= thirtyDaysAgo;
  }).length;

  return {
    total,
    completed,
    inProgress,
    planned,
    overallProgress,
    completedThisWeek,
    addedThisMonth,
  };
}
