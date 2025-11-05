import { useEffect } from 'react';
import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Plus,
  FileText,
  BookOpen,
  Bell,
  Moon,
  Sun,
  Scale,
  LogOut,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Toaster } from '../components/ui/sonner';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '../components/ui/sheet';
import { WelcomeDialog } from '../components/welcome-dialog';
import { NotificationsPage } from '../components/notifications-page';
import logoImage from 'figma:asset/80fc1f1e9ee50b88e65b40f85f7f2f310a0875da.png';
import { useAppState } from '../contexts/AppStateContext';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Solicitações', icon: FileText, to: '/solicitacoes' },
  { label: 'Nova Solicitação', icon: Plus, to: '/solicitacoes/nova' },
  { label: 'Processos', icon: Scale, to: '/processos' },
  { label: 'Base de Conhecimento', icon: BookOpen, to: '/base-conhecimento' },
];

export function AuthenticatedLayout() {
  const navigate = useNavigate();
  const {
    user,
    solicitacoes,
    processos,
    toggleDarkMode,
    isDarkMode,
    handleLogout,
    showWelcome,
    setShowWelcome,
    notifications,
    showNotifications,
    setShowNotifications,
    unreadNotificationsCount,
    handleNotificationClick,
  } = useAppState();

  const location = useRouterState({
    select: state => state.location,
  });

  useEffect(() => {
    if (!user) {
      navigate({ to: '/login', replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleNavClick = (path: string) => {
    navigate({ to: path });
  };

  const isActive = (path: string) => {
    const pathname = location.pathname;
    return pathname === path;
  };

  const onLogout = async () => {
    await handleLogout();
    navigate({ to: '/login' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950 transition-colors duration-300">
      <Toaster />
      <WelcomeDialog open={showWelcome} onClose={() => setShowWelcome(false)} />

      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 md:gap-5 min-w-0 flex-1">
              <img
                src={logoImage}
                alt="ControladorIA Logo"
                className="w-20 h-20 md:w-32 md:h-32 flex-shrink-0 object-contain dark:brightness-0 dark:invert transition-all duration-300"
              />
              <div className="min-w-0">
                <h1 className="text-xl md:text-3xl truncate">ControladorIA</h1>
                <p className="text-sm md:text-base text-muted-foreground hidden sm:block truncate">
                  Sistema de Análise para Escritórios de Advocacia
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium max-w-[120px] truncate">
                  {user.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8 md:h-10 md:w-10"
                onClick={() => setShowNotifications(true)}
              >
                <Bell className="h-4 w-4 md:h-5 md:w-5" />
                {unreadNotificationsCount > 0 && (
                  <>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {unreadNotificationsCount > 9
                        ? '9+'
                        : unreadNotificationsCount}
                    </span>
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="h-8 w-8 md:h-10 md:w-10"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 md:h-5 md:w-5" />
                ) : (
                  <Moon className="h-4 w-4 md:h-5 md:w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                className="h-8 w-8 md:h-10 md:w-10 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                title="Sair"
              >
                <LogOut className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          <aside className="lg:col-span-3">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {navItems.map(item => (
                    <Button
                      key={item.to}
                      variant={isActive(item.to) ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => handleNavClick(item.to)}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="text-xs text-muted-foreground">
                    Resumo Rápido
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Solicitações</span>
                      <Badge variant="secondary">{solicitacoes.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Processos</span>
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                      >
                        {processos.length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Aprovadas</span>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      >
                        {
                          solicitacoes.filter(s => s.status === 'aprovada')
                            .length
                        }
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          <main className="lg:col-span-9 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>

      <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0">
          <SheetTitle className="sr-only">Notificações</SheetTitle>
          <SheetDescription className="sr-only">
            Centro de notificações do sistema
          </SheetDescription>
          <NotificationsPage
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
            onClose={() => setShowNotifications(false)}
          />
        </SheetContent>
      </Sheet>

      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Sistema Seguro-Defeso. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Suporte
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
