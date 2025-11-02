import { Case } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FileCheck, FileX, Clock, AlertTriangle } from 'lucide-react';

interface DashboardStatsProps {
  cases: Case[];
}

export function DashboardStats({ cases }: DashboardStatsProps) {
  const stats = {
    total: cases.length,
    aprovados: cases.filter((c) => c.status === 'aprovado').length,
    negados: cases.filter((c) => c.status === 'negado').length,
    emAnalise: cases.filter((c) => c.status === 'em_analise').length,
    incompletos: cases.filter((c) => c.status === 'documentacao_incompleta').length,
    pendentes: cases.filter((c) => c.status === 'pendente').length,
  };

  const taxaAprovacao =
    stats.total > 0 ? Math.round((stats.aprovados / (stats.aprovados + stats.negados || 1)) * 100) : 0;

  return (
    <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 md:px-6 pt-4 md:pt-6">
          <CardTitle className="text-xs md:text-sm">Total de Casos</CardTitle>
          <FileCheck className="h-3 w-3 md:h-4 md:w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        </CardHeader>
        <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
          <div className="text-xl md:text-2xl">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            {stats.emAnalise} em análise
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 md:px-6 pt-4 md:pt-6">
          <CardTitle className="text-xs md:text-sm">Taxa de Aprovação</CardTitle>
          <FileCheck className="h-3 w-3 md:h-4 md:w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
        </CardHeader>
        <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
          <div className="text-xl md:text-2xl">{taxaAprovacao}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.aprovados} aprovados
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 border-yellow-200 dark:border-yellow-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 md:px-6 pt-4 md:pt-6">
          <CardTitle className="text-xs md:text-sm">Doc. Incompleta</CardTitle>
          <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
        </CardHeader>
        <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
          <div className="text-xl md:text-2xl">{stats.incompletos}</div>
          <p className="text-xs text-muted-foreground">
            Requer ação
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950 border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 md:px-6 pt-4 md:pt-6">
          <CardTitle className="text-xs md:text-sm">Pendentes</CardTitle>
          <Clock className="h-3 w-3 md:h-4 md:w-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
        </CardHeader>
        <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
          <div className="text-xl md:text-2xl">{stats.pendentes}</div>
          <p className="text-xs text-muted-foreground">
            Aguardando
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
