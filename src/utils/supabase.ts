import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, key);

// ── Types ──

export interface SharedResult {
  id?: string;
  nickname: string;
  test_id: string;
  result_data: Record<string, unknown>;
  created_at?: string;
}

// ── API helpers ──

/** Share (upsert) a single test result */
export async function shareResult(nickname: string, testId: string, resultData: unknown) {
  const { data, error } = await supabase
    .from('shared_results')
    .upsert(
      { nickname, test_id: testId, result_data: resultData },
      { onConflict: 'nickname,test_id' },
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Share all completed results for a nickname */
export async function shareAllResults(nickname: string, results: Record<string, unknown>) {
  const rows = Object.entries(results).map(([testId, data]) => ({
    nickname,
    test_id: testId,
    result_data: data,
  }));
  const { error } = await supabase
    .from('shared_results')
    .upsert(rows, { onConflict: 'nickname,test_id' });
  if (error) throw error;
}

/** Fetch all shared results (all members) */
export async function fetchAllShared(): Promise<SharedResult[]> {
  const { data, error } = await supabase
    .from('shared_results')
    .select('*')
    .order('nickname');
  if (error) throw error;
  return data || [];
}

/** Fetch shared results for a specific nickname */
export async function fetchMemberResults(nickname: string): Promise<SharedResult[]> {
  const { data, error } = await supabase
    .from('shared_results')
    .select('*')
    .eq('nickname', nickname);
  if (error) throw error;
  return data || [];
}

/** Get list of all nicknames who have shared */
export async function fetchSharedMembers(): Promise<string[]> {
  const { data, error } = await supabase
    .from('shared_results')
    .select('nickname')
    .order('nickname');
  if (error) throw error;
  const unique = [...new Set((data || []).map(r => r.nickname))];
  return unique;
}
