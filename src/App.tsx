import { useState, useEffect } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { 
  LayoutDashboard, 
  Plus, 
  FileText, 
  BookOpen, 
  Bell, 
  Moon,
  Sun,
  ChevronLeft,
  Scale,
  LogOut
} from 'lucide-react';
import logoImage from 'figma:asset/80fc1f1e9ee50b88e65b40f85f7f2f310a0875da.png';
import { NewCaseForm } from './components/new-case-form';
import { KnowledgeBase } from './components/knowledge-base';
import { WelcomeDialog } from './components/welcome-dialog';
import { AllSolicitacoes } from './components/all-solicitacoes';
import { AllProcessos } from './components/all-processos';
import { DashboardStatsNew } from './components/dashboard-stats-new';
import { SolicitacaoDetail } from './components/solicitacao-detail';
import { ProcessoDetail } from './components/processo-detail';
import { Login } from './components/auth/login';
import { ForgotPassword } from './components/auth/forgot-password';
import { ResetPassword } from './components/auth/reset-password';
import { NotificationsPage } from './components/notifications-page';
import { mockSolicitacoes, mockProcessos, mockDefesoPeriods, mockKnowledgeBase, simulateAIAnalysis, mockNotifications } from './lib/mock-data';
import { Solicitacao, Processo, Pescador, Document as DocumentType, Notification } from './lib/types';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from './components/ui/sheet';
import { UploadedDocument } from './components/document-upload';
import { downloadSolicitacaoReport, downloadProcessoReport, downloadDocumentRequest } from './components/report-generator';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { Badge } from './components/ui/badge';
import { api, ApiService } from './services/api';

type View = 'dashboard' | 'solicitacoes' | 'processos' | 'new-solicitacao' | 'solicitacao-detail' | 'processo-detail' | 'knowledge-base';
type AuthView = 'login' | 'forgot-password' | 'reset-password';

