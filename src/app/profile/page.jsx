// "use client";

// import s from './profile.module.scss';

// import { useSession, signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function ProfilePage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/auth/signin");
//     }
//   }, [status, router]);

//   if (status === "loading") {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Загрузка...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!session) {
//     return null;
//   }

//   const getProviderName = (provider) => {
//     const providers = {
//       google: "Google",
//       github: "GitHub", 
//       yandex: "Yandex",
//       credentials: "Email и пароль"
//     };
//     return providers[provider] || provider;
//   };

//   return (
//     <div className={s.container}>

//       <div className={s.title}>
//         <h1>Личный кабинет</h1>
//         <p>
//           Управление вашим аккаунтом
//         </p>
//       </div>

//       <div className={s.userCard}>
//         {session.user?.image && (
//           <img
//             className={s.userCard_image}
//             src={session.user.image}
//             alt="Аватар"
//           />
//         )}
//         <div>
//           <h2 className={s.userCard_name}>
//             {session.user?.name || "Пользователь"}
//           </h2>
//           <p className="text-gray-600">{session.user?.email}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             ID: {session.user?.id}
//           </p>
//           <p className="text-sm text-gray-500">
//             Провайдер: {getProviderName(session.user?.provider)}
//           </p>
//         </div>
//       </div>

//       <div className={s.infoLogin_container}>
//         <h3>
//           Информация о входе
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className={s.infoLogin}>
//             <h4>Статус аккаунта</h4>
//             <p>Активен</p>
//           </div>
//           <div className={s.infoLogin}>
//             <h4>Способ входа</h4>
//             <p>
//               {getProviderName(session.user?.provider)}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className={s.buttonLogOut_container}>
//         <button
//           onClick={() => signOut({ callbackUrl: "/" })}
//           className={s.buttonLogOut}
//         >
//           Выйти из аккаунта
//         </button>
//       </div>

//     </div>
//   );
// }

"use client";

import s from './profile.module.scss';
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
  const { session, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // useAuth уже сделает редирект
  }

  const getProviderName = (provider) => {
    const providers = {
      google: "Google",
      github: "GitHub", 
      yandex: "Yandex",
      credentials: "Email и пароль"
    };
    return providers[provider] || provider;
  };

  const handleDelete = async () => {
    if (!confirm("Вы уверены, что хотите удалить аккаунт?")) return;

    const res = await fetch("/api/user/delete", {
      method: "POST",
    });

    if (res.ok) {
      // выходим из аккаунта
      await signOut({ callbackUrl: "/" });
    } else {
      alert("Ошибка при удалении аккаунта");
    }
  };

  return (
    <div className={s.container}>
      {/* Заголовок */}
      <div className={s.title}>
        <h1>Личный кабинет</h1>
        <p>
          Управление вашим аккаунтом
        </p>
      </div>

      {/* Информация о пользователе */}
      <div className={s.userCard}>
        {session.user?.image && (
          <img
            className={s.userCard_image}
            src={session.user.image}
            alt="Аватар"
          />
        )}
        <div className={s.userCard_info}>
          <h2>
            {session.user?.name || "Пользователь"}
          </h2>
          <p>{session.user?.email}</p>
          <p>
            ID: {session.user?.id}
          </p>
          <p>
            Провайдер: {getProviderName(session.user?.provider)}
          </p>
          <p>
            Email подтвержден: {session.user?.emailVerified ? "Да" : "Нет"}
          </p>
        </div>
      </div>

      {/* Действия */}
      <div className={s.loginActions}>
        <button className={s.loginActions_button} disabled>
          Редактировать профиль
        </button>

        <button
          className={s.loginActions_button}
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Выйти из аккаунта
        </button>

        <button
          className={s.loginActions_button}
          onClick={handleDelete}
        >
          Удалить аккаунт
        </button>
      </div>
    </div>
  );
}