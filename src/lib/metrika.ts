export const YM_ID = Number(process.env.NEXT_PUBLIC_YM_ID) || 113169749;

type YmFn = (id: number, method: string, ...args: unknown[]) => void;

export function reachGoal(goal: string) {
  if (!YM_ID || typeof window === "undefined") return;
  const ym = (window as unknown as { ym?: YmFn }).ym;
  ym?.(YM_ID, "reachGoal", goal);
}
