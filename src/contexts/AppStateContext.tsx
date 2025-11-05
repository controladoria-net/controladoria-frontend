import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { toast } from 'sonner';
import {
  mockSolicitacoes,
  mockProcessos,
  mockDefesoPeriods,
  mockKnowledgeBase,
  simulateAIAnalysis,
  mockNotifications,
} from '../lib/mock-data';
import {
  Solicitacao,
  Processo,
  Pescador,
  Document as DocumentType,
  Notification,
} from '../lib/types';
import { ApiService, api } from '../services/api';
import type { UploadedDocument } from '../components/document-upload';

export interface User {
  email: string;
  name: string;
}

interface AppStateContextValue {
  user: User | null;
  handleLoginSuccess: (userData: User) => void;
  handleLogout: () => Promise<void>;
  solicitacoes: Solicitacao[];
  setSolicitacoes: (updater: Solicitacao[] | ((prev: Solicitacao[]) => Solicitacao[])) => void;
  processos: Processo[];
  setProcessos: (updater: Processo[] | ((prev: Processo[]) => Processo[])) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (value: boolean) => void;
  showWelcome: boolean;
  setShowWelcome: (value: boolean) => void;
  notifications: Notification[];
  setNotifications: (
    updater: Notification[] | ((prev: Notification[]) => Notification[]),
  ) => void;
  showNotifications: boolean;
  setShowNotifications: (value: boolean) => void;
  unreadNotificationsCount: number;
  handleNotificationClick: (notification: Notification) => void;
  handleApproveSolicitacao: (solicitacaoId: string) => void;
  handleConvertToProcesso: (solicitacao: Solicitacao) => void;
  handleAddProcessByNumber: (processData: any) => void;
  handleNewSolicitacao: (pescador: Pescador, documents: UploadedDocument[]) => Promise<void>;
  mockDefesoPeriods: typeof mockDefesoPeriods;
  mockKnowledgeBase: typeof mockKnowledgeBase;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'seguroDefeso_user';

function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const serialized = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized) as User;
  } catch {
    return null;
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [solicitacoes, setSolicitacoesState] = useState<Solicitacao[]>(mockSolicitacoes);
  const [processos, setProcessosState] = useState<Processo[]>(mockProcessos);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [notifications, setNotificationsState] = useState<Notification[]>(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    ApiService.setOnUnauthorized(() => {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      }
      toast.error('Sua sessão expirou. Faça login novamente.');
    });

    (async () => {
      try {
        const userResp = await api.get('/session/user');
        const apiUser = (userResp?.data as any)?.data;
        if (!apiUser) return;

        const nameParts = [apiUser.first_name, apiUser.last_name].filter(Boolean);
        const friendlyName =
          nameParts.length > 0 ? nameParts.join(' ') : apiUser.username || apiUser.email;
        const userForApp: User = {
          email: apiUser.email,
          name: friendlyName,
        };

        setUser(userForApp);
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userForApp));
        }
      } catch {
        // Usuário não autenticado
      }
    })();
  }, []);

  const handleLoginSuccess = useCallback((userData: User) => {
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userData));
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await api.post('/session/logout');
    } catch {
      // Ignorar falha e limpar estado local mesmo assim
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
    toast.success('Logout realizado com sucesso');
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', next);
      }
      return next;
    });
  }, []);

  const handleNotificationClick = useCallback((notification: Notification) => {
    setShowNotifications(false);
    setNotificationsState((prev) =>
      prev.map((item) =>
        item.id === notification.id ? { ...item, isRead: true } : item,
      ),
    );
  }, []);

  const handleApproveSolicitacao = useCallback(
    (solicitacaoId: string) => {
      setSolicitacoesState((prev) =>
        prev.map((sol) =>
          sol.id === solicitacaoId
            ? { ...sol, status: 'aprovada', updatedAt: new Date() }
            : sol,
        ),
      );
      toast.success('Solicitação aprovada com sucesso! Agora você pode abrir o processo.');
    },
    [],
  );

  const handleConvertToProcesso = useCallback(
    (solicitacao: Solicitacao) => {
      const novoProcesso: Processo = {
        id: `pr${Date.now()}`,
        pescador: solicitacao.pescador,
        status: 'em_andamento',
        documents: solicitacao.documents,
        numeroProcesso: `${Math.floor(Math.random() * 9000000) + 1000000}-${
          Math.floor(Math.random() * 90) + 10
        }.2024.8.26.${Math.floor(Math.random() * 900) + 100}`,
        tribunal: 'TJSP',
        orgaoJulgador: 'Vara Cível',
        classeProcessual: 'Procedimento Comum Cível',
        assunto: 'Seguro-Defeso',
        situacao: 'Distribuído',
        dataAjuizamento: new Date(),
        movimentacoes: solicitacao.analysis?.movements ?? 1,
        ultimaMovimentacao: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: solicitacao.priority,
        solicitacaoId: solicitacao.id,
        lawyerNotes: `Processo originado da solicitação #${solicitacao.id}. Score IA: ${solicitacao.analysis?.score}%`,
      };

      setProcessosState((prev) => [novoProcesso, ...prev]);
      toast.success(`Processo ${novoProcesso.numeroProcesso} criado com sucesso!`);
    },
    [],
  );

  const handleAddProcessByNumber = useCallback((processData: any) => {
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

    setProcessosState((prev) => [novoProcesso, ...prev]);
    toast.success(`Processo ${novoProcesso.numeroProcesso} adicionado com sucesso!`);
  }, []);

  const handleNewSolicitacao = useCallback(
    async (pescador: Pescador, documents: UploadedDocument[]) => {
      setIsAnalyzing(true);
      toast.info('Iniciando análise de documentos...');

      try {
        const uploadedDocs: DocumentType[] = documents.map((doc, index) => ({
          id: `doc${Date.now()}${index}`,
          type: doc.type,
          name: doc.name,
          url: `/uploads/${doc.name}`,
          uploadedAt: new Date(),
          status: 'presente',
        }));

        let analysis;
        if (uploadedDocs.length > 0) {
          analysis = await simulateAIAnalysis(uploadedDocs);
        }

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
          analysis: analysis
            ? {
                ...analysis,
                caseId: `s${Date.now()}`,
              }
            : undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
          priority: 'media',
        };

        setSolicitacoesState((prev) => [newSolicitacao, ...prev]);
        toast.success('Solicitação criada e análise concluída!');
      } catch (error) {
        toast.error('Erro ao criar solicitação. Tente novamente.');
        throw error;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [],
  );

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );

  const contextValue = useMemo<AppStateContextValue>(
    () => ({
      user,
      handleLoginSuccess,
      handleLogout,
      solicitacoes,
      setSolicitacoes: (value) =>
        setSolicitacoesState((prev) =>
          typeof value === 'function' ? (value as (prev: Solicitacao[]) => Solicitacao[])(prev) : value,
        ),
      processos,
      setProcessos: (value) =>
        setProcessosState((prev) =>
          typeof value === 'function' ? (value as (prev: Processo[]) => Processo[])(prev) : value,
        ),
      isDarkMode,
      toggleDarkMode,
      isAnalyzing,
      setIsAnalyzing,
      showWelcome,
      setShowWelcome,
      notifications,
      setNotifications: (value) =>
        setNotificationsState((prev) =>
          typeof value === 'function' ? (value as (prev: Notification[]) => Notification[])(prev) : value,
        ),
      showNotifications,
      setShowNotifications,
      unreadNotificationsCount,
      handleNotificationClick,
      handleApproveSolicitacao,
      handleConvertToProcesso,
      handleAddProcessByNumber,
      handleNewSolicitacao,
      mockDefesoPeriods,
      mockKnowledgeBase,
    }),
    [
      user,
      handleLoginSuccess,
      handleLogout,
      solicitacoes,
      processos,
      isDarkMode,
      toggleDarkMode,
      isAnalyzing,
      showWelcome,
      notifications,
      showNotifications,
      unreadNotificationsCount,
      handleNotificationClick,
      handleApproveSolicitacao,
      handleConvertToProcesso,
      handleAddProcessByNumber,
      handleNewSolicitacao,
    ],
  );

  return (
    <AppStateContext.Provider value={contextValue}>{children}</AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState deve ser utilizado dentro de AppStateProvider');
  }
  return context;
}
