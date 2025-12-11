"use client";

import s from './register.module.scss';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка регистрации');
      }

      setSuccess('Регистрация успешна! Теперь вы можете войти.');
      
      // Очищаем форму
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Перенаправляем на страницу входа через 2 секунды
      setTimeout(() => {
        router.push('/auth/signin?message=Registration successful');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Регистрация
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Создайте новый аккаунт
          </p>
        </div>

        <form className={s.form} onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div>
              {success}
            </div>
          )}

          <Input
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите ваше имя"
          />

          <Input
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
          />

          <Input
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Введите пароль"
          />
          <p className={s.subtitle}>
            Минимум 8 символов, заглавные и строчные буквы, цифры
          </p>

          <Input
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Повторите пароль"
          />

          <Button
            classNmae={s.button}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>

          <div className="text-center">
            <Link href="/auth/signin">
              Уже есть аккаунт? Войдите
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}