import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(
      new URL('/auth/verification/error?message=Токен отсутствует', request.url)
    );
  }

  try {
    // Ищем токен в базе
    const tokenResult = await pool.query(
      `SELECT identifier, expires
       FROM verification_tokens 
       WHERE token = $1 AND expires > NOW()`,
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return NextResponse.redirect(
        new URL('/auth/verification/error?message=Неверный или просроченный токен', request.url)
      );
    }

    const { identifier: email } = tokenResult.rows[0];

    // Обновляем статус пользователя
    await pool.query(
      'UPDATE users SET email_verified = true, updated_at = NOW() WHERE email = $1',
      [email]
    );

    // Удаляем использованный токен
    await pool.query(
      'DELETE FROM verification_tokens WHERE token = $1',
      [token]
    );

    // Перенаправляем на страницу успеха
    return NextResponse.redirect(
      new URL('/auth/verification/success', request.url)
    );

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.redirect(
      new URL('/auth/verification/error?message=Ошибка верификации', request.url)
    );
  }
}


export async function POST(req) {
  try {
    const { token } = await req.json();

    const result = await pool.query(
      `DELETE FROM verification_tokens 
       WHERE token = $1 AND expires > NOW()
       RETURNING identifier`,
      [token]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Неверный или истёкший токен" },
        { status: 400 }
      );
    }

    const email = result.rows[0].identifier;

    // Обновляем юзера
    await pool.query(
      'UPDATE users SET email_verified = TRUE WHERE email = $1',
      [email]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}