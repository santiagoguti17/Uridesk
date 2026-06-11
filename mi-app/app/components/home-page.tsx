"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { ArrowUpRight, CircleDollarSign, FolderKanban, Scale, ShieldCheck, Sparkles } from "lucide-react";
import { AuthModal, type AuthMode } from "./auth-modal";
import { auth, firebaseReady } from "@/lib/firebase/client";
import { DashboardShell } from "./dashboard-shell";

const landingHighlights = [
  {
    title: "Control operacional",
    description:
      "Monitorea procesos activos, urgentes, remates y cartera en una sola vista.",
    icon: FolderKanban,
  },
  {
    title: "Acceso seguro",
    description:
      "Registrate o inicia sesión con Firebase Auth y entra directo al mejor ambiente de trabajo.",
    icon: ShieldCheck,
  },
  {
    title: "Gestión premium",
    description:
      "Una experiencia pensada para abogados y firmas con foco en productividad.",
    icon: Sparkles,
  },
];

const landingMetrics = [
  { label: "Procesos activos", value: "128" },
  { label: "Cartera pendiente", value: "$ 460M" },
  { label: "Remates próximos", value: "9" },
];

export function HomePage() {
  const [modalMode, setModalMode] = useState<AuthMode>("login");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (!auth) {
      return;
    }

    return onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);

  const openModal = (mode: AuthMode) => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleSignOut = async () => {
    if (!auth) {
      return;
    }

    await signOut(auth);
  };

  if (currentUser) {
    return (
      <DashboardShell
        user={currentUser}
        onSignOut={handleSignOut}
        isFirebaseReady={firebaseReady}
      />
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#eef5fb] px-4 py-4 text-[#0a2536] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-7xl flex-col gap-4">
        <header className="flex items-center justify-between rounded-[1.75rem] border border-slate-200 bg-white/85 px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0a2536] text-white shadow-lg">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#33566d]">
                Uridesk CRM
              </p>
              <h1 className="text-lg font-semibold text-[#0a2536] sm:text-xl">
                Inicio de sesión
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            
            {currentUser && auth ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#0a2536] shadow-sm transition hover:bg-slate-50"
              >
                Salir
              </button>
            ) : null}
          </div>
        </header>

        <section className="grid flex-1 gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <div className="relative overflow-hidden rounded-[2rem] border border-[#0a2536] bg-[#0a2536] px-6 py-7 text-white shadow-[0_30px_80px_rgba(10,37,54,0.18)] sm:px-8 sm:py-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(243,250,255,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(51,86,109,0.18),transparent_35%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-200">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  Gestión jurídica premium
                </div>
                <div className="space-y-4">
                  <h2 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                    Uridesk centraliza la operación jurídica con foco real en el negocio.
                  </h2>
                  <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                    Una experiencia simplificada: más control, más jerarquía y menos fricción para entrar y empezar a trabajar.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {landingMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-[1.4rem] border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#33566d]">
                  Acceso
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-[#0a2536]">
                  Inicia sesión o crea tu cuenta
                </h3>
              </div>
              <div className="rounded-2xl bg-[#f8fbfe] p-3 text-[#33566d]">
                <CircleDollarSign className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">
              Accede con tu correo y contraseña. Si ya estás autenticado, Uridesk te lleva directamente al mejor ambiente de trabajo.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openModal("register")}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#0a2536] px-6 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(10,37,54,0.2)] transition hover:bg-[#143a53]"
              >
                Registrarse
              </button>
              <button
                type="button"
                onClick={() => openModal("login")}
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-[#0a2536] transition hover:bg-slate-50"
              >
                Iniciar sesión
              </button>
            </div>

            <div className="mt-8 space-y-3">
              {landingHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.title} className="flex items-start gap-3 rounded-[1.4rem] border border-slate-200 bg-[#f8fbfe] px-4 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0a2536] text-white">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0a2536]">{item.title}</h4>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {isModalOpen ? (
        <AuthModal
          open={isModalOpen}
          mode={modalMode}
          onClose={() => setIsModalOpen(false)}
          onSwitchMode={setModalMode}
        />
      ) : null}
    </main>
  );
}