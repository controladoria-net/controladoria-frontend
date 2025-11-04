import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Filter, SortAsc, FileText } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { SolicitacoesTable } from './solicitacoes-table';
import { Solicitacao, SolicitacaoStatus } from '../lib/types';

interface AllSolicitacoesProps {
  solicitacoes: Solicitacao[];
  onViewSolicitacao: (id: string) => void;
}

type SortField = 'data' | 'nome' | 'score';
type SortOrder = 'asc' | 'desc';

export function AllSolicitacoes({ solicitacoes, onViewSolicitacao }: AllSolicitacoesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SolicitacaoStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'baixa' | 'media' | 'alta'>('all');
  const [sortField, setSortField] = useState<SortField>('data');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrar e ordenar
  const filteredSolicitacoes = solicitacoes
    .filter((solicitacao) => {
      const matchesSearch =
        solicitacao.pescador.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        solicitacao.pescador.cpf.includes(searchQuery) ||
        solicitacao.pescador.colonia.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || solicitacao.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || solicitacao.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'data':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'nome':
          comparison = a.pescador.nome.localeCompare(b.pescador.nome);
          break;
        case 'score':
          comparison = (a.analysis?.score || 0) - (b.analysis?.score || 0);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Paginação
  const totalPages = Math.ceil(filteredSolicitacoes.length / itemsPerPage);
  const paginatedSolicitacoes = filteredSolicitacoes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Estatísticas
  const stats = {
    total: solicitacoes.length,
    pendentes: solicitacoes.filter((s) => s.status === 'pendente').length,
    emAnalise: solicitacoes.filter((s) => s.status === 'em_analise').length,
    aprovadas: solicitacoes.filter((s) => s.status === 'aprovada').length,
    reprovadas: solicitacoes.filter((s) => s.status === 'reprovada').length,
  };

  return (
    <div className="space-y-4">
      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{stats.pendentes}</div>
            <div className="text-xs text-muted-foreground">Pendentes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.emAnalise}</div>
            <div className="text-xs text-muted-foreground">Em Análise</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.aprovadas}</div>
            <div className="text-xs text-muted-foreground">Aprovadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.reprovadas}</div>
            <div className="text-xs text-muted-foreground">Reprovadas</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Todas as Solicitações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por nome, CPF ou colônia..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>

              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as any);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_analise">Em Análise</SelectItem>
                  <SelectItem value="aprovada">Aprovada</SelectItem>
                  <SelectItem value="reprovada">Reprovada</SelectItem>
                  <SelectItem value="documentacao_incompleta">Doc. Incompleta</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={priorityFilter}
                onValueChange={(value) => {
                  setPriorityFilter(value as any);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Prioridades</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={sortField}
                onValueChange={(value) => setSortField(value as SortField)}
              >
                <SelectTrigger className="w-[180px]">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="data">Data de Criação</SelectItem>
                  <SelectItem value="nome">Nome do Pescador</SelectItem>
                  <SelectItem value="score">Score da IA</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑ Crescente' : '↓ Decrescente'}
              </Button>

              <div className="ml-auto text-sm text-muted-foreground">
                {filteredSolicitacoes.length} solicitação(ões) encontrada(s)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <SolicitacoesTable
            solicitacoes={paginatedSolicitacoes}
            onViewSolicitacao={onViewSolicitacao}
          />
        </CardContent>
      </Card>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <div className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
