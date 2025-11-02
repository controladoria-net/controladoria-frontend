import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Eye, Scale, CheckCircle2, XCircle, Clock, Archive, FileText, Building2, FileStack, Activity } from 'lucide-react';
import { Processo } from '../lib/types';

interface ProcessosTableProps {
  processos: Processo[];
  onViewProcesso: (id: string) => void;
}

export function ProcessosTable({ processos, onViewProcesso }: ProcessosTableProps) {
  const getStatusBadge = (status: Processo['status']) => {
    const statusConfig = {
      em_andamento: { label: 'Em Andamento', icon: Clock, className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      aguardando_documentos: { label: 'Aguardando Docs', icon: FileText, className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
      deferido: { label: 'Deferido', icon: CheckCircle2, className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      indeferido: { label: 'Indeferido', icon: XCircle, className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
      arquivado: { label: 'Arquivado', icon: Archive, className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
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

  const getPriorityBadge = (priority: Processo['priority']) => {
    const config = {
      baixa: { label: 'Baixa', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
      media: { label: 'Média', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
      alta: { label: 'Alta', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' },
    };

    return <Badge variant="outline" className={config[priority].className}>{config[priority].label}</Badge>;
  };

  if (processos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Scale className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>Nenhum processo encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/50 hidden md:table-header-group">
          <tr className="border-b">
            <th className="text-left p-3 whitespace-nowrap">Nº Processo</th>
            <th className="text-left p-3">Pescador</th>
            <th className="text-left p-3">Tribunal</th>
            <th className="text-left p-3 whitespace-nowrap">Órgão Julgador</th>
            <th className="text-left p-3 whitespace-nowrap">Classe Processual</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Situação</th>
            <th className="text-left p-3">Prioridade</th>
            <th className="text-left p-3 whitespace-nowrap">Ajuizamento</th>
            <th className="text-left p-3 whitespace-nowrap">Última Mov.</th>
            <th className="text-left p-3">Movs.</th>
            <th className="text-left p-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {processos.map((processo) => (
            <tr 
              key={processo.id} 
              className="border-b hover:bg-muted/30 transition-colors flex flex-col md:table-row mb-4 md:mb-0 bg-card md:bg-transparent rounded-lg md:rounded-none overflow-hidden"
            >
              {/* Número do Processo */}
              <td className="p-3 md:p-3">
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-muted-foreground min-w-[140px]">Nº Processo:</span>
                  <span className="font-mono text-xs">{processo.numeroProcesso}</span>
                </div>
              </td>

              {/* Pescador */}
              <td className="p-3 md:p-3">
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-muted-foreground min-w-[140px]">Pescador:</span>
                  <div className="min-w-0">
                    <div className="truncate max-w-[200px] font-medium">{processo.pescador.nome}</div>
                    <div className="text-xs text-muted-foreground font-mono">{processo.pescador.cpf}</div>
                  </div>
                </div>
              </td>

              {/* Tribunal */}
              <td className="p-3 md:p-3">
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-muted-foreground min-w-[140px]">Tribunal:</span>
                  <div className="flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{processo.tribunal}</span>
                  </div>
                </div>
              </td>

              {/* Órgão Julgador */}
              <td className="p-3 md:p-3">
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-muted-foreground min-w-[140px]">Órgão Julgador:</span>
                  <span className="text-sm">{processo.orgaoJulgador || '-'}</span>
                </div>
              </td>

              {/* Classe Processual */}
              <td className="p-3 md:p-3">
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-muted-foreground min-w-[140px]">Classe:</span>
                  <div className="flex items-center gap-1">
                    <FileStack className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{processo.classeProcessual || '-'}</span>
                  </div>
                </div>
              </td>

              {/* Status */}
              <td className="p-3 md:p-3">
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-muted-foreground min-w-[140px]">Status:</span>
                  {getStatusBadge(processo.status)}
                </div>
              </td>

              {/* Situação */}
              <td className="p-3 md:p-3">
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-muted-foreground min-w-[140px]">Situação:</span>
                  <span className="text-sm italic">{processo.situacao || '-'}</span>
                </div>
              </td>

              {/* Prioridade */}
              <td className="p-3 md:p-3">
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-muted-foreground min-w-[140px]">Prioridade:</span>
                  {getPriorityBadge(processo.priority)}
                </div>
              </td>

              {/* Data de Ajuizamento */}
              <td className="p-3 md:p-3">
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-muted-foreground min-w-[140px]">Ajuizamento:</span>
                  <span className="text-sm whitespace-nowrap">
                    {new Date(processo.dataAjuizamento).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </td>

              {/* Última Movimentação */}
              <td className="p-3 md:p-3">
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-muted-foreground min-w-[140px]">Última Mov.:</span>
                  <span className="text-sm whitespace-nowrap">
                    {processo.ultimaMovimentacao 
                      ? new Date(processo.ultimaMovimentacao).toLocaleDateString('pt-BR')
                      : '-'
                    }
                  </span>
                </div>
              </td>

              {/* Número de Movimentações */}
              <td className="p-3 md:p-3">
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-muted-foreground min-w-[140px]">Movimentações:</span>
                  <div className="flex items-center gap-1">
                    <Activity className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-medium">{processo.movimentacoes || 0}</span>
                  </div>
                </div>
              </td>

              {/* Ações */}
              <td className="p-3 md:p-3">
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-muted-foreground min-w-[140px]">Ações:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewProcesso(processo.id)}
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
