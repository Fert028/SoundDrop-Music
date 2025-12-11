import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword, validatePassword } from '@/lib/auth-utils';

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Токен и пароль обязательны' },
        { status: 400 }
      );
    }

    // Проверяем валидность пароля
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: 'Ненадежный пароль', details: passwordValidation.errors },
        { status: 400 }
      );
    }

    // Ищем валидный токен
    const tokenResult = await pool.query(
      `SELECT user_id, expires 
       FROM password_reset_tokens 
       WHERE token = $1 AND expires > NOW() AND used = false`,
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Неверный или просроченный токен' },
        { status: 400 }
      );
    }

    const { user_id: userId } = tokenResult.rows[0];

    // Обновляем пароль
    const hashedPassword = await hashPassword(password);

    await pool.query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, userId]
    );

    // Помечаем токен как использованный
    await pool.query(
      'UPDATE password_reset_tokens SET used = true WHERE token = $1',
      [token]
    );

    return NextResponse.json({
      message: 'Пароль успешно изменен'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}