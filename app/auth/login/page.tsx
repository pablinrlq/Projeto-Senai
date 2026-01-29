"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().trim().email("Email inválido"),
  senha: z.string().min(1, "Senha é obrigatória"),
});

const Auth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      senha: formData.get("senha") as string,
    };

    try {
      const validationResult = loginSchema.safeParse(data);

      if (!validationResult.success) {
        toast.error(validationResult.error.errors[0].message);
        return;
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao fazer login");
      }

      // store token and user for parts of the app that still rely on localStorage
      try {
        if (result.token) {
          localStorage.setItem("token", result.token);
        }
        if (result.user) {
          localStorage.setItem("user", JSON.stringify(result.user));
        }
      } catch (err) {
        // ignore storage errors (e.g., private mode)
      }

      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("credenciais") ||
          error.message.includes("credentials")
        ) {
          toast.error("Email ou senha incorretos");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(to bottom right, #f4f7fb, #eef3f8)" }}>
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative overflow-hidden" style={{ background: "linear-gradient(145deg, #eef4fb 0%, #f7faff 35%, #ffffff 100%)" }}>
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#005ca4' }}>
            Quer descobrir algo novo?
          </h1>
          <p className="text-lg text-[#3e5673] leading-relaxed">
            Acesse o sistema para gerenciar atestados, visualizar relatórios e
            explorar oportunidades de aprendizado e crescimento profissional.
          </p>
        </div>

        <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" style={{ background: "radial-gradient(circle at 30% 30%, rgba(0,92,164,0.18), rgba(0,92,164,0))" }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" style={{ background: "radial-gradient(circle at 60% 40%, rgba(0,125,210,0.16), rgba(0,92,164,0.05))" }}></div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 bg-white relative">
        <div className="w-full max-w-md">
          <div className="absolute top-4 md:top-8 right-4 md:right-8">
            <Logo imgClassName="h-8 md:h-10 w-auto object-contain mix-blend-multiply" />
          </div>

          <div className="mb-6 md:mb-8 mt-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#12385f] mb-2">
              Seu próximo passo{" "}
              <span style={{ color: '#005ca4' }}>começa aqui</span>
            </h2>
            <p className="text-sm md:text-base text-[#4a5f77]">
              Acesse sua conta e continue sua jornada de aprendizado e
              descobertas.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-[#12385f]">
                E-mail*
              </Label>
              <Input
                id="login-email"
                name="email"
                type="text"
                placeholder="Digite seu e-mail"
                required
                disabled={loading}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password" className="text-[#12385f]">
                Senha *
              </Label>
              <div className="relative">
                <Input
                  id="login-password"
                  name="senha"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  required
                  disabled={loading}
                  className="h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a708a] hover:text-[#12385f]"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-[#4a5f77] cursor-pointer"
                >
                  Lembre-se de mim neste dispositivo!
                </label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm transition-colors" style={{ color: '#12385f' }} onMouseEnter={(e) => e.currentTarget.style.color = '#005ca4'} onMouseLeave={(e) => e.currentTarget.style.color = '#12385f'}
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-white text-base font-medium" style={{ backgroundColor: '#005ca4' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004b90'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#005ca4'}
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-[#4a5f77]">
                Não tem uma conta?{" "}
                <Link
                  href="/auth/signup"
                  className="font-medium hover:underline" style={{ color: '#005ca4' }}
                >
                  Clique aqui
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
