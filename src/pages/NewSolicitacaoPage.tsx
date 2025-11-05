import { type ComponentProps } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { NewCaseForm } from '../components/new-case-form';
import { Button } from '../components/ui/button';
import { useAppState } from '../contexts/AppStateContext';

export function NewSolicitacaoPage() {
  const navigate = useNavigate();
  const { handleNewSolicitacao, isAnalyzing } = useAppState();

  const handleSubmit: ComponentProps<typeof NewCaseForm>['onSubmit'] = async (pescador, docs) => {
    try {
      await handleNewSolicitacao(pescador, docs);
      navigate({ to: '/solicitacoes' });
    } catch {
      // Erro já tratado pelo AppStateContext com toast
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-start gap-2 md:gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/solicitacoes' })}
          className="flex-shrink-0 mt-1"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="min-w-0">
          <h2 className="truncate">Nova Solicitação</h2>
          <p className="text-sm text-muted-foreground">
            Cadastre um novo pescador e faça upload dos documentos para análise
          </p>
        </div>
      </div>

      <NewCaseForm onSubmit={handleSubmit} isAnalyzing={isAnalyzing} />
    </div>
  );
}
