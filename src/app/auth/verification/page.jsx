"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerificationPage() {
  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    (async () => {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => router.push("/auth/verification/success"), 1500);
      } else {
        setStatus("error");
      }
    })();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {status === "loading" && <p>Проверяем токен...</p>}
      {status === "success" && <p>Email подтверждён! 🎉</p>}
      {status === "error" && <p>Ошибка подтверждения токена</p>}
    </div>
  );
}