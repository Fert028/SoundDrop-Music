import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword, validateEmail, validatePassword } from '@/lib/auth-utils';
import { sendEmail, emailTemplates } from '@/lib/email-service';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    // Валидация входных данных
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Некорректный формат email' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'Ненадежный пароль', 
          details: passwordValidation.errors 
        },
        { status: 400 }
      );
    }

    // Проверяем существование пользователя
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 409 }
      );
    }

    // Хешируем пароль
    const hashedPassword = await hashPassword(password);

    // Генерируем токен верификации
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 часа

    // Создаем пользователя (не подтвержденного)
    const result = await pool.query(
      `INSERT INTO users (name, email, password, email_verified, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, name, email, email_verified as "emailVerified"`,
      [name, email, hashedPassword, false]
    );

    const user = result.rows[0];

    // Сохраняем токен верификации
    await pool.query(
      `INSERT INTO verification_tokens (identifier, token, expires, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [email, verificationToken, verificationTokenExpires]
    );

    // Отправляем email верификации
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${verificationToken}`;
    const emailTemplate = emailTemplates.verification(verificationUrl, name);

    await sendEmail({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    });

    return NextResponse.json(
      {
        message: 'Пользователь успешно зарегистрирован. Проверьте email для верификации.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified
        },
        requiresVerification: true
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}