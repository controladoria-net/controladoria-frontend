import { Plus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { AllSolicitacoes } from '../components/all-solicitacoes';
import { Button } from '../components/ui/button';
import { useAppState } from '../contexts/AppStateContext';

export function SolicitacoesPage() {
  const navigate = useNavigate();
  const { solicitacoes } = useAppState();

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate">Solicitações</h2>
          <p className="text-sm text-muted-foreground">
            Pré-análise de documentos para abertura de processos
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

      <AllSolicitacoes
        solicitacoes={solicitacoes}
        onViewSolicitacao={(id) =>
          navigate({ to: '/solicitacoes/$solicitacaoId', params: { solicitacaoId: id } })
        }
      />
    </div>
  );
}
