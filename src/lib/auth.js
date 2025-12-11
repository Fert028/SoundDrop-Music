import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import CustomAdapter from "./custom-adapter";
import { verifyPassword } from "./auth-utils";
import pool from "./db";

// Кастомный провайдер для Yandex (остается без изменений)
const yandexProvider = {
  id: "yandex",
  name: "Yandex",
  type: "oauth",
  version: "2.0",
  authorization: {
    url: "https://oauth.yandex.ru/authorize",
    params: { scope: "login:email login:info" }
  },
  token: "https://oauth.yandex.ru/token",
  userinfo: "https://login.yandex.ru/info",
  async profile(profile) {
    return {
      id: profile.id,
      name: profile.real_name || profile.display_name,
      email: profile.default_email,
      image: profile.is_avatar_empty
        ? null
        : `https://avatars.yandex.net/get-yapic/${profile.default_avatar_id}/islands-200`,
    };
  },
  clientId: process.env.YANDEX_CLIENT_ID,
  clientSecret: process.env.YANDEX_CLIENT_SECRET,
};

// Credentials Provider для email/пароля
const credentialsProvider = CredentialsProvider({
  name: "Email и пароль",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Пароль", type: "password" }
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) {
      throw new Error("Email и пароль обязательны");
    }

    try {
      // Ищем пользователя в базе
      const result = await pool.query(
        `SELECT id, name, email, password, email_verified as "emailVerified" 
         FROM users WHERE email = $1`,
        [credentials.email]
      );

      if (result.rows.length === 0) {
        throw new Error("Пользователь не найден");
      }

      const user = result.rows[0];

      // Проверяем пароль
      const isValidPassword = await verifyPassword(credentials.password, user.password);
      
      if (!isValidPassword) {
        throw new Error("Неверный пароль");
      }

      // Возвращаем данные пользователя без пароля
      return {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
      };
    } catch (error) {
      console.error('Auth error:', error);
      throw new Error("Ошибка аутентификации");
    }
  }
});

export const authOptions = {
  adapter: CustomAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    yandexProvider,
    credentialsProvider, // Добавляем Credentials provider
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('🔐 SignIn callback:', { 
        user: user?.email, 
        provider: account?.provider 
      });
      
      // Для credentials provider проверяем верификацию email
      if (account?.provider === 'credentials') {
        if (!user.emailVerified) {
          throw new Error('EmailNotVerified');
        }
      }
      
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.provider = account?.provider || 'credentials';
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.provider = token.provider;
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export default handler;