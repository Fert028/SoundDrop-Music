"use client";

import s from "./signin.module.scss";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Google } from "@deemlol/next-icons";
import { Github } from "@deemlol/next-icons";

import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";


export default function SignInPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const message = searchParams.get('message');
  const callbackUrl = searchParams.get('callbackUrl') || '/profile';

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (error) {
      switch (error) {
        case 'OAuthAccountNotLinked':
          setErrorMessage('Этот аккаунт OAuth не привязан к существующему пользователю. Попробуйте другой способ входа или зарегистрируйтесь.');
          break;
        case 'EmailNotVerified':
          setErrorMessage('Email не подтвержден. Пожалуйста, проверьте вашу почту и подтвердите email перед входом.');
          break;
        case 'CredentialsSignin':
          setErrorMessage('Неверный email или пароль.');
          break;
        case 'Callback':
          setErrorMessage('Произошла ошибка при входе через OAuth. Попробуйте еще раз.');
          break;
        default:
          setErrorMessage(`Произошла ошибка: ${error}`);
      }
    }

    if (message) {
      switch (message) {
        case 'Registration successful':
          setSuccessMessage('Регистрация успешна! Теперь вы можете войти.');
          break;
        default:
          setSuccessMessage(message);
      }
    }
  }, [error, message]);

  const handleOAuthSignIn = (provider) => {
    signIn(provider, { callbackUrl });
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
        callbackUrl
      });

      if (result?.error) {
        setErrorMessage('Неверный email или пароль');
      } else {
        window.location.href = callbackUrl;
      }
    } catch (error) {
      setErrorMessage('Произошла ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.wrapper}>
      <div className={s.container}>

        <div className={s.hero}>
          <h1>Вход в систему</h1>
          <br />
          <p>Выберите способ входа</p>
        </div>

        {errorMessage && (
          <div className={s.message_container}>
            <div className="flex">
              <div className={s.svg_container}>
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className={s.message_container}>
            <div className="flex">
              <div className={s.svg_container}>
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleCredentialsSubmit} className={s.form}>
          <div className={s.form_inputContainer}>
            <Input 
              type="email"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({...prev, email: e.target.value}))}
              required
            />
            <Input
              type="password"
              placeholder="Пароль"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти с email и паролем'}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-500 block"
          >
            Забыли пароль?
          </Link>
          <Link
            href="/auth/register"
            className="text-sm text-blue-600 hover:text-blue-500 block"
          >
            Нет аккаунта? Зарегистрируйтесь
          </Link>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Или</span>
          </div>
        </div>

        <div className={s.oauth_container}>
          <button onClick={() => handleOAuthSignIn("google")} className={s.oauth_icons}>
            <Google size={24} color={'#FFFFFF'} />
          </button>

          <button onClick={() => handleOAuthSignIn("github")} className={s.oauth_icons}>
            <Github size={24} color={'#FFFFFF'} />
          </button>

          {/* <button onClick={() => handleOAuthSignIn("yandex")} className={s.oauth_icons}>
            yandex
          </button> */}
        </div>

      </div>
    </div>
  );
}