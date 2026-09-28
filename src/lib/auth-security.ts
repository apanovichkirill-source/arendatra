export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 15;

export function isLocked(lockedUntil: Date | null): lockedUntil is Date {
  return !!lockedUntil && lockedUntil.getTime() > Date.now();
}

export function lockedMessage(lockedUntil: Date) {
  const minutesLeft = Math.ceil((lockedUntil.getTime() - Date.now()) / 60000);
  return `Слишком много попыток входа. Повторите через ${minutesLeft} мин.`;
}

export function nextFailureState(currentAttempts: number) {
  const attempts = currentAttempts + 1;
  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    return { failedAttempts: 0, lockedUntil: new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000) };
  }
  return { failedAttempts: attempts, lockedUntil: null };
}
