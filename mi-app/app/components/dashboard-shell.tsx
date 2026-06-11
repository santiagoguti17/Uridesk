"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import {
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  FolderKanban,
  LayoutDashboard,
  Menu,
  Search,
  Settings2,
  Scale,
  ShieldAlert,
  TrendingUp,
  Users,
  FileText,
  Landmark,
  BarChart3,
  Gavel,
  BriefcaseBusiness,
  Plus,
  X,
} from "lucide-react";

type DashboardShellProps = {
  user: User;
  onSignOut: () => void;
  isFirebaseReady: boolean;
};

type ViewKey =
  | "Dashboard"
  | "Expedientes"
  | "Calendario"
  | "Finanzas"
  | "Reportes"
  | "Configuración";

type ProcessRow = {
  client: string;
  radicado: string;
  status: string;
  nextAction: string;
  owner: string;
  auctionDate: string;
  balance: string;
  priority: "Alta" | "Media" | "Baja";
  dueIn: number;
};

const sidebarItems: Array<{ label: ViewKey; icon: typeof LayoutDashboard }> = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Expedientes", icon: FolderKanban },
  { label: "Calendario", icon: CalendarDays },
  { label: "Reportes", icon: BarChart3 },
  { label: "Configuración", icon: Settings2 },
];

const quickMenuItems: ViewKey[] = ["Dashboard", "Expedientes", "Calendario", "Finanzas", "Reportes"];

const kpis = [
  { label: "Expedientes activos", value: "128", trend: "+12% vs. mes anterior", icon: FolderKanban, accent: "from-[#0a2536] to-[#33566d]" },
  { label: "Expedientes urgentes", value: "14", trend: "6 vencen hoy", icon: ShieldAlert, accent: "from-[#17384f] to-[#0a2536]" },
  { label: "Próximos remates", value: "9", trend: "3 en 72 horas", icon: Gavel, accent: "from-[#33566d] to-[#5c7890]" },
  { label: "Honorarios pactados", value: "$ 1.84B", trend: "+8.4% acumulado", icon: BriefcaseBusiness, accent: "from-[#102b40] to-[#33566d]" },
  { label: "Total cobrado", value: "$ 920M", trend: "+18% este mes", icon: BadgeCheck, accent: "from-[#18485b] to-[#0a2536]" },
  { label: "Saldo pendiente", value: "$ 460M", trend: "78 expedientes por cobrar", icon: CircleDollarSign, accent: "from-[#2a4d65] to-[#516f88]" },
];

const processRows: ProcessRow[] = [
  { client: "Banco Andino S.A.", radicado: "11001-31-03-015-2024-00123", status: "Audiencia", nextAction: "Audiencia preliminar", owner: "Dra. Pérez", auctionDate: "12 Jun 2026", balance: "$ 84M", priority: "Alta", dueIn: 1 },
  { client: "Constructora Delta", radicado: "05001-22-11-008-2023-00455", status: "Cobro cartera", nextAction: "Notificación", owner: "Dr. Gómez", auctionDate: "18 Jun 2026", balance: "$ 142M", priority: "Alta", dueIn: 4 },
  { client: "Inversiones Nova", radicado: "76001-21-04-002-2024-00981", status: "Remate", nextAction: "Publicación de aviso", owner: "Dra. Ríos", auctionDate: "20 Jun 2026", balance: "$ 210M", priority: "Media", dueIn: 6 },
  { client: "Comercializadora Alfa", radicado: "08001-33-41-003-2023-00231", status: "En curso", nextAction: "Descargos", owner: "Dr. Herrera", auctionDate: "25 Jun 2026", balance: "$ 56M", priority: "Baja", dueIn: 11 },
  { client: "Fondo Capital Legal", radicado: "11001-11-02-004-2024-00644", status: "Urgente", nextAction: "Contestación", owner: "Dra. López", auctionDate: "11 Jun 2026", balance: "$ 96M", priority: "Alta", dueIn: 0 },
];

const alerts = [
  "3 procesos sin movimiento en más de 21 días.",
  "2 clientes con mora superior a 90 días.",
  "1 remate requiere revisión documental hoy.",
  "4 tareas de respuesta judicial pendientes.",
];

const upcomingEvents = [
  { date: "Hoy 9:00 AM", title: "Audiencia de saneamiento", detail: "Banco Andino S.A." },
  { date: "Hoy 4:30 PM", title: "Revisión de remate", detail: "Inversiones Nova" },
  { date: "Mañana 11:00 AM", title: "Entrega de poder", detail: "Constructora Delta" },
  { date: "Vie 2:00 PM", title: "Comité de cartera", detail: "Cobro priorizado" },
];

