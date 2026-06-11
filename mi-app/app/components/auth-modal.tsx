"use client";

import { type FormEvent, useMemo, useState } from "react";
import { Scale } from "lucide-react";
import {
  loginWithEmail,
  mapAuthErrorMessage,
  registerWithEmail,
} from "@/lib/firebase/auth";
import { firebaseReady } from "@/lib/firebase/client";

export type AuthMode = "login" | "register";

type AuthModalProps = {
  open: boolean;
  mode: AuthMode;
  onClose: () => void;
  onSwitchMode: (mode: AuthMode) => void;
};

type FormState = {
  email: string;
  password: string;
  confirmPassword: string;
};

const initialFormState: FormState = {
  email: "",
  password: "",
  confirmPassword: "",
};

export function AuthModal({ open, mode, onClose, onSwitchMode }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title = useMemo(
    () => (mode === "login" ? "Iniciar sesión" : "Crear cuenta"),
    [mode],
  );

  if (!open) {
    return null;
  }

  const isRegisterMode = mode === "register";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (!firebaseReady) {
      setFeedback("El acceso no está disponible en este momento.");
      return;
    }

    if (isRegisterMode && formState.password !== formState.confirmPassword) {
      setFeedback("Las contraseñas no coinciden.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isRegisterMode) {
        await registerWithEmail({
          email: formState.email,
          password: formState.password,
        });
        setFeedback("Usuario registrado correctamente.");
      } else {
        await loginWithEmail({
          email: formState.email,
          password: formState.password,
        });
        setFeedback("Sesión iniciada correctamente.");
      }

      onClose();
    } catch (error) {
      setFeedback(mapAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Cerrar modal"
        className="absolute inset-0 cursor-default bg-[#081926]/70 backdrop-blur-md"
        onClick={onClose}
      />

      <section className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(10,37,54,0.28)]">
        <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative overflow-hidden bg-[#0a2536] px-6 py-7 text-white sm:px-8 sm:py-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(243,250,255,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(51,86,109,0.2),transparent_35%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-200">
                  <Scale className="h-3.5 w-3.5" />
                  Uridesk CRM
                </div>
                <div className="space-y-3">
                  <h2 className="max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">
                    {title}
                  </h2>
                  <p className="max-w-md text-sm leading-7 text-slate-300 sm:text-base">
                    Accede con el mismo lenguaje visual del dashboard: sobrio, premium y enfocado en productividad jurídica.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Estado", value: "Privado" },
                  { label: "Flujo", value: "Rápido" },
                  { label: "Estilo", value: "Unificado" },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.35rem] border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white px-6 py-7 sm:px-8 sm:py-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#33566d]">
                  Acceso privado
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-[#0a2536]">
                  Inicia sesión o crea tu cuenta
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 bg-[#f8fbfe] px-3 py-1.5 text-sm font-medium text-[#0a2536] transition hover:bg-slate-50"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-6 inline-flex rounded-full border border-slate-200 bg-[#f8fbfe] p-1 text-sm font-medium text-[#0a2536] shadow-sm">
              <button
                type="button"
                onClick={() => onSwitchMode("login")}
                className={`rounded-full px-4 py-2 transition ${
                  mode === "login" ? "bg-[#0a2536] text-white" : "text-slate-500"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => onSwitchMode("register")}
                className={`rounded-full px-4 py-2 transition ${
                  mode === "register" ? "bg-[#0a2536] text-white" : "text-slate-500"
                }`}
              >
                Registro
              </button>
            </div>

            {!firebaseReady ? (
              <p className="mt-5 rounded-[1.25rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                El acceso no está disponible en este momento.
              </p>
            ) : null}

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#0a2536]">
                  Correo electrónico
                </span>
                <input
                  type="email"
                  required
                  value={formState.email}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, email: event.target.value }))
                  }
                  className="w-full rounded-[1.25rem] border border-slate-200 bg-[#f8fbfe] px-4 py-3 text-base text-[#0a2536] outline-none transition placeholder:text-slate-400 focus:border-[#0a2536] focus:ring-4 focus:ring-[#0a2536]/10"
                  placeholder="correo@uridesk.com"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#0a2536]">
                  Contraseña
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formState.password}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, password: event.target.value }))
                    }
                    className="w-full rounded-[1.25rem] border border-slate-200 bg-[#f8fbfe] px-4 py-3 pr-12 text-base text-[#0a2536] outline-none transition placeholder:text-slate-400 focus:border-[#0a2536] focus:ring-4 focus:ring-[#0a2536]/10"
                    placeholder="Tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 transition hover:text-[#0a2536]"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </label>

              {isRegisterMode ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#0a2536]">
                    Confirmar contraseña
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formState.confirmPassword}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        confirmPassword: event.target.value,
                      }))
                    }
                    className="w-full rounded-[1.25rem] border border-slate-200 bg-[#f8fbfe] px-4 py-3 text-base text-[#0a2536] outline-none transition placeholder:text-slate-400 focus:border-[#0a2536] focus:ring-4 focus:ring-[#0a2536]/10"
                    placeholder="Repite tu contraseña"
                  />
                </label>
              ) : null}

              {feedback ? (
                <p className="rounded-[1.25rem] border border-slate-200 bg-[#f8fbfe] px-4 py-3 text-sm text-slate-600">
                  {feedback}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center rounded-full bg-[#0a2536] px-6 text-base font-semibold text-white transition hover:bg-[#143a53] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? "Procesando..."
                  : isRegisterMode
                    ? "Registrarse"
                    : "Entrar"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3l18 18" />
      <path d="M10.58 10.58A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
      <path d="M9.88 5.08A9.72 9.72 0 0 1 12 5c6.5 0 10 7 10 7a19.21 19.21 0 0 1-4.19 5.14" />
      <path d="M6.11 6.11C3.92 8.01 2 12 2 12s3.5 7 10 7a9.94 9.94 0 0 0 4.26-.95" />
    </svg>
  );
}
