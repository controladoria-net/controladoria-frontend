import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Filter, SortAsc, Scale } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ProcessosTable } from './processos-table';
import { Processo, ProcessoStatus } from '../lib/types';

interface AllProcessosProps {
  processos: Processo[];
  onViewProcesso: (id: string) => void;
}

type SortField = 'data' | 'nome' | 'numero' | 'ultima_mov' | 'movimentacoes';
type SortOrder = 'asc' | 'desc';

export function AllProcessos({ processos, onViewProcesso }: AllProcessosProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProcessoStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'baixa' | 'media' | 'alta'>('all');
  const [sortField, setSortField] = useState<SortField>('data');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrar e ordenar
  const filteredProcessos = processos
    .filter((processo) => {
      const matchesSearch =
        processo.pescador.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        processo.pescador.cpf.includes(searchQuery) ||
        processo.numeroProcesso.includes(searchQuery) ||
        processo.tribunal.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || processo.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || processo.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'data':
          comparison = new Date(a.dataAjuizamento).getTime() - new Date(b.dataAjuizamento).getTime();
          break;
        case 'nome':
          comparison = a.pescador.nome.localeCompare(b.pescador.nome);
          break;
        case 'numero':
          comparison = a.numeroProcesso.localeCompare(b.numeroProcesso);
          break;
        case 'ultima_mov':
          const dateA = a.ultimaMovimentacao ? new Date(a.ultimaMovimentacao).getTime() : 0;
          const dateB = b.ultimaMovimentacao ? new Date(b.ultimaMovimentacao).getTime() : 0;
          comparison = dateA - dateB;
          break;
        case 'movimentacoes':
          comparison = (a.movimentacoes || 0) - (b.movimentacoes || 0);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Paginação
  const totalPages = Math.ceil(filteredProcessos.length / itemsPerPage);
  const paginatedProcessos = filteredProcessos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Estatísticas
  const stats = {
    total: processos.length,
    emAndamento: processos.filter((p) => p.status === 'em_andamento').length,
    aguardandoDocs: processos.filter((p) => p.status === 'aguardando_documentos').length,
    deferidos: processos.filter((p) => p.status === 'deferido').length,
    indeferidos: processos.filter((p) => p.status === 'indeferido').length,
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
            <div className="text-2xl font-bold text-blue-600">{stats.emAndamento}</div>
            <div className="text-xs text-muted-foreground">Em Andamento</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.aguardandoDocs}</div>
            <div className="text-xs text-muted-foreground">Aguardando Docs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.deferidos}</div>
            <div className="text-xs text-muted-foreground">Deferidos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.indeferidos}</div>
            <div className="text-xs text-muted-foreground">Indeferidos</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Todos os Processos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por nome, CPF, nº processo ou tribunal..."
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
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="aguardando_documentos">Aguardando Docs</SelectItem>
                  <SelectItem value="deferido">Deferido</SelectItem>
                  <SelectItem value="indeferido">Indeferido</SelectItem>
                  <SelectItem value="arquivado">Arquivado</SelectItem>
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
                  <SelectItem value="data">Data de Ajuizamento</SelectItem>
                  <SelectItem value="ultima_mov">Última Movimentação</SelectItem>
                  <SelectItem value="nome">Nome do Pescador</SelectItem>
                  <SelectItem value="numero">Nº do Processo</SelectItem>
                  <SelectItem value="movimentacoes">Nº de Movimentações</SelectItem>
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
                {filteredProcessos.length} processo(s) encontrado(s)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <ProcessosTable
            processos={paginatedProcessos}
            onViewProcesso={onViewProcesso}
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
