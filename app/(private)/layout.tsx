"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "./_components/app-sidebar";
import { AppBreadcrumb } from "./_components/app-breadcrumb";

interface User {
  nome: string;
  email: string;
  tipo_usuario: string;
  ra_aluno: string | null;
}

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/profile", {
          credentials: "include",
        });
        if (!response.ok) {
          let body: unknown = null;
          try {
            body = await response.json();
          } catch {
            /* ignore JSON parse errors */
          }

          const getMessageFromBody = (b: unknown): string | undefined => {
            if (!b || typeof b !== "object") return undefined;
            const rec = b as Record<string, unknown>;
            if (typeof rec.error === "string") return rec.error;
            if (typeof rec.message === "string") return rec.message;
            return undefined;
          };

          const apiMessage = getMessageFromBody(body) ?? "Token inválido";

          if (response.status === 401) {
            console.warn("Unauthorized:", apiMessage);
            toast.error(apiMessage || "Sessão expirada. Faça login novamente.");
            router.push("/auth/login");
            setLoading(false);
            return;
          }

          if (response.status === 404) {
            console.warn("User not found:", apiMessage);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            toast.error(
              apiMessage || "Usuário não encontrado. Faça login novamente."
            );
            router.push("/auth/login");
            setLoading(false);
            return;
          }

          throw new Error(apiMessage);
        }

        const data = await response.json();
        setUser(data.user);

        if (
          pathname.startsWith("/admin") &&
          !(
            data.user?.tipo_usuario === "administrador" ||
            data.user?.tipo_usuario === "funcionario"
          )
        ) {
          toast.error("Acesso negado. Esta área é restrita a administradores.");
          router.push("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Sessão expirada. Faça login novamente.");
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isPrivilegedUser =
    user.tipo_usuario === "administrador" ||
    user.tipo_usuario === "funcionario";

  if (!isPrivilegedUser) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen={true} className="bg-white">
      <AppSidebar
        userName={user.nome}
        userEmail={user.email}
        role={user.tipo_usuario}
      />
      <SidebarInset className="md:ml-70 bg-white overflow-x-hidden flex flex-col h-[100vh]">
        <header className="sticky top-0 h-20 flex items-center gap-2 border-b-4 border-[rgb(0,92,164)] px-4 bg-white z-[9999] flex-shrink-0">
          <div className="md:hidden mr-2">
            <SidebarTrigger />
          </div>

          <Link href="/dashboard" className="-ml-1 flex items-center">
            <Logo className="transform scale-90 md:scale-100" />
          </Link>
          <Separator orientation="vertical" className="mr-2 h-4" />

          <div className="flex-1 min-w-0">
            <div className="hidden md:block">
              <AppBreadcrumb />
            </div>
            <div className="block md:hidden">
              <div className="text-sm">
                <AppBreadcrumb />
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto overflow-x-hidden w-full">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
