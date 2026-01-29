"use client";

import {
  FileText,
  LayoutDashboard,
  LogOut,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { toast } from "sonner";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Meu Perfil",
    url: "/perfil",
    icon: User,
  },
];

const adminItems = [
  {
    title: "Revisar Atestados",
    url: "/admin/atestados",
    icon: FileText,
  },
  {
    title: "Gerenciar Usuários",
    url: "/admin/usuarios",
    icon: Users,
  },
  {
    title: "Criar Usuário",
    url: "/admin/create-user",
    icon: UserPlus,
  },
];

interface AppSidebarProps {
  userName?: string;
  userEmail?: string;
  role?: string;
}

export function AppSidebar({ userName, userEmail, role }: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = () => {
    try {
      fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      /* ignore */
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logout realizado com sucesso");
    router.push("/auth/login");
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const isAdminUser = role === "administrador";
  const isFuncionario = role === "funcionario";
  const showAdminGroup = isAdminUser || isFuncionario;

  const displayedAdminItems = adminItems.filter(
    (item) => !(isFuncionario && item.url === "/admin/create-user")
  );

  return (
    <Sidebar className="border-r border-white/10 bg-[#005ca4] text-white">
      <SidebarHeader className="border-b border-white/10 px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white/15 px-3 py-2 text-sm font-bold">
            SG
          </div>
          <div>
            <p className="text-xs text-white/70">Sistema</p>
            <p className="font-semibold">Gestão Atestados</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase text-white/70">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="rounded-lg border border-white/10 text-white/80 transition hover:border-white/30 hover:bg-white/10 hover:text-white data-[active=true]:border-white/40 data-[active=true]:bg-white/20 data-[active=true]:text-white"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {showAdminGroup && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase text-white/70">
              Administração
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {displayedAdminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className="rounded-lg border border-white/10 text-white/80 transition hover:border-white/30 hover:bg-white/10 hover:text-white data-[active=true]:border-white/40 data-[active=true]:bg-white/20 data-[active=true]:text-white"
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="border border-white/10 hover:border-white/30 hover:bg-white/10">
                  <Avatar>
                    <AvatarFallback className="bg-white/20 text-white">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start overflow-hidden text-left">
                    <p className="text-sm font-medium truncate w-full">
                      {userName || "Usuário"}
                    </p>
                    <p className="text-xs text-white/70 truncate w-full">
                      {userEmail || ""}
                    </p>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 py-1 border border-white/20 bg-[#001f3f]">
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-sm px-3 py-2 flex items-center gap-2 text-white/90 hover:bg-white/10 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="leading-4">Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
