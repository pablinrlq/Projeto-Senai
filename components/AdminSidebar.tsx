"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  UserPlus,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminSidebarProps {
  userName?: string;
  userEmail?: string;
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Revisar Atestados",
    href: "/admin/atestados",
    icon: FileText,
  },
  {
    title: "Gerenciar Usuários",
    href: "/admin/usuarios",
    icon: Users,
  },
  {
    title: "Criar Usuário",
    href: "/admin/create-user",
    icon: UserPlus,
  },
  {
    title: "Meu Perfil",
    href: "/perfil",
    icon: User,
  },
];

export function AdminSidebar({
  userName = "Admin",
  userEmail = "admin@example.com",
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  const getInitials = (name?: string) => {
    if (!name) return "AD";
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Sidebar collapsible="offcanvas" variant="sidebar" side="left" style={{ background: 'linear-gradient(180deg, #0066FF 0%, #0052CC 50%, #003D99 100%)', minHeight: '100vh', boxShadow: '10px 0 40px rgba(0,0,0,0.3)' }}>
      <SidebarHeader style={{ background: 'linear-gradient(to right, #0066FF, #0080FF)', borderBottom: '2px solid rgba(255,255,255,0.2)', padding: '20px' }}>
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '20px', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <Logo />
          {state === "expanded" && (
            <div className="flex flex-col">
              <span style={{ fontSize: '14px', fontWeight: '900', color: 'white', letterSpacing: '2px' }}>🎯 PAINEL</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: '700' }}>
                ADMINISTRATIVO
              </span>
            </div>
          )}
        </div>
        <div style={{ height: '3px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.16), transparent)', borderRadius: '100px', margin: '14px 0' }} />
      </SidebarHeader>

      <SidebarContent style={{ padding: '32px 16px', background: 'linear-gradient(to bottom, rgba(0,102,255,0.1), rgba(0,52,204,0.1))' }}>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '24px', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.2)', marginBottom: '24px' }}>
          <h3 style={{ padding: '8px 16px', fontSize: '12px', fontWeight: '900', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>📊 Menu Principal</h3>
          <SidebarMenu className="space-y-2">
            {[menuItems[0], menuItems[4]].map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className="rounded-3xl"
                    style={isActive ? {
                      background: 'rgba(255,255,255,0.35)',
                      color: 'white',
                      border: '3px solid rgba(255,255,255,0.6)',
                      backdropFilter: 'blur(15px)',
                      fontWeight: '900',
                      transform: 'scale(1.05)',
                      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)'
                    } : {
                      color: 'rgba(255,255,255,0.95)',
                      border: '2px solid transparent',
                      fontWeight: '700',
                      transition: 'all 300ms'
                    }}
                  >
                    <Link href={item.href} className="flex items-center gap-4 w-full px-3 py-3">
                      <div style={isActive ? {
                        padding: '12px',
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.5)',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
                        transform: 'scale(1.25)'
                      } : {
                        padding: '12px',
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.2)',
                        transition: 'all 300ms'
                      }}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span style={{ flex: 1, fontSize: '16px', fontWeight: '900' }}>{item.title}</span>
                      {isActive && state === "expanded" && (
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'white', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }} />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </div>

        <div style={{ height: '4px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)', borderRadius: '100px', margin: '16px 0' }} />

        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '24px', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.2)' }}>
          <h3 style={{ padding: '8px 16px', fontSize: '12px', fontWeight: '900', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>⚙️ Administração</h3>
          <SidebarMenu className="space-y-2">
            {menuItems.slice(1, 4).map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className="rounded-3xl"
                    style={isActive ? {
                      background: 'linear-gradient(135deg, #005ca4, #0072c3)',
                      color: 'white',
                      border: '2px solid rgba(255,255,255,0.18)',
                      backdropFilter: 'blur(12px)',
                      fontWeight: '800',
                      transform: 'scale(1.01)',
                      boxShadow: '0 12px 22px rgba(0,0,0,0.22)'
                    } : {
                      color: 'rgba(255,255,255,0.9)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      fontWeight: '700',
                      transition: 'all 260ms',
                      background: 'rgba(255,255,255,0.04)'
                    }}
                  >
                    <Link href={item.href} className="flex items-center gap-4 w-full px-3 py-3">
                      <div style={isActive ? {
                        padding: '11px',
                        borderRadius: '14px',
                        background: 'rgba(255,255,255,0.24)',
                        boxShadow: '0 8px 16px -4px rgba(0,0,0,0.26)',
                        transform: 'scale(1.12)'
                      } : {
                        padding: '11px',
                        borderRadius: '14px',
                        background: 'rgba(255,255,255,0.08)',
                        transition: 'all 260ms'
                      }}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span style={{ flex: 1, fontSize: '16px', fontWeight: '900' }}>{item.title}</span>
                      {isActive && state === "expanded" && (
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', boxShadow: '0 0 0 4px rgba(255,255,255,0.16)' }} />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarSeparator style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.16), transparent)', height: '3px', borderRadius: '100px', margin: '18px 0' }} />

      <SidebarFooter style={{ background: 'linear-gradient(to top, rgba(10,22,38,0.9), transparent)', backdropFilter: 'blur(8px)', padding: '18px' }}>
        {state === "expanded" ? (
          <div className="space-y-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', borderRadius: '20px', background: 'linear-gradient(to right, rgba(255,255,255,0.12), rgba(255,255,255,0.08))', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', transition: 'all 260ms' }}>
              <Avatar className="h-12 w-12" style={{ boxShadow: '0 8px 18px -6px rgba(0,0,0,0.36)' }}>
                <AvatarFallback style={{ background: 'linear-gradient(135deg, #7fafd3, #87b9bc)', color: '#0f1f33', fontWeight: '900', fontSize: '16px' }}>
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{ fontSize: '16px', fontWeight: '900', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {userEmail}
                </p>
              </div>
            </div>
            <Button
              style={{ width: '100%', background: 'linear-gradient(to right, #c56266, #b44f54)', color: 'white', fontWeight: '800', fontSize: '15px', borderRadius: '18px', padding: '18px 14px', boxShadow: '0 14px 22px -6px rgba(197,98,102,0.4)', border: 'none', transition: 'all 260ms', cursor: 'pointer' }}
              onClick={handleLogout}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sair da Conta
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            style={{ width: '100%', color: 'rgba(255,255,255,0.92)', borderRadius: '14px', transition: 'all 260ms', background: 'rgba(255,255,255,0.06)' }}
            onClick={handleLogout}
          >
            <LogOut className="h-6 w-6" />
          </Button>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
