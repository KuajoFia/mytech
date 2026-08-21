import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata: Metadata = {
  title: "Back-office",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers();
  const currentPath = hdrs.get("x-pathname") ?? "";

  // Public admin routes that don't require auth or chrome
  const isPublic = currentPath === "/admin/connexion" || currentPath === "/admin";

  const session = await getSession();
  if (!session && !isPublic) {
    redirect("/admin/connexion");
  }
  if (session && session.role !== "ADMIN" && session.role !== "STAFF" && !isPublic) {
    redirect("/compte");
  }

  // Public routes: render without admin chrome
  if (isPublic) {
    return <>{children}</>;
  }

  const stats = await Promise.all([
    db.order.count(),
    db.order.aggregate({ _sum: { total: true } }),
    db.user.count({ where: { role: "CLIENT" } }),
    db.product.count(),
    db.serviceRequest.count({ where: { status: "NEW" } }),
  ]);

  const [ordersCount, revenueAgg, clientsCount, productsCount, newRequests] = stats;
  const revenue = revenueAgg._sum.total ?? 0;

  return (
    <div className="min-h-screen flex bg-secondary">
      <AdminSidebar
        user={session!}
        stats={{
          ordersCount,
          revenue,
          clientsCount,
          productsCount,
          newRequests,
        }}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-background border-b px-6 py-3 flex items-center justify-between">
          <div className="text-sm">
            <span className="text-muted-foreground">Admin · </span>
            <span className="font-medium">AGBE-TECH Back-office</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-xs text-brand hover:underline">
              Voir le site →
            </Link>
            <span className="text-xs text-muted-foreground">{session!.name}</span>
            <form action="/api/auth/logout" method="post">
              <button type="submit" className="text-xs text-destructive hover:underline">Déconnexion</button>
            </form>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden p-6 bg-secondary">
          {children}
        </main>
      </div>
    </div>
  );
}
