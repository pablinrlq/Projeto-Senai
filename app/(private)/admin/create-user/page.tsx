"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";
import { UserCog, ArrowLeft, Shield, User, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { checkAuthStatus } from "@/lib/utils/auth";

const adminCreationSchema = z
  .object({
    nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email deve ter um formato válido"),
    ra: z.string().min(5, "RA deve ter pelo menos 5 caracteres"),
    telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
    senha: z
      .string()
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
      .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .regex(/\d/, "Senha deve conter pelo menos um número")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Senha deve conter pelo menos um caractere especial"
      ),
    confirmarSenha: z.string(),
    cargo: z.enum(["ADMINISTRADOR", "FUNCIONARIO", "USUARIO"], {
      errorMap: () => ({
        message: "Cargo inválido (ADMINISTRADOR, FUNCIONARIO ou USUARIO)",
      }),
    }),
    curso: z.string().optional(),
    periodo: z.string().optional().nullable(),
    turma: z.string().optional().nullable(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "Senhas não coincidem",
    path: ["confirmarSenha"],
  })
  .refine(
    (data) =>
      !(data.cargo === "USUARIO") ||
      (data.curso &&
        data.curso.length > 0 &&
        data.periodo &&
        String(data.periodo).trim().length > 0),
    {
      message: "Curso é obrigatório para alunos",
      path: ["curso"],
    }
  );

const CreateAdmin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [cargo, setCargo] = useState("");
  const [curso, setCurso] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [turma, setTurma] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const passwordRequirements = [
    { text: "No mínimo 8 caracteres", met: passwordValue.length >= 8 },
    {
      text: "Pelo menos uma letra maiúscula e minúscula",
      met: /[a-z]/.test(passwordValue) && /[A-Z]/.test(passwordValue),
    },
    { text: "Pelo menos um número", met: /\d/.test(passwordValue) },
    {
      text: "Pelo menos um caractere especial",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue),
    },
  ];

  useEffect(() => {
    if (cargo !== "USUARIO") {
      setCurso("");
      setTurma("");
      setPeriodo("");
    }
  }, [cargo]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await checkAuthStatus();
        if (
          !authStatus.isAuthenticated ||
          authStatus.user?.cargo !== "ADMINISTRADOR"
        ) {
          toast.error(
            "Acesso negado. Apenas administradores podem criar novos usuários."
          );
          router.push("/auth/login");
          return;
        }
        setIsAuthenticated(true);
      } catch {
        toast.error("Erro ao verificar autenticação");
        router.push("/auth/login");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleCreateAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
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
      cargo: cargo,
      curso: curso,
      periodo: periodo,
      turma: turma,
    };

    try {
      const validationResult = adminCreationSchema.safeParse(data);

      if (!validationResult.success) {
        toast.error(validationResult.error.errors[0].message);
        return;
      }

      const createUserData: Record<string, unknown> = {
        ...validationResult.data,
      };
      if (!createUserData.curso) delete createUserData.curso;
      if (
        !createUserData.periodo ||
        String(createUserData.periodo).trim() === ""
      )
        delete createUserData.periodo;
      if (!createUserData.turma || String(createUserData.turma).trim() === "")
        delete createUserData.turma;
      createUserData.status = createUserData.status || "ativo";

      const response = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createUserData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao criar usuário");
      }

      toast.success("Usuário criado com sucesso!");

      (e.target as HTMLFormElement).reset();
      setTimeout(() => {
        router.push("/dashboard");
      }, 600);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("já existe")) {
          toast.error("Email já está sendo usado por outro usuário");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Erro ao criar usuário. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" style={{ background: "radial-gradient(circle at 30% 30%, rgba(0,92,164,0.08), rgba(0,92,164,0))" }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" style={{ background: "radial-gradient(circle at 60% 40%, rgba(0,92,164,0.08), rgba(0,92,164,0))" }}></div>

        <Card className="w-full max-w-md shadow-md bg-white border border-[#d8d9dd] relative z-10">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#d8d9dd] border-t-[#005ca4] mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <UserCog className="h-6 w-6 text-[#005ca4] animate-pulse" />
                </div>
              </div>
              <div>
                <p className="text-base font-medium text-[#12385f]">
                  Verificando permissões
                </p>
                <p className="text-sm text-[#5b5b5f] mt-1">
                  Aguarde um momento...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-4 pt-16 relative overflow-hidden">
      <Card className="w-full max-w-lg shadow-md bg-white border border-[#d8d9dd] relative z-10">
        <CardHeader className="space-y-3 text-center pb-6 pt-6 border-b border-[#d8d9dd]">
          <div className="flex justify-between items-start gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="-ml-2 text-[#005ca4] hover:text-[#004b90] hover:bg-[#f4f7fb] h-8">
                <ArrowLeft className="h-3 w-3 mr-1" />
              </Button>
            </Link>
            <div className="flex-1 text-center">
              <CardTitle className="text-xl font-bold text-[#005ca4]">
                Novo Usuário
              </CardTitle>
            </div>
            <img src="/branding/logo.png" alt="FIEMG" className="w-20 h-auto flex-shrink-0" />
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-6">
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="admin-nome"
                  className="text-sm font-semibold text-[#12385f]"
                >
                  Nome Completo *
                </Label>
                <Input
                  id="admin-nome"
                  name="nome"
                  type="text"
                  placeholder="Maria Silva"
                  required
                  disabled={loading}
                  className="h-9 text-sm border-[#d8d9dd] focus:border-[#005ca4] focus:ring-[#005ca4]"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="admin-ra"
                  className="text-sm font-semibold text-[#12385f]"
                >
                  {cargo === "USUARIO" ? (
                    <>RA/Matrícula *</>
                  ) : (
                    <>RE (Registro de Empregado) *</>
                  )}
                </Label>
                <Input
                  id="admin-ra"
                  name="ra"
                  type="text"
                  placeholder={cargo === "USUARIO" ? "ADM12345" : "RE12345"}
                  required
                  disabled={loading}
                  className="h-9 text-sm border-[#d8d9dd] focus:border-[#005ca4] focus:ring-[#005ca4]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="admin-email"
                  className="text-sm font-semibold text-[#12385f]"
                >
                  Email *
                </Label>
                <Input
                  id="admin-email"
                  name="email"
                  type="email"
                  placeholder="maria.silva@senai.br"
                  required
                  disabled={loading}
                  className="h-9 text-sm border-[#d8d9dd] focus:border-[#005ca4] focus:ring-[#005ca4]"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="admin-telefone"
                  className="text-sm font-semibold text-[#12385f]"
                >
                  Telefone *
                </Label>
                <Input
                  id="admin-telefone"
                  name="telefone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  required
                  disabled={loading}
                  className="h-9 text-sm border-[#d8d9dd] focus:border-[#005ca4] focus:ring-[#005ca4]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="admin-cargo"
                  className="text-sm font-semibold text-[#12385f]"
                >
                  Cargo *
                </Label>
                <Select
                  value={cargo}
                  onValueChange={setCargo}
                  name="cargo"
                  required
                  disabled={loading}
                >
                  <SelectTrigger className="h-9 text-sm border-[#d8d9dd] focus:border-[#005ca4] focus:ring-[#005ca4]">
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="ADMINISTRADOR">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[#005ca4]" />
                        <span className="text-sm">Administrador</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="FUNCIONARIO">
                      <div className="flex items-center gap-2">
                        <UserCog className="h-4 w-4 text-[#005ca4]" />
                        <span className="text-sm">Funcionário</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="USUARIO">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-[#005ca4]" />
                        <span className="text-sm">Aluno</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="admin-curso"
                  className="text-sm font-semibold text-[#12385f]"
                >
                  Curso {cargo === "USUARIO" ? <span className="text-[#c56266]">*</span> : null}
                </Label>
                <Select
                  value={curso}
                  onValueChange={setCurso}
                  name="curso"
                  required={cargo === "USUARIO"}
                  disabled={loading || cargo !== "USUARIO"}
                >
                  <SelectTrigger
                    className={`h-9 text-sm border-[#d8d9dd] focus:border-[#005ca4] focus:ring-[#005ca4] ${
                      cargo !== "USUARIO" ? "opacity-50 bg-[#f4f7fb]" : ""
                    }`}
                  >
                    <SelectValue
                      placeholder={
                        cargo === "USUARIO" ? "Selecione o curso" : "Apenas para alunos"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="tecnico-automacao">Técnico em Automação</SelectItem>
                    <SelectItem value="tecnico-mecatronica">Técnico em Mecatrônica</SelectItem>
                    <SelectItem value="tecnico-eletromecanica">Técnico em Eletromecânica</SelectItem>
                    <SelectItem value="tecnico-mecanica">Técnico em Mecânica</SelectItem>
                    <SelectItem value="tecnico-manutencao-maquinas">Técnico em Manutenção de Máquinas Industriais</SelectItem>
                    <SelectItem value="tecnico-administracao">Técnico em Administração</SelectItem>
                    <SelectItem value="tecnico-controle-qualidade">Técnico em Controle de Qualidade</SelectItem>
                    <SelectItem value="tecnico-seguranca-trabalho">Técnico em Segurança do Trabalho</SelectItem>
                    <SelectItem value="tecnico-cibersistemas-automacao">Técnico em Cibersistemas para Automação</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="admin-turma"
                  className="text-sm font-semibold text-[#12385f]"
                >
                  Código da Turma {cargo === "USUARIO" ? <span className="text-[#c56266]">*</span> : null}
                </Label>
                <Input
                  id="admin-turma"
                  name="turma"
                  type="text"
                  placeholder="Ex: T2024-A1"
                  value={turma}
                  onChange={(e) => setTurma(e.target.value)}
                  required={cargo === "USUARIO"}
                  disabled={loading || cargo !== "USUARIO"}
                  className={`h-9 text-sm border-[#d8d9dd] focus:border-[#005ca4] focus:ring-[#005ca4] ${
                    cargo !== "USUARIO" ? "opacity-50 bg-[#f4f7fb]" : ""
                  }`}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="admin-periodo"
                  className="text-sm font-semibold text-[#12385f]"
                >
                  Período {cargo === "USUARIO" ? <span className="text-[#c56266]">*</span> : null}
                </Label>
                <Select
                  value={periodo}
                  onValueChange={setPeriodo}
                  name="periodo"
                  required={cargo === "USUARIO"}
                  disabled={loading || cargo !== "USUARIO"}
                >
                  <SelectTrigger
                    className={`h-9 text-sm border-[#d8d9dd] focus:border-[#005ca4] focus:ring-[#005ca4] ${
                      cargo !== "USUARIO" ? "opacity-50 bg-[#f4f7fb]" : ""
                    }`}
                  >
                    <SelectValue
                      placeholder={
                        cargo === "USUARIO" ? "Selecione um período" : "Apenas para alunos"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="matutino">Matutino</SelectItem>
                    <SelectItem value="vespertino">Vespertino</SelectItem>
                    <SelectItem value="noturno">Noturno</SelectItem>
                    <SelectItem value="integral">Integral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="admin-senha" className="text-sm font-semibold text-[#12385f]">Senha *</Label>
                <div className="relative">
                  <Input
                    id="admin-senha"
                    name="senha"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    className="h-9 text-sm border-[#d8d9dd] focus:border-[#005ca4] focus:ring-[#005ca4] pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#5b5b5f] hover:text-[#12385f]"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-confirmar-senha" className="text-sm font-semibold text-[#12385f]">Confirmar Senha *</Label>
                <div className="relative">
                  <Input
                    id="admin-confirmar-senha"
                    name="confirmarSenha"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="h-9 text-sm border-[#d8d9dd] focus:border-[#005ca4] focus:ring-[#005ca4] pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#5b5b5f] hover:text-[#12385f]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#f4f7fb] p-3 rounded-lg space-y-2 border border-[#d8d9dd]">
              <p className="text-xs font-bold text-[#12385f]">Requisitos da senha</p>
              <div className="space-y-1.5">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                        req.met ? "bg-[#7fafd3]" : "bg-[#d8d9dd]"
                      }`}
                    >
                      {req.met && (
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-xs ${
                        req.met ? "text-[#12385f] font-semibold" : "text-[#5b5b5f]"
                      }`}
                    >
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-9 text-sm bg-[#005ca4] hover:bg-[#004b90] text-white font-semibold shadow-md transition-all mt-2"
              disabled={loading}
            >
              {loading ? "Criando..." : "Criar Usuário"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAdmin;
