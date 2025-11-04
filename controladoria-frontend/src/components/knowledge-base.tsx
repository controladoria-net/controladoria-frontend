import { useState } from 'react';
import { KnowledgeArticle, DefesoPeriod } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, Book, Scale, HelpCircle, FileText, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface KnowledgeBaseProps {
  articles: KnowledgeArticle[];
  defesoPeriods: DefesoPeriod[];
}

export function KnowledgeBase({ articles, defesoPeriods }: KnowledgeBaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Paginação
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  // Reset página ao buscar
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'legislacao':
        return <Scale className="h-4 w-4" />;
      case 'procedimentos':
        return <Book className="h-4 w-4" />;
      case 'faq':
        return <HelpCircle className="h-4 w-4" />;
      case 'modelos':
        return <FileText className="h-4 w-4" />;
      default:
        return <Book className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      legislacao: 'Legislação',
      procedimentos: 'Procedimentos',
      faq: 'FAQ',
      modelos: 'Modelos',
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      legislacao: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      procedimentos: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      faq: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      modelos: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar artigos, legislação, procedimentos..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="articles" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="articles">
            <Book className="h-4 w-4 mr-2" />
            Artigos
          </TabsTrigger>
          <TabsTrigger value="defeso">
            <Calendar className="h-4 w-4 mr-2" />
            Períodos de Defeso
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-4">
          {paginatedArticles.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Nenhum artigo encontrado</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {paginatedArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getCategoryColor(article.category)} variant="secondary">
                          <span className="flex items-center gap-1">
                            {getCategoryIcon(article.category)}
                            {getCategoryLabel(article.category)}
                          </span>
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        Atualizado em {formatDate(article.lastUpdated)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="whitespace-pre-line text-sm">{article.content}</div>
                  </div>
                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {article.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              ))}

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
                  <p className="text-sm text-muted-foreground">
                    Exibindo {startIndex + 1}-{Math.min(endIndex, filteredArticles.length)} de {filteredArticles.length} artigos
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
            </>
          )}
        </TabsContent>

        <TabsContent value="defeso">
          <Card>
            <CardHeader>
              <CardTitle>Calendário de Defeso 2024/2025</CardTitle>
              <p className="text-sm text-muted-foreground">
                Períodos de proibição da pesca por região e espécie
              </p>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Região</TableHead>
                      <TableHead>Espécie</TableHead>
                      <TableHead>Início</TableHead>
                      <TableHead>Término</TableHead>
                      <TableHead>Ano Ref.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {defesoPeriods.map((period) => {
                      const isActive =
                        new Date() >= new Date(period.inicio) && new Date() <= new Date(period.fim);
                      return (
                        <TableRow key={period.id}>
                          <TableCell>{period.regiao}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {period.especie}
                              {isActive && (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                  Ativo
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(period.inicio)}</TableCell>
                          <TableCell>{formatDate(period.fim)}</TableCell>
                          <TableCell>{period.anoReferencia}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Importante:</strong> Os períodos de defeso podem variar anualmente conforme portarias do
                  IBAMA e legislação estadual. Sempre verifique as portarias mais recentes.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
