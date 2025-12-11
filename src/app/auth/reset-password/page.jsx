"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setMessage('Неверная ссылка для сброса пароля');
    }
    setToken(tokenParam || "");
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Пароли не совпадают');
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Пароль успешно изменен!');
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      } else {
        setMessage(data.error || 'Произошла ошибка');
      }
    } catch (error) {
      setMessage('Произошла ошибка при сбросе пароля');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow text-center">
          <p className="text-red-600 mb-4">Неверная ссылка для сброса пароля</p>
          <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-500">
            Запросить новую ссылку
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Сброс пароля
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Введите новый пароль для вашего аккаунта
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {message && (
            <div className={`p-4 rounded-md ${
              message.includes('успешно') 
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Новый пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Введите новый пароль"
            />
            <p className="mt-1 text-xs text-gray-500">
              Минимум 8 символов, заглавные и строчные буквы, цифры
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Подтверждение пароля
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Повторите новый пароль"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Сброс пароля...' : 'Сбросить пароль'}
          </button>

          <div className="text-center">
            <Link href="/auth/signin" className="text-blue-600 hover:text-blue-500 text-sm">
              Вернуться к входу
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}