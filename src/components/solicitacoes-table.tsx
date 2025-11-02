import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Eye, AlertCircle, CheckCircle2, Clock, XCircle, FileX } from 'lucide-react';
import { Solicitacao } from '../lib/types';

interface SolicitacoesTableProps {
  solicitacoes: Solicitacao[];
  onViewSolicitacao: (id: string) => void;
}

export function SolicitacoesTable({ solicitacoes, onViewSolicitacao }: SolicitacoesTableProps) {
  const getStatusBadge = (status: Solicitacao['status']) => {
    const statusConfig = {
      pendente: { label: 'Pendente', icon: Clock, className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
      em_analise: { label: 'Em Análise', icon: AlertCircle, className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      aprovada: { label: 'Aprovada', icon: CheckCircle2, className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      reprovada: { label: 'Reprovada', icon: XCircle, className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
      documentacao_incompleta: { label: 'Documentação Incompleta', icon: FileX, className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.className} flex items-center gap-1 w-fit`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Solicitacao['priority']) => {
    const config = {
      baixa: { label: 'Baixa', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
      media: { label: 'Média', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
      alta: { label: 'Alta', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' },
    };

    return <Badge variant="outline" className={config[priority].className}>{config[priority].label}</Badge>;
  };

  if (solicitacoes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileX className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>Nenhuma solicitação encontrada</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/50 hidden md:table-header-group">
          <tr className="border-b">
            <th className="text-left p-3">Pescador</th>
            <th className="text-left p-3">CPF</th>
            <th className="text-left p-3">Colônia</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Prioridade</th>
            <th className="text-left p-3">Score IA</th>
            <th className="text-left p-3">Data</th>
            <th className="text-left p-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {solicitacoes.map((solicitacao) => (
            <tr 
              key={solicitacao.id} 
              className="border-b hover:bg-muted/30 transition-colors flex flex-col md:table-row mb-4 md:mb-0 bg-card md:bg-transparent rounded-lg md:rounded-none overflow-hidden"
            >
              <td className="p-3 md:p-3">
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-muted-foreground min-w-[100px]">Pescador:</span>
                  <span className="truncate max-w-[200px]">{solicitacao.pescador.nome}</span>
                </div>
              </td>
              <td className="p-3 md:p-3">
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-muted-foreground min-w-[100px]">CPF:</span>
                  <span className="font-mono text-sm">{solicitacao.pescador.cpf}</span>
                </div>
              </td>
              <td className="p-3 md:p-3">
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-muted-foreground min-w-[100px]">Colônia:</span>
                  <span className="text-sm">{solicitacao.pescador.colonia}</span>
                </div>
              </td>
              <td className="p-3 md:p-3">
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-muted-foreground min-w-[100px]">Status:</span>
                  {getStatusBadge(solicitacao.status)}
                </div>
              </td>
              <td className="p-3 md:p-3">
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-muted-foreground min-w-[100px]">Prioridade:</span>
                  {getPriorityBadge(solicitacao.priority)}
                </div>
              </td>
              <td className="p-3 md:p-3">
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-muted-foreground min-w-[100px]">Score IA:</span>
                  {solicitacao.analysis ? (
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            solicitacao.analysis.score >= 70 
                              ? 'bg-green-500' 
                              : solicitacao.analysis.score >= 40 
                              ? 'bg-yellow-500' 
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${solicitacao.analysis.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{solicitacao.analysis.score}%</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </div>
              </td>
              <td className="p-3 md:p-3">
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-muted-foreground min-w-[100px]">Data:</span>
                  <span className="text-sm">{new Date(solicitacao.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </td>
              <td className="p-3 md:p-3">
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-muted-foreground min-w-[100px]">Ações:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewSolicitacao(solicitacao.id)}
                    className="w-full md:w-auto"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