interface User {
  email: string;
  name: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>(mockSolicitacoes);
  const [processos, setProcessos] = useState<Processo[]>(mockProcessos);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedSolicitacaoId, setSelectedSolicitacaoId] = useState<string | null>(null);
  const [selectedProcessoId, setSelectedProcessoId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);

  // Configurar handler global para sessão expirada e tentar descobrir sessão ativa via cookie
  useEffect(() => {
    ApiService.setOnUnauthorized(() => {
      setUser(null);
      setAuthView('login');
      localStorage.removeItem('seguroDefeso_user');
      toast.error('Sua sessão expirou. Faça login novamente.');
    });

    // Tentar obter o usuário autenticado ao carregar a aplicação
    (async () => {
      try {
        const userResp = await api.get('/session/user');
        const u = (userResp?.data as any)?.data;
        if (u) {
          const nameParts = [u.first_name, u.last_name].filter(Boolean);
          const friendlyName = nameParts.length > 0 ? nameParts.join(' ') : (u.username || u.email);
          const userForApp: User = { email: u.email, name: friendlyName };
          setUser(userForApp);
          localStorage.setItem('seguroDefeso_user', JSON.stringify(userForApp));
        }
      } catch {
        // ignorar: usuário não autenticado
      }
    })();
  }, []);

  const handleLoginSuccess = (userData: User) => {
    // Dados já vieram do endpoint /session/user no componente de Login
    setUser(userData);
    localStorage.setItem('seguroDefeso_user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    try {
      await api.post('/session/logout');
    } catch {
      // mesmo que falhe, limpe o estado local
    }
    setUser(null);
    localStorage.removeItem('seguroDefeso_user');
    toast.success('Logout realizado com sucesso');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleNotificationClick = (notification: Notification) => {
    setShowNotifications(false);
    // Lógica para navegar para a solicitação ou processo relacionado
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const handleViewSolicitacao = (id: string) => {
    setSelectedSolicitacaoId(id);
    setCurrentView('solicitacao-detail');
  };

  const handleViewProcesso = (id: string) => {
    setSelectedProcessoId(id);
    setCurrentView('processo-detail');
  };

  const handleApproveSolicitacao = (solicitacaoId: string) => {
    setSolicitacoes(solicitacoes.map(sol => 
      sol.id === solicitacaoId 
        ? { ...sol, status: 'aprovada' as const, updatedAt: new Date() }
        : sol
    ));
    toast.success('Solicitação aprovada com sucesso! Agora você pode abrir o processo.');
  };

  const handleConvertToProcesso = (solicitacao: Solicitacao) => {
    // Criar novo processo a partir da solicitação aprovada
    const novoProcesso: Processo = {
      id: `pr${Date.now()}`,
      pescador: solicitacao.pescador,
      status: 'em_andamento',
      documents: solicitacao.documents,
      numeroProcesso: `${Math.floor(Math.random() * 9000000) + 1000000}-${Math.floor(Math.random() * 90) + 10}.2024.8.26.${Math.floor(Math.random() * 900) + 100}`,
      tribunal: 'TJSP',
      orgaoJulgador: 'Vara Cível',
      classeProcessual: 'Procedimento Comum Cível',
      assunto: 'Seguro-Defeso',
      situacao: 'Distribuído',
      dataAjuizamento: new Date(),
      movimentacoes: 1,
      ultimaMovimentacao: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: solicitacao.priority,
      solicitacaoId: solicitacao.id,
      lawyerNotes: `Processo originado da solicitação #${solicitacao.id}. Score IA: ${solicitacao.analysis?.score}%`,
    };

    setProcessos([novoProcesso, ...processos]);
    setSelectedProcessoId(novoProcesso.id);
    setCurrentView('processo-detail');
    
    toast.success(`Processo ${novoProcesso.numeroProcesso} criado com sucesso!`);
  };

  const handleAddProcessByNumber = (processData: any) => {
    // Criar novo processo a partir dos dados do tribunal
    const novoProcesso: Processo = {
      id: `pr${Date.now()}`,
      pescador: {
        id: `p${Date.now()}`,
        nome: processData.partes.autor || '',
        cpf: processData.partes.cpf || '',
        rg: '',
        dataNascimento: new Date(),
        endereco: '',
        colonia: '',
        telefone: '',
      },
      status: 'em_andamento',
      documents: [],
      numeroProcesso: processData.numeroProcesso,
      tribunal: processData.tribunal,
      orgaoJulgador: processData.orgaoJulgador,
      classeProcessual: processData.classeProcessual,
      assunto: processData.assunto,
      situacao: processData.situacao,
      dataAjuizamento: processData.dataAjuizamento,
      movimentacoes: processData.movimentacoes,
      ultimaMovimentacao: processData.ultimaMovimentacao,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'media',
      lawyerNotes: `Processo importado automaticamente em ${new Date().toLocaleDateString('pt-BR')}`,
    };

    setProcessos([novoProcesso, ...processos]);
    toast.success(`Processo ${novoProcesso.numeroProcesso} adicionado com sucesso!`);
  };

  const handleNewSolicitacao = async (pescador: Pescador, documents: UploadedDocument[]) => {
    setIsAnalyzing(true);
    toast.info('Iniciando análise de documentos...');

    try {
      // Simular upload de documentos
      const uploadedDocs: DocumentType[] = documents.map((doc, index) => ({
        id: `doc${Date.now()}${index}`,
        type: doc.type,
        name: doc.name,
        url: `/uploads/${doc.name}`,
        uploadedAt: new Date(),
        status: 'presente' as const,
      }));

      // Simular análise de IA (apenas se houver documentos)
      let analysis;
      if (uploadedDocs.length > 0) {
        analysis = await simulateAIAnalysis(uploadedDocs);
      }

      // Determinar status baseado na análise
      let status: Solicitacao['status'] = 'pendente';
      if (analysis) {
        if (analysis.score >= 70) {
          status = 'aprovada';
        } else if (analysis.missingDocuments.length > 0) {
          status = 'documentacao_incompleta';
        } else {
          status = 'em_analise';
        }
      }

      const newSolicitacao: Solicitacao = {
        id: `s${Date.now()}`,
        pescador,
        status,
        documents: uploadedDocs,
        analysis: analysis ? {
          ...analysis,
          caseId: `s${Date.now()}`,
        } : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'media',
      };

      setSolicitacoes([newSolicitacao, ...solicitacoes]);
      setCurrentView('solicitacoes');
      
      toast.success('Solicitação criada e análise concluída!');
    } catch (error) {
      toast.error('Erro ao criar solicitação. Tente novamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Se não estiver autenticado, mostrar tela de autenticação apropriada
  if (!user) {
    return (
      <>
        <Toaster />
        {authView === 'login' && (
          <Login 
            onLoginSuccess={handleLoginSuccess}
            onForgotPassword={() => setAuthView('forgot-password')}
          />
        )}
        {authView === 'forgot-password' && (
          <ForgotPassword 
            onBackToLogin={() => setAuthView('login')}
          />
        )}
        {authView === 'reset-password' && (
          <ResetPassword 
            onResetSuccess={() => setAuthView('login')}
          />
        )}
      </>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950 transition-colors duration-300`}>
      <Toaster />
      <WelcomeDialog open={showWelcome} onClose={() => setShowWelcome(false)} />
      
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-1 md:py-2">
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
                  <span className="text-white text-sm font-medium">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-sm font-medium max-w-[120px] truncate">{user.name}</span>
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
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </span>
                  </>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="h-8 w-8 md:h-10 md:w-10">
                {isDarkMode ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
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
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Button
                    variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setCurrentView('dashboard')}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant={currentView === 'solicitacoes' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setCurrentView('solicitacoes')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Solicitações
                  </Button>
                  <Button
                    variant={currentView === 'processos' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setCurrentView('processos')}
                  >
                    <Scale className="h-4 w-4 mr-2" />
                    Processos
                  </Button>
                  <Button
                    variant={currentView === 'new-solicitacao' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setCurrentView('new-solicitacao')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Solicitação
                  </Button>
                  <Button
                    variant={currentView === 'knowledge-base' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setCurrentView('knowledge-base')}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Base de Conhecimento
                  </Button>
                </nav>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="text-xs text-muted-foreground">Resumo Rápido</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Solicitações</span>
                      <Badge variant="secondary">{solicitacoes.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Processos</span>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                        {processos.length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Aprovadas</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        {solicitacoes.filter((s) => s.status === 'aprovada').length}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            {/* Dashboard View */}
            {currentView === 'dashboard' && (
              <div className="space-y-4 md:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate">Dashboard</h2>
                    <p className="text-sm text-muted-foreground">
                      Visão geral de Solicitações e Processos
                    </p>
                  </div>
                  <Button onClick={() => setCurrentView('new-solicitacao')} className="w-full sm:w-auto flex-shrink-0">
                    <Plus className="h-4 w-4 mr-2" />
                    <span>Nova Solicitação</span>
                  </Button>
                </div>

                <DashboardStatsNew solicitacoes={solicitacoes} processos={processos} />
              </div>
            )}

            {/* Solicitações View */}
            {currentView === 'solicitacoes' && (
              <div className="space-y-4 md:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate">Solicitações</h2>
                    <p className="text-sm text-muted-foreground">
                      Pré-análise de documentos para abertura de processos
                    </p>
                  </div>
                  <Button onClick={() => setCurrentView('new-solicitacao')} className="w-full sm:w-auto flex-shrink-0">
                    <Plus className="h-4 w-4 mr-2" />
                    <span>Nova Solicitação</span>
                  </Button>
                </div>

                <AllSolicitacoes solicitacoes={solicitacoes} onViewSolicitacao={handleViewSolicitacao} />
              </div>
            )}

            {/* Processos View */}
            {currentView === 'processos' && (
              <div className="space-y-4 md:space-y-6">
                <div className="min-w-0">
                  <h2 className="truncate">Processos Judiciais</h2>
                  <p className="text-sm text-muted-foreground">
                    Acompanhamento de processos em andamento
                  </p>
                </div>

                <AllProcessos 
                  processos={processos} 
                  onViewProcesso={handleViewProcesso}
                  onAddProcessByNumber={handleAddProcessByNumber}
                />
              </div>
            )}

            {/* New Solicitação View */}
            {currentView === 'new-solicitacao' && (
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start gap-2 md:gap-3">
                  <Button variant="ghost" size="icon" onClick={() => setCurrentView('dashboard')} className="flex-shrink-0 mt-1">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <div className="min-w-0">
                    <h2 className="truncate">Nova Solicitação</h2>
                    <p className="text-sm text-muted-foreground">
                      Cadastre um novo pescador e faça upload dos documentos para análise
                    </p>
                  </div>
                </div>

                <NewCaseForm onSubmit={handleNewSolicitacao} isAnalyzing={isAnalyzing} />
              </div>
            )}

            {/* Solicitação Detail View */}
            {currentView === 'solicitacao-detail' && selectedSolicitacaoId && (
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start gap-2 md:gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setCurrentView('solicitacoes')} 
                    className="flex-shrink-0 mt-1"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <div className="min-w-0">
                    <h2 className="truncate">Detalhes da Solicitação</h2>
                    <p className="text-sm text-muted-foreground">
                      Análise completa e documentação
                    </p>
                  </div>
                </div>

                <SolicitacaoDetail 
                  solicitacao={solicitacoes.find(s => s.id === selectedSolicitacaoId)!}
                  onApprove={handleApproveSolicitacao}
                  onGenerateReport={() => {
                    const sol = solicitacoes.find(s => s.id === selectedSolicitacaoId);
                    if (sol) {
                      downloadSolicitacaoReport(sol);
                      toast.success('Relatório gerado com sucesso!');
                    }
                  }}
                  onRequestDocuments={() => {
                    const sol = solicitacoes.find(s => s.id === selectedSolicitacaoId);
                    if (sol && sol.analysis) {
                      // Converter Solicitacao para Case temporariamente para usar a função existente
                      const tempCase: any = {
                        ...sol,
                        status: 'documentacao_incompleta' as any
                      };
                      downloadDocumentRequest(tempCase);
                      toast.success('Carta de solicitação gerada com sucesso!');
                    }
                  }}
                />
              </div>
            )}

            {/* Processo Detail View */}
            {currentView === 'processo-detail' && selectedProcessoId && (
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start gap-2 md:gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setCurrentView('processos')} 
                    className="flex-shrink-0 mt-1"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <div className="min-w-0">
                    <h2 className="truncate">Detalhes do Processo</h2>
                    <p className="text-sm text-muted-foreground">
                      Acompanhamento processual completo
                    </p>
                  </div>
                </div>

                <ProcessoDetail 
                  processo={processos.find(p => p.id === selectedProcessoId)!}
                  onGenerateReport={() => {
                    const proc = processos.find(p => p.id === selectedProcessoId);
                    if (proc) {
                      downloadProcessoReport(proc);
                      toast.success('Relatório do processo gerado com sucesso!');
                    }
                  }}
                />
              </div>
            )}

            {/* Knowledge Base View */}
            {currentView === 'knowledge-base' && (
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h2 className="truncate">Base de Conhecimento</h2>
                  <p className="text-sm text-muted-foreground">
                    Informações sobre o Seguro-Defeso, legislação e procedimentos
                  </p>
                </div>

                <KnowledgeBase articles={mockKnowledgeBase} defesoPeriods={mockDefesoPeriods} />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Notifications Sheet */}
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

      {/* Footer */}
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
