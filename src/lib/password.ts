import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

// Используется, когда логин/телефон не найден, чтобы время ответа не отличалось
// от случая неверного пароля — иначе по задержке можно перебирать существующие аккаунты.
const DUMMY_HASH = "$2a$10$CwTycUXWue0Thq9StjUM0uJ8Q4KgIVQOMj3M8/qbNJU0zTIvbT7iC";

export async function verifyPasswordConstantTime(
  password: string,
  hash: string | undefined | null
) {
  return bcrypt.compare(password, hash ?? DUMMY_HASH);
}
