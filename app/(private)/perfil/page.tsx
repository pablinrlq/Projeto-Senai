"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { formatDate } from "@/utils/formatDate";
import { Badge } from "@/components/ui/badge";
import { IdCard, Mail, Shield, UserCircle } from "lucide-react";

interface Profile {
  nome: string;
  email: string;
  tipo_usuario: string;
  ra_aluno: string | null;
  created_at?: string;
}

export default function Perfil() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch("/api/profile");

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data.user);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Erro ao carregar perfil");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const getTipoBadge = (tipo: string) => {
    const typeMap: Record<string, { bg: string; text: string; border: string }> = {
      administrador: { bg: "#ffebee", text: "#c62828", border: "#ef5350" },
      funcionario: { bg: "#e3f2fd", text: "#1565c0", border: "#005ca4" },
      aluno: { bg: "#e0f2f1", text: "#00695c", border: "#4db8ac" },
    };

    const type = (tipo || "").toLowerCase();
    const colors = typeMap[type] || typeMap.aluno;

    return (
      <div
        style={{
          backgroundColor: colors.bg,
          color: colors.text,
          border: `1px solid ${colors.border}`,
        }}
        className="px-2 py-0.5 rounded-full text-xs font-medium"
      >
        {tipo}
      </div>
    );
  };

  return (
    <div className="bg-background">
      <main className="px-2 sm:px-4 md:px-8 py-4 md:py-6">
        <div className="mb-6 md:mb-8 w-full max-w-4xl mx-auto">
          <div className="flex items-start gap-3 md:gap-4">
            <div style={{ width: '4px', height: '45px', backgroundColor: '#005ca4', borderRadius: '8px' }} />
            <div>
              <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2" style={{ color: '#005ca4' }}>
                Meu Perfil
              </h1>
              <p className="text-xs md:text-base text-muted-foreground">Suas informações pessoais</p>
            </div>
          </div>
        </div>
        <div className="w-full max-w-4xl mx-auto">
          <Card className="border-2 border-[#005ca4]">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <UserCircle className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-[#005ca4] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg md:text-2xl text-[#12385f]">
                      {profile?.nome}
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm text-[#5b5b5f]">
                      {profile?.created_at
                        ? `Membro desde ${formatDate(profile.created_at)}`
                        : "Perfil do sistema"}
                    </CardDescription>
                  </div>
                </div>
                <div className="mt-1">
                  {profile && getTipoBadge(profile.tipo_usuario)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4 px-4 sm:px-6 pb-4 md:pb-6">
              <div className="grid gap-3 md:gap-4">
                <div className="flex items-start gap-2 md:gap-3">
                  <Mail className="h-4 w-4 md:h-5 md:w-5 text-[#005ca4] mt-0.5 md:mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm font-medium text-[#12385f]">Email</p>
                    <p className="text-xs md:text-sm text-[#5b5b5f] break-all">
                      {profile?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 md:gap-3">
                  <Shield className="h-4 w-4 text-[#005ca4] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs md:text-sm font-medium text-[#12385f]">Tipo de Usuário</p>
                    <p className="text-xs md:text-sm text-[#5b5b5f] capitalize">
                      {profile?.tipo_usuario}
                    </p>
                  </div>
                </div>

                {profile?.ra_aluno && (
                  <div className="flex items-start gap-2 md:gap-3">
                    <IdCard className="h-4 w-4 text-[#005ca4] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs md:text-sm font-medium text-[#12385f]">RA</p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {profile.ra_aluno}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#d8d9dd]">
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="w-full sm:w-auto border-[#005ca4] text-[#005ca4] hover:bg-[#f4f7fb]"
                  variant="outline"
                >
                  Voltar ao Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
