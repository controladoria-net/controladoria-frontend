import { Plus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { DashboardStatsNew } from '../components/dashboard-stats-new';
import { Button } from '../components/ui/button';
import { useAppState } from '../contexts/AppStateContext';

export function DashboardPage() {
  const navigate = useNavigate();
  const { solicitacoes, processos } = useAppState();

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Visão geral de Solicitações e Processos
          </p>
        </div>
        <Button
          onClick={() => navigate({ to: '/solicitacoes/nova' })}
          className="w-full sm:w-auto flex-shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span>Nova Solicitação</span>
        </Button>
      </div>

      <DashboardStatsNew solicitacoes={solicitacoes} processos={processos} />
    </div>
  );
}