const financeMetrics = [
  { label: "Ingresos", value: "$ 210M", delta: "+16%" },
  { label: "Facturación", value: "$ 248M", delta: "+9%" },
  { label: "Recaudo", value: "$ 92M", delta: "+22%" },
  { label: "Cartera pendiente", value: "$ 460M", delta: "-6%" },
];

const priorityClients = [
  { name: "Banco Andino S.A.", note: "12 procesos críticos", amount: "$ 84M" },
  { name: "Constructora Delta", note: "Cobro con mora alta", amount: "$ 142M" },
  { name: "Fondo Capital Legal", note: "Audiencias esta semana", amount: "$ 96M" },
];

export function DashboardShell({ user, onSignOut, isFirebaseReady }: DashboardShellProps) {
  const [activeView, setActiveView] = useState<ViewKey>("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredProcesses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return processRows.filter((row) => {
      if (!query) {
        return true;
      }

      return [row.client, row.radicado, row.status, row.nextAction, row.owner, row.priority]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [search]);

  return (
    <div className="min-h-screen bg-[#eef5fb] text-[#0a2536]">
      <div className="flex min-h-screen">
        <aside className="hidden w-80 shrink-0 border-r border-slate-200/80 bg-white/85 px-5 py-6 shadow-[10px_0_40px_rgba(15,23,42,0.04)] backdrop-blur md:flex md:flex-col">
          <div className="flex items-center gap-3 rounded-2xl bg-[#f4f8fc] px-4 py-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0a2536] text-white shadow-lg">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#33566d]">Uridesk CRM</p>
              <p className="text-sm text-slate-500">Gestión jurídica premium</p>
            </div>
          </div>

          <nav className="mt-8 space-y-1.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.label === activeView;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveView(item.label)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                    isActive
                      ? "bg-[#0a2536] text-white shadow-[0_16px_30px_rgba(10,37,54,0.18)]"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? "text-white" : "text-[#33566d]"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto rounded-[1.5rem] border border-slate-200 bg-[#f7fbff] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#33566d]">Sesión</p>
            <p className="mt-2 text-sm font-semibold text-[#0a2536]">{user.email ?? "Usuario autenticado"}</p>
            <p className="mt-1 text-sm text-slate-500">{isFirebaseReady ? "Firebase activo" : "Firebase no configurado"}</p>
            <button
              type="button"
              onClick={onSignOut}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#0a2536] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#143a53]"
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
            <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
              <div className="relative md:hidden">
                <button
                  type="button"
                  onClick={() => setMenuOpen((current) => !current)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[#0a2536] shadow-sm"
                  aria-label="Abrir menú"
                >
                  {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>

                {menuOpen ? (
                  <div className="absolute left-0 top-14 w-72 rounded-[1.5rem] border border-slate-200 bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
                    <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">Navegación</p>
                    {quickMenuItems.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setActiveView(item);
                          setMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                          activeView === item ? "bg-[#f1f6fb] text-[#0a2536]" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span>{item}</span>
                        <ChevronDown className="h-4 w-4 rotate-[-90deg] text-slate-400" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-1 items-center gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#33566d]">Dashboard jurídico</p>
                  <h1 className="text-lg font-semibold sm:text-xl">
                    Buenos días, {user.displayName?.split(" ")[0] ?? user.email?.split("@")[0] ?? "abogado"}
                  </h1>
                </div>

                <label className="hidden flex-1 max-w-xl items-center gap-3 rounded-full border border-slate-200 bg-[#f8fbfe] px-4 py-3 text-sm text-slate-500 shadow-sm lg:flex">
                  <Search className="h-4.5 w-4.5 text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar procesos, clientes, radicados o responsables"
                    className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  />
                </label>
              </div>

              <div className="ml-auto flex items-center gap-3">
                <button
                  type="button"
                  className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm lg:inline-flex"
                >
                  <Bell className="h-4.5 w-4.5" />
                </button>
                <button
                  type="button"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-[#0a2536] px-4.5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(10,37,54,0.2)] transition hover:bg-[#143a53]"
                >
                  <Plus className="h-4 w-4" />
                  Crear nuevo proceso
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
            {activeView === "Dashboard" ? (
              <DashboardView search={search} setSearch={setSearch} filteredProcesses={filteredProcesses} />
            ) : (
              <ModuleView view={activeView} userName={user.displayName ?? user.email ?? "Usuario"} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function DashboardView({
  search,
  setSearch,
  filteredProcesses,
}: {
  search: string;
  setSearch: (value: string) => void;
  filteredProcesses: ProcessRow[];
}) {
  const donutStops = "conic-gradient(#0a2536 0 64%, #33566d 64% 83%, #9fb2c5 83% 100%)";

  return (
    <div className="space-y-6 pb-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpis.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${metric.accent} text-white shadow-lg`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500">{metric.label}</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold tracking-tight text-[#0a2536]">{metric.value}</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {metric.trend}
                </span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_0.95fr]">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#33566d]">Procesos</p>
              <h2 className="mt-1 text-xl font-semibold text-[#0a2536]">Expedientes críticos y próximos movimientos</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Todos', 'Urgentes', 'Remates', 'Audiencias'].map((chip) => (
                <button key={chip} type="button" className="rounded-full border border-slate-200 bg-[#f8fbfe] px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white">
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-slate-200">
            <div className="flex items-center gap-3 border-b border-slate-200 bg-[#f8fbfe] px-4 py-3">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Filtrar tabla de procesos"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
              <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600">Ordenar</button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-white text-xs uppercase tracking-[0.18em] text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Cliente</th>
                    <th className="px-4 py-3 font-semibold">Radicado</th>
                    <th className="px-4 py-3 font-semibold">Estado</th>
                    <th className="px-4 py-3 font-semibold">Próxima actuación</th>
                    <th className="px-4 py-3 font-semibold">Responsable</th>
                    <th className="px-4 py-3 font-semibold">Fecha remate</th>
                    <th className="px-4 py-3 font-semibold">Saldo pendiente</th>
                    <th className="px-4 py-3 font-semibold">Prioridad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredProcesses.map((row) => (
                    <tr key={row.radicado} className="hover:bg-slate-50/80">
                      <td className="px-4 py-4 font-medium text-[#0a2536]">{row.client}</td>
                      <td className="px-4 py-4 text-slate-500">{row.radicado}</td>
                      <td className="px-4 py-4">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-4 py-4 text-slate-600">{row.nextAction}</td>
                      <td className="px-4 py-4 text-slate-600">{row.owner}</td>
                      <td className="px-4 py-4 text-slate-600">{row.auctionDate}</td>
                      <td className="px-4 py-4 font-semibold text-[#0a2536]">{row.balance}</td>
                      <td className="px-4 py-4">
                        <PriorityBadge priority={row.priority} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </article>

        <aside className="space-y-6">
          <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#33566d]">Distribución</p>
                <h3 className="mt-1 text-lg font-semibold text-[#0a2536]">Avance procesal</h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">Últimos 30 días</span>
            </div>
            <div className="mt-5 flex items-center gap-5">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full" style={{ background: donutStops }}>
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-inner">
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-[#0a2536]">64%</p>
                    <p className="text-xs text-slate-500">casos avanzados</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-3 text-sm">
                <MetricLine label="En trámite" value="64%" color="bg-[#0a2536]" />
                <MetricLine label="En espera" value="19%" color="bg-[#33566d]" />
                <MetricLine label="Cerrados" value="17%" color="bg-slate-300" />
              </div>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#33566d]">Alertas inteligentes</p>
            <h3 className="mt-1 text-lg font-semibold text-[#0a2536]">Atención inmediata</h3>
            <div className="mt-4 space-y-3">
              {alerts.map((alert) => (
                <div key={alert} className="flex items-start gap-3 rounded-2xl bg-[#f8fbfe] px-4 py-3">
                  <AlertTriangle className="mt-0.5 h-4.5 w-4.5 text-amber-500" />
                  <p className="text-sm text-slate-600">{alert}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#33566d]">Calendario</p>
                <h3 className="mt-1 text-lg font-semibold text-[#0a2536]">Próximos eventos</h3>
              </div>
              <CalendarDays className="h-5 w-5 text-[#33566d]" />
            </div>
            <div className="mt-4 space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.title} className="rounded-2xl border border-slate-200 bg-[#f8fbfe] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#33566d]">{event.date}</p>
                  <p className="mt-1 font-semibold text-[#0a2536]">{event.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{event.detail}</p>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#33566d]">Finanzas</p>
              <h3 className="mt-1 text-lg font-semibold text-[#0a2536]">Ingresos, recaudo y cartera</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500"><ArrowUpRight className="h-4 w-4 text-emerald-500" />+12.8% mensual</div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {financeMetrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl bg-[#f8fbfe] p-4">
                <p className="text-sm text-slate-500">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold text-[#0a2536]">{metric.value}</p>
                <p className="mt-1 text-sm font-medium text-emerald-600">{metric.delta}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-4">
            {[
              { label: "Recaudo mensual", value: "92M / 120M", width: "w-[76%]" },
              { label: "Facturación", value: "248M / 300M", width: "w-[82%]" },
              { label: "Honorarios cobrados", value: "73%", width: "w-[73%]" },
              { label: "Cartera al día", value: "58%", width: "w-[58%]" },
            ].map((bar) => (
              <div key={bar.label} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{bar.label}</span>
                  <span className="font-semibold text-[#0a2536]">{bar.value}</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-100">
                  <div className={`h-2 rounded-full bg-[#0a2536] ${bar.width}`} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#33566d]">Clientes prioritarios</p>
          <h3 className="mt-1 text-lg font-semibold text-[#0a2536]">Saldos y procesos críticos</h3>
          <div className="mt-4 space-y-3">
            {priorityClients.map((client) => (
              <div key={client.name} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-[#f8fbfe] px-4 py-4">
                <div>
                  <p className="font-semibold text-[#0a2536]">{client.name}</p>
                  <p className="text-sm text-slate-500">{client.note}</p>
                </div>
                <p className="font-semibold text-[#0a2536]">{client.amount}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-[#0a2536] p-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-300">Embudo procesal</p>
                <h4 className="mt-1 text-lg font-semibold">Conversión jurídica</h4>
              </div>
              <Landmark className="h-5 w-5 text-slate-300" />
            </div>
            <div className="mt-5 space-y-4 text-sm">
              <MetricLine label="Radicados nuevos" value="24" color="bg-white" light />
              <MetricLine label="En negociación" value="18" color="bg-sky-300" light />
              <MetricLine label="Cerrados este mes" value="11" color="bg-emerald-300" light />
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

function ModuleView({ view, userName }: { view: ViewKey; userName: string }) {
  const iconByView: Record<ViewKey, ReactNode> = {
    Dashboard: <LayoutDashboard className="h-6 w-6" />,
    Procesos: <FolderKanban className="h-6 w-6" />,
    Clientes: <Users className="h-6 w-6" />,
    Calendario: <CalendarDays className="h-6 w-6" />,
    Documentos: <FileText className="h-6 w-6" />,
    Honorarios: <CircleDollarSign className="h-6 w-6" />,
    Reportes: <BarChart3 className="h-6 w-6" />,
    "Configuración": <Settings2 className="h-6 w-6" />,
  };

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0a2536] text-white">{iconByView[view]}</div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#33566d]">{view}</p>
          <h2 className="mt-1 text-2xl font-semibold text-[#0a2536]">{view} en construcción elegante</h2>
        </div>
      </div>
      <p className="mt-4 max-w-2xl text-slate-600">
        {userName}, esta sección ya está conectada al menú lateral. Puedes convertirla en un módulo completo cuando quieras. Por ahora el foco principal queda en Dashboard, que concentra la operación, los riesgos y el dinero.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { label: "Estado", value: "Activo" },
          { label: "Última actualización", value: "Hace 2 min" },
          { label: "Acciones", value: "Navegación lista" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-[#f8fbfe] p-4">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 font-semibold text-[#0a2536]">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Urgente: "bg-red-50 text-red-700 border-red-100",
    Audiencia: "bg-sky-50 text-sky-700 border-sky-100",
    "Cobro cartera": "bg-amber-50 text-amber-700 border-amber-100",
    Remate: "bg-violet-50 text-violet-700 border-violet-100",
    "En curso": "bg-slate-100 text-slate-700 border-slate-200",
  };

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${styles[status] ?? "bg-slate-100 text-slate-700 border-slate-200"}`}>{status}</span>;
}

function PriorityBadge({ priority }: { priority: "Alta" | "Media" | "Baja" }) {
  const styles = {
    Alta: "bg-red-50 text-red-700 border-red-100",
    Media: "bg-amber-50 text-amber-700 border-amber-100",
    Baja: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${styles[priority]}`}>{priority}</span>;
}

function MetricLine({ label, value, color, light = false }: { label: string; value: string; color: string; light?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className={light ? "text-slate-300" : "text-slate-500"}>{label}</span>
        <span className={`font-semibold ${light ? "text-white" : "text-[#0a2536]"}`}>{value}</span>
      </div>
      <div className={`mt-2 h-2 rounded-full ${light ? "bg-white/10" : "bg-slate-100"}`}>
        <div className={`h-2 rounded-full ${color} ${light ? "opacity-90" : ""}`} style={{ width: light ? undefined : undefined }} />
      </div>
    </div>
  );
}