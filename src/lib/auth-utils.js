import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Конфигурация хеширования
const SALT_ROUNDS = 12;

// Хеширование пароля с использованием bcrypt
export async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// Сравнение пароля с хешем
export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Генерация случайного токена для верификации email
export function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Валидация email
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Валидация пароля (минимальные требования)
export function validatePassword(password) {
  const errors = [];

  if (password.length < 8) {
    errors.push('Пароль должен содержать минимум 8 символов');
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну строчную букву');
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну заглавную букву');
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну цифру');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}