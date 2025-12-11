import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendEmail, emailTemplates } from '@/lib/email-service';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email обязателен' },
        { status: 400 }
      );
    }

    // Ищем пользователя
    const userResult = await pool.query(
      'SELECT id, name, email FROM users WHERE email = $1',
      [email]
    );

    // Для безопасности всегда возвращаем успех, даже если пользователь не найден
    if (userResult.rows.length === 0) {
      return NextResponse.json({
        message: 'Если пользователь с таким email существует, инструкции будут отправлены'
      });
    }

    const user = userResult.rows[0];

    // Генерируем токен сброса пароля
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 час

    // Сохраняем токен в базе
    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [user.id, resetToken, resetTokenExpires]
    );

    // Отправляем email
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    const emailTemplate = emailTemplates.passwordReset(resetUrl, user.name);

    await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    });

    return NextResponse.json({
      message: 'Инструкции по восстановлению пароля отправлены на email'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}