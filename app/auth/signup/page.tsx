'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { z } from "zod";
import { UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

const studentSignupSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email deve ter um formato válido"),
  ra: z.string().min(5, "RA deve ter pelo menos 5 caracteres"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmarSenha: z.string(),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "Senhas não coincidem",
  path: ["confirmarSenha"],
});

const StudentSignup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [curso, setCurso] = useState("");
  const [periodo, setPeriodo] = useState("");

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      nome: formData.get("nome") as string,
      email: formData.get("email") as string,
      ra: formData.get("ra") as string,
      telefone: formData.get("telefone") as string,
      senha: formData.get("senha") as string,
      confirmarSenha: formData.get("confirmarSenha") as string,
    };

    try {
      const validationResult = studentSignupSchema.safeParse(data);

      if (!validationResult.success) {
        toast.error(validationResult.error.errors[0].message);
        return;
      }


      // Create user data for API
      const createUserData = {
        ...validationResult.data,
        cargo: 'USUARIO' as const,
      };

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createUserData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao criar conta');
      }

      toast.success("Conta criada com sucesso! Faça login para continuar.");
      router.push("/auth/login");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("já existe")) {
          toast.error("Email já está sendo usado por outro usuário");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary via-primary/90 to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <UserPlus className="h-10 w-10 text-primary" />
          </div>
          <Logo className="justify-center" />
          <div>
            <CardTitle className="text-2xl">Cadastro de Estudante</CardTitle>
            <CardDescription>Sistema de Gestão - SENAI</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signup-nome">Nome Completo *</Label>
                <Input
                  id="signup-nome"
                  name="nome"
                  type="text"
                  placeholder="João Silva"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-ra">RA *</Label>
                <Input
                  id="signup-ra"
                  name="ra"
                  type="text"
                  placeholder="12345"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">Email *</Label>
              <Input
                id="signup-email"
                name="email"
                type="email"
                placeholder="joao.silva@aluno.senai.br"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-telefone">Telefone *</Label>
              <Input
                id="signup-telefone"
                name="telefone"
                type="tel"
                placeholder="(11) 99999-9999"
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signup-curso">Curso *</Label>
                <Select value={curso} onValueChange={setCurso} name="curso" required disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tecnico-informatica">Técnico em Informática</SelectItem>
                    <SelectItem value="tecnico-eletronica">Técnico em Eletrônica</SelectItem>
                    <SelectItem value="tecnico-mecanica">Técnico em Mecânica</SelectItem>
                    <SelectItem value="tecnico-automacao">Técnico em Automação</SelectItem>
                    <SelectItem value="tecnico-edificacoes">Técnico em Edificações</SelectItem>
                    <SelectItem value="superior-analise-sistemas">Análise e Desenvolvimento de Sistemas</SelectItem>
                    <SelectItem value="superior-engenharia-producao">Engenharia de Produção</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-periodo">Período *</Label>
                <Select value={periodo} onValueChange={setPeriodo} name="periodo" required disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matutino">Matutino</SelectItem>
                    <SelectItem value="vespertino">Vespertino</SelectItem>
                    <SelectItem value="noturno">Noturno</SelectItem>
                    <SelectItem value="integral">Integral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signup-senha">Senha *</Label>
                <Input
                  id="signup-senha"
                  name="senha"
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirmar-senha">Confirmar Senha *</Label>
                <Input
                  id="signup-confirmar-senha"
                  name="confirmarSenha"
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Criando conta..." : "Criar Conta"}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link href="/auth/login" className="text-primary hover:underline">
                  Fazer login
                </Link>
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar ao login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentSignup;
