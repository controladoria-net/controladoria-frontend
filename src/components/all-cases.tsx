import { useState } from 'react';
import { Case, CaseStatus } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Search,
  Filter,
  Download,
  Eye,
  ArrowUpDown,
  FileText,
  ChevronLeft,
  ChevronRight,
  Table2,
  LayoutGrid,
} from 'lucide-react';
import { getStatusColor, getStatusLabel, formatDate } from '../lib/utils';

interface AllCasesProps {
  cases: Case[];
  onViewCase: (caseId: string) => void;
}

type SortField = 'nome' | 'status' | 'documentos' | 'createdAt' | 'numeroProcesso' | 'tribunal' | 'dataAjuizamento' | 'movimentacoes' | 'ultimaMovimentacao';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'table' | 'cards';

export function AllCases({ cases, onViewCase }: AllCasesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const itemsPerPage = 10;

  // Filtrar casos
  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.pescador.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.pescador.cpf.includes(searchQuery) ||
      c.numeroProcesso?.includes(searchQuery) ||
      c.tribunal?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Ordenar casos
  const sortedCases = [...filteredCases].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'nome':
        aValue = a.pescador.nome.toLowerCase();
        bValue = b.pescador.nome.toLowerCase();
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'documentos':
        aValue = a.documents.length;
        bValue = b.documents.length;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'numeroProcesso':
        aValue = a.numeroProcesso || '';
        bValue = b.numeroProcesso || '';
        break;
      case 'tribunal':
        aValue = a.tribunal || '';
        bValue = b.tribunal || '';
        break;
      case 'dataAjuizamento':
        aValue = a.dataAjuizamento ? new Date(a.dataAjuizamento).getTime() : 0;
        bValue = b.dataAjuizamento ? new Date(b.dataAjuizamento).getTime() : 0;
        break;
      case 'movimentacoes':
        aValue = a.movimentacoes || 0;
        bValue = b.movimentacoes || 0;
        break;
      case 'ultimaMovimentacao':
        aValue = a.ultimaMovimentacao ? new Date(a.ultimaMovimentacao).getTime() : 0;
        bValue = b.ultimaMovimentacao ? new Date(b.ultimaMovimentacao).getTime() : 0;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginação
  const totalPages = Math.ceil(sortedCases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCases = sortedCases.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const headers = [
      'Nome',
      'CPF',
      'Status',
      'Documentos',
      'Criado em',
      'Número Processo',
      'Tribunal',
      'Órgão Julgador',
      'Classe Processual',
      'Assunto',
      'Situação',
      'Data Ajuizamento',
      'Movimentações',
      'Última Movimentação'
    ];
    const rows = filteredCases.map(c => [
      c.pescador.nome,
      c.pescador.cpf,
      getStatusLabel(c.status),
      c.documents.length,
      formatDate(c.createdAt),
      c.numeroProcesso || '-',
      c.tribunal || '-',
      c.orgaoJulgador || '-',
      c.classeProcessual || '-',
      c.assunto || '-',
      c.situacao || '-',
      c.dataAjuizamento ? formatDate(c.dataAjuizamento) : '-',
      c.movimentacoes || 0,
      c.ultimaMovimentacao ? formatDate(c.ultimaMovimentacao) : '-',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `casos-seguro-defeso-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Filtros e Busca */}
      <Card>
        <CardHeader className="px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <CardTitle className="text-base md:text-lg">
              Filtros de Busca
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Limpar Filtros
              </Button>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Exportar CSV</span>
                <span className="sm:hidden">CSV</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nome, CPF, nº processo, tribunal..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>

            {/* Filtro de Status */}
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
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="negado">Negado</SelectItem>
                <SelectItem value="documentacao_incompleta">Doc. Incompleta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <Card>
        <CardHeader className="px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-base md:text-lg">
                Todos os Casos ({filteredCases.length})
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Exibindo {startIndex + 1}-{Math.min(endIndex, filteredCases.length)} de {filteredCases.length}
              </p>
            </div>
            
            {/* Toggle de visualização */}
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="h-8"
              >
                <Table2 className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Tabela</span>
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="h-8"
              >
                <LayoutGrid className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Cards</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Visualização em Tabela - Desktop/Tablet */}
          {viewMode === 'table' && (
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('nome')}
                        className="-ml-3 text-xs"
                      >
                        Pescador
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </th>
                    <th className="text-left p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('status')}
                        className="-ml-3 text-xs"
                      >
                        Status
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </th>
                    <th className="text-left p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('documentos')}
                        className="-ml-3 text-xs"
                      >
                        Docs
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </th>
                    <th className="text-left p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('createdAt')}
                        className="-ml-3 text-xs"
                      >
                        Criado em
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </th>
                    <th className="text-left p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('numeroProcesso')}
                        className="-ml-3 text-xs"
                      >
                        Nº Processo
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </th>
                    <th className="text-left p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('tribunal')}
                        className="-ml-3 text-xs"
                      >
                        Tribunal
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </th>
                    <th className="text-left p-3 text-xs">Órgão Julgador</th>
                    <th className="text-left p-3 text-xs">Classe</th>
                    <th className="text-left p-3 text-xs">Assunto</th>
                    <th className="text-left p-3 text-xs">Situação</th>
                    <th className="text-left p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('dataAjuizamento')}
                        className="-ml-3 text-xs"
                      >
                        Data Ajuiz.
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </th>
                    <th className="text-left p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('movimentacoes')}
                        className="-ml-3 text-xs"
                      >
                        Movs
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </th>
                    <th className="text-left p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('ultimaMovimentacao')}
                        className="-ml-3 text-xs"
                      >
                        Última Mov.
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </th>
                    <th className="text-right p-3 text-xs">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCases.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="text-center text-muted-foreground py-8">
                        Nenhum caso encontrado
                      </td>
                    </tr>
                  ) : (
                    paginatedCases.map((caso) => (
                      <tr
                        key={caso.id}
                        className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => onViewCase(caso.id)}
                      >
                        <td className="p-3">
                          <div className="max-w-[150px]">
                            <div className="text-xs truncate">{caso.pescador.nome}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {caso.pescador.cpf}
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusColor(caso.status)} variant="secondary">
                            {getStatusLabel(caso.status)}
                          </Badge>
                        </td>
                        <td className="p-3 text-xs text-center">{caso.documents.length}</td>
                        <td className="p-3 text-xs">{formatDate(caso.createdAt)}</td>
                        <td className="p-3 text-xs max-w-[150px] truncate" title={caso.numeroProcesso}>
                          {caso.numeroProcesso || '-'}
                        </td>
                        <td className="p-3 text-xs max-w-[150px] truncate" title={caso.tribunal}>
                          {caso.tribunal || '-'}
                        </td>
                        <td className="p-3 text-xs max-w-[120px] truncate" title={caso.orgaoJulgador}>
                          {caso.orgaoJulgador || '-'}
                        </td>
                        <td className="p-3 text-xs max-w-[120px] truncate" title={caso.classeProcessual}>
                          {caso.classeProcessual || '-'}
                        </td>
                        <td className="p-3 text-xs max-w-[150px] truncate" title={caso.assunto}>
                          {caso.assunto || '-'}
                        </td>
                        <td className="p-3 text-xs max-w-[120px] truncate" title={caso.situacao}>
                          {caso.situacao || '-'}
                        </td>
                        <td className="p-3 text-xs">
                          {caso.dataAjuizamento ? formatDate(caso.dataAjuizamento) : '-'}
                        </td>
                        <td className="p-3 text-xs text-center">{caso.movimentacoes || 0}</td>
                        <td className="p-3 text-xs">
                          {caso.ultimaMovimentacao ? formatDate(caso.ultimaMovimentacao) : '-'}
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewCase(caso.id);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Visualização em Cards */}
          {viewMode === 'cards' && (
            <div className="space-y-3 p-4">
              {paginatedCases.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  Nenhum caso encontrado
                </div>
              ) : (
                paginatedCases.map((caso) => (
                  <Card
                    key={caso.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onViewCase(caso.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium truncate">{caso.pescador.nome}</h3>
                            <p className="text-xs text-muted-foreground">CPF: {caso.pescador.cpf}</p>
                          </div>
                          <Badge className={getStatusColor(caso.status)} variant="secondary">
                            {getStatusLabel(caso.status)}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-muted-foreground">Documentos:</span>
                              <p>{caso.documents.length}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Criado:</span>
                              <p>{formatDate(caso.createdAt)}</p>
                            </div>
                          </div>

                          {caso.numeroProcesso && (
                            <div>
                              <span className="text-muted-foreground">Nº Processo:</span>
                              <p className="truncate">{caso.numeroProcesso}</p>
                            </div>
                          )}

                          {caso.tribunal && (
                            <div>
                              <span className="text-muted-foreground">Tribunal:</span>
                              <p className="truncate">{caso.tribunal}</p>
                            </div>
                          )}

                          {caso.orgaoJulgador && (
                            <div>
                              <span className="text-muted-foreground">Órgão Julgador:</span>
                              <p className="truncate">{caso.orgaoJulgador}</p>
                            </div>
                          )}

                          {caso.classeProcessual && (
                            <div>
                              <span className="text-muted-foreground">Classe:</span>
                              <p className="truncate">{caso.classeProcessual}</p>
                            </div>
                          )}

                          {caso.assunto && (
                            <div>
                              <span className="text-muted-foreground">Assunto:</span>
                              <p className="truncate">{caso.assunto}</p>
                            </div>
                          )}

                          {caso.situacao && (
                            <div>
                              <span className="text-muted-foreground">Situação:</span>
                              <p className="truncate">{caso.situacao}</p>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-2">
                            {caso.dataAjuizamento && (
                              <div>
                                <span className="text-muted-foreground">Data Ajuiz.:</span>
                                <p>{formatDate(caso.dataAjuizamento)}</p>
                              </div>
                            )}
                            {caso.movimentacoes !== undefined && (
                              <div>
                                <span className="text-muted-foreground">Movimentações:</span>
                                <p>{caso.movimentacoes}</p>
                              </div>
                            )}
                          </div>

                          {caso.ultimaMovimentacao && (
                            <div>
                              <span className="text-muted-foreground">Última Movimentação:</span>
                              <p>{formatDate(caso.ultimaMovimentacao)}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-end pt-2 border-t">
                          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Cards Mobile para modo tabela */}
          {viewMode === 'table' && (
            <div className="md:hidden space-y-3 p-4">
              {paginatedCases.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  Nenhum caso encontrado
                </div>
              ) : (
                paginatedCases.map((caso) => (
                  <Card
                    key={caso.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onViewCase(caso.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium truncate">{caso.pescador.nome}</h3>
                            <p className="text-xs text-muted-foreground">CPF: {caso.pescador.cpf}</p>
                          </div>
                          <Badge className={getStatusColor(caso.status)} variant="secondary">
                            {getStatusLabel(caso.status)}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-muted-foreground">Documentos:</span>
                              <p>{caso.documents.length}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Criado:</span>
                              <p>{formatDate(caso.createdAt)}</p>
                            </div>
                          </div>

                          {caso.numeroProcesso && (
                            <div>
                              <span className="text-muted-foreground">Nº Processo:</span>
                              <p className="truncate">{caso.numeroProcesso}</p>
                            </div>
                          )}

                          {caso.tribunal && (
                            <div>
                              <span className="text-muted-foreground">Tribunal:</span>
                              <p className="truncate">{caso.tribunal}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-end pt-2 border-t">
                          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paginação */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0 hidden sm:inline-flex"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
