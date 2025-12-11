"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const { session, isAuthenticated, isLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  if (isLoading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Панель управления</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Карточка пользователя */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Профиль</h3>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  <strong>Имя:</strong> {session.user?.name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {session.user?.email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Провайдер:</strong> {session.user?.provider}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email подтвержден:</strong> {session.user?.emailVerified ? "Да" : "Нет"}
                </p>
              </div>
            </div>
          </div>

          {/* Карточка статистики */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Статистика</h3>
              <div className="mt-4">
                {dashboardData?.statistics && (
                  <>
                    <p className="text-sm text-gray-600">
                      Количество входов: {dashboardData.statistics.loginCount}
                    </p>
                    <p className="text-sm text-gray-600">
                      Последний вход:{" "}
                      {new Date(
                        dashboardData.statistics.lastLogin
                      ).toLocaleString("ru-RU")}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Карточка действий */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Быстрые действия</h3>
              <div className="mt-4 space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                  Редактировать профиль
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                  Сменить пароль
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                  Настройки уведомлений
                </button>
              </div>
            </div>
          </div>

          {/* Карточка безопасности */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Безопасность</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Двухфакторная аутентификация</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Не активно
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Активные сессии</span>
                  <span className="text-sm text-gray-900">1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Карточка уведомлений */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Уведомления</h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <input
                    id="email-notifications"
                    name="email-notifications"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                    Email уведомления
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="security-alerts"
                    name="security-alerts"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="security-alerts" className="ml-2 block text-sm text-gray-700">
                    Оповещения безопасности
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Дополнительная секция */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Последняя активность</h3>
              <div className="mt-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Вход в систему</span>
                  <span className="text-sm text-gray-500">Сегодня, 10:30</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Обновление профиля</span>
                  <span className="text-sm text-gray-500">Вчера, 15:45</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Быстрые ссылки</h3>
              <div className="mt-4 space-y-2">
                <a href="/profile" className="block text-blue-600 hover:text-blue-500 text-sm">
                  Перейти в профиль →
                </a>
                <a href="/auth/signin" className="block text-blue-600 hover:text-blue-500 text-sm">
                  Настройки безопасности →
                </a>
                <a href="/" className="block text-blue-600 hover:text-blue-500 text-sm">
                  На главную страницу →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}