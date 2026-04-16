export type UserRole = 'guest' | 'member' | 'admin';

export interface UserInfo {
  nickname: string;
  role: UserRole;
}

const USER_KEY = 'current_user';
const ALL_MEMBERS_KEY = 'all_members';
const GUEST_TESTS_KEY = 'guest_completed_tests';
// ★★★ 여기서 비밀번호/코드 수정 ★★★
const ADMIN_PASSWORD = 'teacher2026';   // 관리자 로그인 비밀번호
const AI_ACCESS_CODE = 'teacher2026';   // AI 분석 이용 코드
// ★★★★★★★★★★★★★★★★★★★★★★★★★★

const GUEST_TEST_LIMIT = 1;
const AI_USED_PREFIX = 'ai_used_';

// --- Current user ---

export function getCurrentUser(): UserInfo | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setCurrentUser(user: UserInfo): void {
  const wasPreviouslyGuest = isGuest();
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (user.role === 'member') {
    addMember(user.nickname);
    // Migrate guest data to member-prefixed keys
    if (wasPreviouslyGuest) {
      migrateGuestData(user.nickname);
    }
  }
}

/** Copy unprefixed guest results/answers to member-prefixed keys */
function migrateGuestData(nickname: string): void {
  const testIds = ['enneagram', 'burnout', 'big5', 'hsp', 'ecr', 'conflict', 'proqol'];
  const prefix = memberPrefix(nickname);

  for (const id of testIds) {
    // Migrate answers
    const answersKey = 'answers_' + id;
    const answersRaw = localStorage.getItem(answersKey);
    if (answersRaw) {
      localStorage.setItem(prefix + answersKey, answersRaw);
      localStorage.removeItem(answersKey);
    }

    // Migrate results
    const resultKey = 'result_' + id;
    const resultRaw = localStorage.getItem(resultKey);
    if (resultRaw) {
      localStorage.setItem(prefix + resultKey, resultRaw);
      // Also register in member results
      saveMemberResult(nickname, id, JSON.parse(resultRaw));
      localStorage.removeItem(resultKey);
    }
  }

  // Clean up guest tracking
  localStorage.removeItem(GUEST_TESTS_KEY);
}

export function logout(): void {
  localStorage.removeItem(USER_KEY);
}

export function isGuest(): boolean {
  const user = getCurrentUser();
  return !user || user.role === 'guest';
}

export function isAdmin(): boolean {
  return getCurrentUser()?.role === 'admin';
}

// --- Guest test limit ---

export function getGuestCompletedCount(): number {
  const raw = localStorage.getItem(GUEST_TESTS_KEY);
  if (!raw) return 0;
  return JSON.parse(raw).length;
}

export function addGuestCompletedTest(testId: string): void {
  const raw = localStorage.getItem(GUEST_TESTS_KEY);
  const list: string[] = raw ? JSON.parse(raw) : [];
  if (!list.includes(testId)) {
    list.push(testId);
    localStorage.setItem(GUEST_TESTS_KEY, JSON.stringify(list));
  }
}

export function canGuestTakeTest(): boolean {
  return getGuestCompletedCount() < GUEST_TEST_LIMIT;
}

export function getGuestCompletedTests(): string[] {
  const raw = localStorage.getItem(GUEST_TESTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

// --- Admin password ---

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

// --- Members registry ---

export function getAllMembers(): string[] {
  const raw = localStorage.getItem(ALL_MEMBERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addMember(nickname: string): void {
  const members = getAllMembers();
  if (!members.includes(nickname)) {
    members.push(nickname);
    localStorage.setItem(ALL_MEMBERS_KEY, JSON.stringify(members));
  }
}

// --- Per-member data (prefixed storage) ---

function memberPrefix(nickname: string): string {
  return `member_${nickname}_`;
}

export function saveMemberResult(nickname: string, testId: string, result: unknown): void {
  localStorage.setItem(memberPrefix(nickname) + 'result_' + testId, JSON.stringify(result));
}

export function loadMemberResult(nickname: string, testId: string): unknown | null {
  const raw = localStorage.getItem(memberPrefix(nickname) + 'result_' + testId);
  return raw ? JSON.parse(raw) : null;
}

export function isMemberTestCompleted(nickname: string, testId: string): boolean {
  return localStorage.getItem(memberPrefix(nickname) + 'result_' + testId) !== null;
}

export function getMemberCompletedTests(nickname: string): string[] {
  const testIds = ['enneagram', 'burnout', 'big5', 'hsp', 'ecr', 'conflict', 'proqol'];
  return testIds.filter(id => isMemberTestCompleted(nickname, id));
}

// --- AI access code ---

export function verifyAICode(code: string): boolean {
  return code === AI_ACCESS_CODE;
}

export function hasUsedAI(nickname: string): boolean {
  return localStorage.getItem(AI_USED_PREFIX + nickname) === 'true';
}

export function markAIUsed(nickname: string): void {
  localStorage.setItem(AI_USED_PREFIX + nickname, 'true');
}
