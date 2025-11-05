import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { SolicitacaoDetail } from '../components/solicitacao-detail';
import { Button } from '../components/ui/button';
import { useAppState } from '../contexts/AppStateContext';
import { downloadSolicitacaoReport, downloadDocumentRequest } from '../components/report-generator';
import { toast } from 'sonner';

export function SolicitacaoDetailPage() {
  const navigate = useNavigate();
  const params = useParams({ from: '/solicitacoes/$solicitacaoId' });
  const { solicitacoes, handleApproveSolicitacao } = useAppState();

  const solicitacao = solicitacoes.find((item) => item.id === params.solicitacaoId);

  if (!solicitacao) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/solicitacoes' })}
          className="flex-shrink-0"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <p className="text-sm text-muted-foreground">Solicitação não encontrada.</p>
      </div>
    );
  }

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
          <h2 className="truncate">Detalhes da Solicitação</h2>
          <p className="text-sm text-muted-foreground">Análise completa e documentação</p>
        </div>
      </div>

      <SolicitacaoDetail
        solicitacao={solicitacao}
        onApprove={(id) => handleApproveSolicitacao(id)}
        onGenerateReport={() => {
          downloadSolicitacaoReport(solicitacao);
          toast.success('Relatório gerado com sucesso!');
        }}
        onRequestDocuments={() => {
          if (!solicitacao.analysis) return;
          const tempCase: any = {
            ...solicitacao,
            status: 'documentacao_incompleta',
          };
          downloadDocumentRequest(tempCase);
          toast.success('Carta de solicitação gerada com sucesso!');
        }}
      />
    </div>
  );
}
