import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    // Получаем дополнительные данные пользователя из базы
    const userResult = await pool.query(
      `SELECT id, name, email, image, created_at, email_verified
       FROM users 
       WHERE id = $1`,
      [session.user.id]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    // Возвращаем данные профиля
    return NextResponse.json({
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.email_verified,
        createdAt: user.created_at,
        provider: session.user.provider,
      },
      statistics: {
        // Здесь могут быть статистические данные
        loginCount: 1, // В реальном приложении считаем из логов
        lastLogin: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}