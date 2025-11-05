import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { toast } from 'sonner';
import { ProcessoDetail } from '../components/processo-detail';
import { Button } from '../components/ui/button';
import { useAppState } from '../contexts/AppStateContext';
import { downloadProcessoReport } from '../components/report-generator';

export function ProcessoDetailPage() {
  const navigate = useNavigate();
  const params = useParams({ from: '/processos/$processoId' });
  const { processos } = useAppState();

  const processo = processos.find((item) => item.id === params.processoId);

  if (!processo) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/processos' })}
          className="flex-shrink-0"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <p className="text-sm text-muted-foreground">Processo não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-start gap-2 md:gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/processos' })}
          className="flex-shrink-0 mt-1"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="min-w-0">
          <h2 className="truncate">Detalhes do Processo</h2>
          <p className="text-sm text-muted-foreground">Acompanhamento processual completo</p>
        </div>
      </div>

      <ProcessoDetail
        processo={processo}
        onGenerateReport={() => {
          downloadProcessoReport(processo);
          toast.success('Relatório do processo gerado com sucesso!');
        }}
      />
    </div>
  );
}
