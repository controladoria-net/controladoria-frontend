import { useState } from 'react';
import { Notification, NotificationType } from '../lib/types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  FileText,
  AlertCircle,
  Clock,
  Info,
  AlertTriangle,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Scale,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotificationsPageProps {
  notifications: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onClose?: () => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'analysis_complete':
      return <Sparkles className="h-5 w-5 text-cyan-600" />;
    case 'case_created':
      return <FileText className="h-5 w-5 text-blue-600" />;
    case 'status_change':
      return <CheckCheck className="h-5 w-5 text-green-600" />;
    case 'document_missing':
      return <AlertCircle className="h-5 w-5 text-orange-600" />;
    case 'deadline_approaching':
      return <Clock className="h-5 w-5 text-yellow-600" />;
    case 'alert':
      return <AlertTriangle className="h-5 w-5 text-red-600" />;
    case 'system':
      return <Info className="h-5 w-5 text-gray-600" />;
    default:
      return <Bell className="h-5 w-5 text-gray-600" />;
  }
};

const getNotificationColor = (type: NotificationType, priority: string) => {
  if (priority === 'high') {
    return 'border-l-red-500';
  }
  if (priority === 'medium') {
    return 'border-l-yellow-500';
  }
  return 'border-l-blue-500';
};

type CategoryFilter = 'all' | 'solicitacoes' | 'processos';

export function NotificationsPage({ 
  notifications, 
  onNotificationClick,
  onClose 
}: NotificationsPageProps) {
  const [notificationsList, setNotificationsList] = useState<Notification[]>(notifications);
  const [readFilter, setReadFilter] = useState<'all' | 'read'>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const unreadCount = notificationsList.filter(n => !n.isRead).length;

  // Função para determinar se é notificação de solicitação ou processo
  const getNotificationCategory = (notification: Notification): 'solicitacao' | 'processo' | 'other' => {
    // Verifica pelo tipo de notificação
    if (notification.type === 'analysis_complete' || 
        notification.type === 'document_missing' ||
        notification.type === 'case_created') {
      return 'solicitacao';
    }
    
    if (notification.type === 'deadline_approaching' || 
        notification.type === 'status_change') {
      return 'processo';
    }

    // Verifica pela mensagem/título
    const text = `${notification.title} ${notification.message}`.toLowerCase();
    if (text.includes('processo') || text.includes('tribunal') || text.includes('sentença')) {
      return 'processo';
    }
    if (text.includes('solicitação') || text.includes('análise') || text.includes('documento')) {
      return 'solicitacao';
    }

    return 'other';
  };

  const filteredNotifications = notificationsList.filter(notification => {
    // Filtro de leitura
    const matchesReadStatus = 
      readFilter === 'all' || 
      (readFilter === 'read' && notification.isRead);

    // Filtro de categoria
    let matchesCategory = true;
    if (categoryFilter !== 'all') {
      const category = getNotificationCategory(notification);
      if (categoryFilter === 'solicitacoes') {
        matchesCategory = category === 'solicitacao';
      } else if (categoryFilter === 'processos') {
        matchesCategory = category === 'processo';
      }
    }

    return matchesReadStatus && matchesCategory;
  });

  // Paginação
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

  // Reset página ao mudar filtros
  const handleReadFilterChange = (newFilter: 'all' | 'read') => {
    setReadFilter(newFilter);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (newCategory: CategoryFilter) => {
    setCategoryFilter(newCategory);
    setCurrentPage(1);
  };

  const handleMarkAsRead = (id: string) => {
    setNotificationsList(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    toast.success('Notificação marcada como lida');
  };

  const handleMarkAllAsRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('Todas as notificações foram marcadas como lidas');
  };

  const handleDelete = (id: string) => {
    setNotificationsList(prev => prev.filter(n => n.id !== id));
    toast.success('Notificação removida');
  };

  const handleClearAll = () => {
    const readNotifications = notificationsList.filter(n => n.isRead);
    setNotificationsList(prev => prev.filter(n => !n.isRead));
    toast.success(`${readNotifications.length} notificação(ões) removida(s)`);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    if (onNotificationClick && notification.caseId) {
      onNotificationClick(notification);
    }
  };

  // Contadores por categoria
  const solicitacoesCount = notificationsList.filter(n => getNotificationCategory(n) === 'solicitacao').length;
  const processosCount = notificationsList.filter(n => getNotificationCategory(n) === 'processo').length;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl">Notificações</h2>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}` : 'Nenhuma notificação não lida'}
            </p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Marcar todas como lidas
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            disabled={notificationsList.filter(n => n.isRead).length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar lidas
          </Button>
        </div>
      </div>

      {/* Filtros Simplificados */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 space-y-3">
        {/* Filtro de Leitura */}
        <Tabs value={readFilter} onValueChange={(v) => handleReadFilterChange(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">
              Todas ({notificationsList.length})
            </TabsTrigger>
            <TabsTrigger value="read">
              Lidas ({notificationsList.length - unreadCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filtro de Categoria */}
        <div className="flex gap-2">
          <Button
            variant={categoryFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryFilterChange('all')}
            className="flex-1"
          >
            Todas
          </Button>
          <Button
            variant={categoryFilter === 'solicitacoes' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryFilterChange('solicitacoes')}
            className="flex-1"
          >
            <FileText className="h-4 w-4 mr-1" />
            Solicitações ({solicitacoesCount})
          </Button>
          <Button
            variant={categoryFilter === 'processos' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryFilterChange('processos')}
            className="flex-1"
          >
            <Scale className="h-4 w-4 mr-1" />
            Processos ({processosCount})
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {paginatedNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg mb-2">Nenhuma notificação</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {readFilter === 'read' 
                ? 'Você não tem notificações lidas no momento' 
                : categoryFilter === 'solicitacoes'
                ? 'Nenhuma notificação de solicitações'
                : categoryFilter === 'processos'
                ? 'Nenhuma notificação de processos'
                : 'Não há notificações para exibir'}
            </p>
          </div>
        ) : (
          paginatedNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 transition-all border-l-4 ${getNotificationColor(notification.type, notification.priority)} ${
                !notification.isRead
                  ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
              } ${notification.caseId ? 'cursor-pointer' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`${!notification.isRead ? 'font-semibold' : 'font-medium'}`}>
                      {notification.title}
                    </h4>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">
                    {notification.message}
                  </p>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(notification.createdAt, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                      {notification.caseId && (
                        <Badge variant="outline" className="text-xs">
                          Caso #{notification.caseId}
                        </Badge>
                      )}
                      <Badge
                        variant={
                          notification.priority === 'high'
                            ? 'destructive'
                            : notification.priority === 'medium'
                            ? 'default'
                            : 'secondary'
                        }
                        className="text-xs"
                      >
                        {notification.priority === 'high'
                          ? 'Alta'
                          : notification.priority === 'medium'
                          ? 'Média'
                          : 'Baixa'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                          className="h-8 px-2"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Exibindo {startIndex + 1}-{Math.min(endIndex, filteredNotifications.length)} de {filteredNotifications.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0 hidden sm:inline-flex"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Próxima
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
