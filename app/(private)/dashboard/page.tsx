'use client';

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { FileText, LogOut, UserCircle, User, UserPlus } from "lucide-react";

interface Profile {
  nome: string;
  email: string;
  tipo_usuario: string;
  ra_aluno: string | null;
}

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();

      // Redirect students to atestados page
      if (data.user?.tipo_usuario !== 'administrador') {
        router.push("/atestados");
        return;
      }

      setProfile(data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error("Erro ao carregar perfil");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success("Logout realizado");
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Only admins should see this dashboard
  if (!profile || profile.tipo_usuario !== "administrador") {
    return null; // The redirect happens in fetchProfile
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Logo />
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-sm">{profile?.nome}</p>
              <p className="text-xs text-muted-foreground capitalize">Administrador</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Painel Administrativo</h1>
          <p className="text-muted-foreground">Gerencie atestados médicos e usuários do sistema</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/admin/atestados")}>
            <CardHeader>
              <FileText className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Revisar Atestados</CardTitle>
              <CardDescription>
                Analise e aprove atestados enviados pelos alunos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Revisar</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/admin/usuarios")}>
            <CardHeader>
              <User className="h-10 w-10 text-secondary mb-2" />
              <CardTitle>Gerenciar Usuários</CardTitle>
              <CardDescription>Visualize e gerencie usuários existentes</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="secondary">Gerenciar</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/admin/create-user")}>
            <CardHeader>
              <UserPlus className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Criar Usuário</CardTitle>
              <CardDescription>Adicione novos administradores e funcionários</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Criar</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/perfil")}>
            <CardHeader>
              <UserCircle className="h-10 w-10 text-accent mb-2" />
              <CardTitle>Meu Perfil</CardTitle>
              <CardDescription>Visualize suas informações</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Ver Perfil</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
