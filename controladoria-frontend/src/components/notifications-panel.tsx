import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Bell, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { formatDate } from '../lib/utils';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  title: string;
  message: string;
  date: Date;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'urgent',
    title: 'Documentos Vencidos',
    message: 'RGP de Roberto Alves Ferreira venceu em 12/08/2024',
    date: new Date('2024-10-15'),
    read: false,
  },
  {
    id: 'n2',
    type: 'warning',
    title: 'Documentação Incompleta',
    message: 'Maria Oliveira Costa - faltam 2 documentos',
    date: new Date('2024-10-18'),
    read: false,
  },
  {
    id: 'n3',
    type: 'success',
    title: 'Análise Concluída',
    message: 'Caso de João da Silva Santos - Score 92%',
    date: new Date('2024-10-15'),
    read: true,
  },
  {
    id: 'n4',
    type: 'info',
    title: 'Período de Defeso Próximo',
    message: 'Defeso do Camarão inicia em 01/03/2025',
    date: new Date('2024-10-10'),
    read: true,
  },
];

export function NotificationsPanel() {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'warning':
        return <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />;
      default:
        return <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800';
      case 'success':
        return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
      default:
        return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Notificações</CardTitle>
          <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            {mockNotifications.filter((n) => !n.read).length} novas
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockNotifications.map((notification) => (
            <Card key={notification.id} className={getNotificationBg(notification.type)}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm">{notification.title}</p>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(notification.date)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
