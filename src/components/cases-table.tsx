import { useState } from 'react';
import { Case } from '../lib/types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { getStatusColor, getStatusLabel, formatDate } from '../lib/utils';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';

interface CasesTableProps {
  cases: Case[];
  onViewCase: (caseId: string) => void;
}

export function CasesTable({ cases, onViewCase }: CasesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Paginação
  const totalPages = Math.ceil(cases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCases = cases.slice(startIndex, endIndex);

  if (cases.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Nenhum caso encontrado
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 text-sm font-medium">Pescador</th>
              <th className="text-left p-3 text-sm font-medium">Status</th>
              <th className="text-left p-3 text-sm font-medium">Documentos</th>
              <th className="text-left p-3 text-sm font-medium">Criado em</th>
              <th className="text-right p-3 text-sm font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCases.map((caso) => (
              <tr key={caso.id} className="border-b hover:bg-muted/50 transition-colors">
                <td className="p-3">
                  <div>
                    <div className="text-sm">{caso.pescador.nome}</div>
                    <div className="text-xs text-muted-foreground">{caso.pescador.cpf}</div>
                  </div>
                </td>
                <td className="p-3">
                  <Badge className={getStatusColor(caso.status)} variant="secondary">
                    {getStatusLabel(caso.status)}
                  </Badge>
                </td>
                <td className="p-3 text-sm">{caso.documents.length}</td>
                <td className="p-3 text-sm">{formatDate(caso.createdAt)}</td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => onViewCase(caso.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 px-4">
        {paginatedCases.map((caso) => (
          <Card key={caso.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate">{caso.pescador.nome}</h3>
                    <p className="text-xs text-muted-foreground truncate">{caso.pescador.cpf}</p>
                  </div>
                  <Badge className={getStatusColor(caso.status)} variant="secondary">
                    {getStatusLabel(caso.status)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Documentos:</span>
                    <p>{caso.documents.length}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Criado:</span>
                    <p>{formatDate(caso.createdAt)}</p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onViewCase(caso.id)}
                  className="w-full"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Exibindo {startIndex + 1}-{Math.min(endIndex, cases.length)} de {cases.length} casos
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
      )}
    </div>
  );
}
