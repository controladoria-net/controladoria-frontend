import { Solicitacao, Processo } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FileText, Scale, Clock, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';

interface DashboardStatsNewProps {
  solicitacoes: Solicitacao[];
  processos: Processo[];
}

export function DashboardStatsNew({ solicitacoes, processos }: DashboardStatsNewProps) {
  // Estatísticas de Solicitações
  const solicitacoesStats = {
    total: solicitacoes.length,
    pendentes: solicitacoes.filter((s) => s.status === 'pendente').length,
    emAnalise: solicitacoes.filter((s) => s.status === 'em_analise').length,
    aprovadas: solicitacoes.filter((s) => s.status === 'aprovada').length,
    reprovadas: solicitacoes.filter((s) => s.status === 'reprovada').length,
    incompletas: solicitacoes.filter((s) => s.status === 'documentacao_incompleta').length,
  };

  // Estatísticas de Processos
  const processosStats = {
    total: processos.length,
    emAndamento: processos.filter((p) => p.status === 'em_andamento').length,
    aguardandoDocs: processos.filter((p) => p.status === 'aguardando_documentos').length,
    deferidos: processos.filter((p) => p.status === 'deferido').length,
    indeferidos: processos.filter((p) => p.status === 'indeferido').length,
  };

  // Taxa de aprovação de solicitações
  const totalAnalisadas = solicitacoesStats.aprovadas + solicitacoesStats.reprovadas;
  const taxaAprovacaoSolicitacoes = totalAnalisadas > 0 
    ? Math.round((solicitacoesStats.aprovadas / totalAnalisadas) * 100) 
    : 0;

  // Taxa de sucesso de processos
  const processosFinalizados = processosStats.deferidos + processosStats.indeferidos;
  const taxaSucessoProcessos = processosFinalizados > 0
    ? Math.round((processosStats.deferidos / processosFinalizados) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Visão Geral */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 md:px-6 pt-4 md:pt-6">
            <CardTitle className="text-xs md:text-sm">Solicitações</CardTitle>
            <FileText className="h-3 w-3 md:h-4 md:w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          </CardHeader>
          <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
            <div className="text-xl md:text-2xl">{solicitacoesStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {solicitacoesStats.emAnalise} em análise
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 md:px-6 pt-4 md:pt-6">
            <CardTitle className="text-xs md:text-sm">Processos</CardTitle>
            <Scale className="h-3 w-3 md:h-4 md:w-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
          </CardHeader>
          <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
            <div className="text-xl md:text-2xl">{processosStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {processosStats.emAndamento} em andamento
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 md:px-6 pt-4 md:pt-6">
            <CardTitle className="text-xs md:text-sm">Taxa Aprovação</CardTitle>
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
          </CardHeader>
          <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
            <div className="text-xl md:text-2xl">{taxaAprovacaoSolicitacoes}%</div>
            <p className="text-xs text-muted-foreground">
              {solicitacoesStats.aprovadas} aprovadas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 border-yellow-200 dark:border-yellow-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 md:px-6 pt-4 md:pt-6">
            <CardTitle className="text-xs md:text-sm">Ação Necessária</CardTitle>
            <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
          </CardHeader>
          <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
            <div className="text-xl md:text-2xl">
              {solicitacoesStats.incompletas + processosStats.aguardandoDocs}
            </div>
            <p className="text-xs text-muted-foreground">
              Docs pendentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detalhamento por Seção */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Detalhes Solicitações */}
        <Card>
          <CardHeader className="px-4 md:px-6 py-4">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Detalhamento de Solicitações
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6 pb-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Pendentes
                </span>
                <span className="font-medium">{solicitacoesStats.pendentes}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  Em Análise
                </span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {solicitacoesStats.emAnalise}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3" />
                  Aprovadas
                </span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {solicitacoesStats.aprovadas}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3" />
                  Docs Incompletos
                </span>
                <span className="font-medium text-yellow-600 dark:text-yellow-400">
                  {solicitacoesStats.incompletas}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalhes Processos */}
        <Card>
          <CardHeader className="px-4 md:px-6 py-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Scale className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              Detalhamento de Processos
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6 pb-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Em Andamento
                </span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {processosStats.emAndamento}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3" />
                  Aguardando Docs
                </span>
                <span className="font-medium text-yellow-600 dark:text-yellow-400">
                  {processosStats.aguardandoDocs}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3" />
                  Deferidos
                </span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {processosStats.deferidos}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Taxa de Sucesso
                </span>
                <span className="font-medium">
                  {taxaSucessoProcessos}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
