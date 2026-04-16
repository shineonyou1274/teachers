import type { AnswerMap } from './scoring';
import { getCurrentUser, saveMemberResult } from './auth';

function getPrefix(): string {
  const user = getCurrentUser();
  if (user && user.role === 'member') return `member_${user.nickname}_`;
  return '';
}

export function saveAnswers(testId: string, answers: AnswerMap): void {
  localStorage.setItem(getPrefix() + 'answers_' + testId, JSON.stringify(answers));
}

export function loadAnswers(testId: string): AnswerMap | null {
  const raw = localStorage.getItem(getPrefix() + 'answers_' + testId);
  return raw ? JSON.parse(raw) : null;
}

export function saveResult(testId: string, result: unknown): void {
  const prefix = getPrefix();
  localStorage.setItem(prefix + 'result_' + testId, JSON.stringify(result));

  // Also save to member registry if logged in
  const user = getCurrentUser();
  if (user && user.role === 'member') {
    saveMemberResult(user.nickname, testId, result);
  }
}

export function loadResult<T = unknown>(testId: string): T | null {
  const raw = localStorage.getItem(getPrefix() + 'result_' + testId);
  return raw ? JSON.parse(raw) : null;
}

export function clearTest(testId: string): void {
  const prefix = getPrefix();
  localStorage.removeItem(prefix + 'answers_' + testId);
  localStorage.removeItem(prefix + 'result_' + testId);
}

export function isTestCompleted(testId: string): boolean {
  return localStorage.getItem(getPrefix() + 'result_' + testId) !== null;
}

export function getAllResults(): Record<string, unknown> {
  const results: Record<string, unknown> = {};
  const testIds = ['enneagram', 'burnout', 'big5', 'hsp', 'ecr', 'conflict', 'proqol'];
  testIds.forEach(id => {
    const r = loadResult(id);
    if (r) results[id] = r;
  });
  return results;
}

export function hasInProgressAnswers(testId: string): boolean {
  return localStorage.getItem(getPrefix() + 'answers_' + testId) !== null;
}
