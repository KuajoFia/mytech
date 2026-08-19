"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, FileText, Settings, Wrench, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFCFA } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingCart },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/devis", label: "Devis services", icon: FileText },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

type Props = {
  user: { name: string; role: string };
  stats: {
    ordersCount: number;
    revenue: number;
    clientsCount: number;
    productsCount: number;
    newRequests: number;
  };
};

export function AdminSidebar({ user, stats }: Props) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 bg-brand text-white flex-col">
      <div className="p-5 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-md bg-white text-brand flex items-center justify-center font-extrabold text-lg">A</div>
          <div>
            <div className="font-display font-bold text-sm">AGBE-TECH</div>
            <div className="text-[10px] text-white/70 uppercase tracking-widest">Back-office</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition",
                active ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
              {item.label === "Devis services" && stats.newRequests > 0 && (
                <span className="ml-auto bg-accent-yellow text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {stats.newRequests}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-3">
        <div className="bg-white/10 rounded p-3 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-white/70">CA total</span>
            <span className="font-bold text-accent-yellow">{formatFCFA(stats.revenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Commandes</span>
            <span className="font-bold">{stats.ordersCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Clients</span>
            <span className="font-bold">{stats.clientsCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Produits</span>
            <span className="font-bold">{stats.productsCount}</span>
          </div>
        </div>
        <div className="text-xs text-white/70 px-3">{user.name} · {user.role}</div>
      </div>
    </aside>
  );
}
