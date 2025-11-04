import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, Loader2, FileText, Calendar, Building2, Scale, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ProcessData {
  numeroProcesso: string;
  tribunal: string;
  orgaoJulgador: string;
  classeProcessual: string;
  assunto: string;
  situacao: string;
  dataAjuizamento: Date;
  partes: {
    autor: string;
    cpf?: string;
    reu: string;
  };
  movimentacoes: number;
  ultimaMovimentacao: Date;
  descricaoUltimaMovimentacao?: string;
}

interface ProcessSearchProps {
  onProcessFound: (processData: ProcessData) => void;
  isAnalyzing: boolean;
}

export function ProcessSearch({ onProcessFound, isAnalyzing }: ProcessSearchProps) {
  const [numeroProcesso, setNumeroProcesso] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [processData, setProcessData] = useState<ProcessData | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Simula busca em API de processos judiciais (PJe, TJSP, etc.)
  const searchProcess = async (numero: string) => {
    setIsSearching(true);
    setSearchError(null);
    setProcessData(null);

    try {
      // Simula delay de busca na API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Remove caracteres especiais do número do processo
      const cleanNumber = numero.replace(/\D/g, '');

      // Simula se o processo foi encontrado ou não (70% de chance de encontrar)
      const found = Math.random() > 0.3;

      if (!found || cleanNumber.length < 15) {
        setSearchError('Processo não encontrado nos sistemas do tribunal. Verifique o número e tente novamente.');
        toast.error('Processo não encontrado');
        setIsSearching(false);
        return;
      }

      // Simula dados do processo encontrado
      const mockProcessData: ProcessData = {
        numeroProcesso: numero,
        tribunal: 'TJSP - Tribunal de Justiça de São Paulo',
        orgaoJulgador: '2ª Vara Cível de Santos',
        classeProcessual: 'Procedimento Comum Cível',
        assunto: 'Seguro-Defeso / Benefício Previdenciário',
        situacao: 'Em andamento',
        dataAjuizamento: new Date('2024-09-15'),
        partes: {
          autor: 'José da Silva Pescador',
          cpf: '123.456.789-00',
          reu: 'Instituto Nacional do Seguro Social - INSS',
        },
        movimentacoes: 8,
        ultimaMovimentacao: new Date('2024-10-20'),
        descricaoUltimaMovimentacao: 'Juntada de petição do autor',
      };

      setProcessData(mockProcessData);
      toast.success('Processo encontrado com sucesso!');
    } catch (error) {
      setSearchError('Erro ao buscar processo. Tente novamente.');
      toast.error('Erro na busca');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!numeroProcesso.trim()) {
      toast.error('Digite o número do processo');
      return;
    }

    searchProcess(numeroProcesso);
  };

  const handleAddProcess = () => {
    if (processData) {
      onProcessFound(processData);
    }
  };

  const formatProcessNumber = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Formato: 0000000-00.0000.0.00.0000
    if (numbers.length <= 7) {
      return numbers;
    } else if (numbers.length <= 9) {
      return `${numbers.slice(0, 7)}-${numbers.slice(7)}`;
    } else if (numbers.length <= 13) {
      return `${numbers.slice(0, 7)}-${numbers.slice(7, 9)}.${numbers.slice(9)}`;
    } else if (numbers.length <= 14) {
      return `${numbers.slice(0, 7)}-${numbers.slice(7, 9)}.${numbers.slice(9, 13)}.${numbers.slice(13)}`;
    } else if (numbers.length <= 16) {
      return `${numbers.slice(0, 7)}-${numbers.slice(7, 9)}.${numbers.slice(9, 13)}.${numbers.slice(13, 14)}.${numbers.slice(14)}`;
    } else {
      return `${numbers.slice(0, 7)}-${numbers.slice(7, 9)}.${numbers.slice(9, 13)}.${numbers.slice(13, 14)}.${numbers.slice(14, 16)}.${numbers.slice(16, 20)}`;
    }
  };

  const handleInputChange = (value: string) => {
    const formatted = formatProcessNumber(value);
    setNumeroProcesso(formatted);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex-shrink-0">
          <Scale className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl mb-2">Buscar Processo Judicial</h2>
          <p className="text-muted-foreground">
            Digite o número do processo para importar os dados automaticamente dos sistemas do tribunal. 
            Nosso sistema busca em PJe, TJSP, CNJ e outros tribunais.
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="numeroProcesso">Número do Processo *</Label>
              <div className="flex gap-2">
                <Input
                  id="numeroProcesso"
                  value={numeroProcesso}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="0000000-00.0000.0.00.0000"
                  className="flex-1"
                  maxLength={25}
                  disabled={isSearching}
                />
                <Button 
                  type="submit" 
                  disabled={isSearching || !numeroProcesso.trim()}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Exemplo: 0001234-56.2024.8.26.0562 (Formato CNJ)
              </p>
            </div>

            {searchError && (
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-900 dark:text-red-300">
                  {searchError}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </form>

      {processData && (
        <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              <h3 className="text-lg text-green-900 dark:text-green-100">
                Processo Encontrado
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Número do Processo</span>
                </div>
                <p className="font-mono">{processData.numeroProcesso}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>Tribunal</span>
                </div>
                <p className="text-sm">{processData.tribunal}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Scale className="h-4 w-4" />
                  <span>Órgão Julgador</span>
                </div>
                <p className="text-sm">{processData.orgaoJulgador}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Classe Processual</span>
                </div>
                <p className="text-sm">{processData.classeProcessual}</p>
              </div>

              <div className="space-y-1 md:col-span-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Assunto</span>
                </div>
                <p className="text-sm">{processData.assunto}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Situação</span>
                </div>
                <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {processData.situacao}
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Data de Ajuizamento</span>
                </div>
                <p className="text-sm">{processData.dataAjuizamento.toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            <div className="pt-4 border-t space-y-3">
              <h4 className="text-sm">Partes do Processo</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">Autor (Pescador)</p>
                  <p className="text-sm">{processData.partes.autor}</p>
                  {processData.partes.cpf && (
                    <p className="text-xs text-muted-foreground mt-1">CPF: {processData.partes.cpf}</p>
                  )}
                </div>
                <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">Réu</p>
                  <p className="text-sm">{processData.partes.reu}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t space-y-3">
              <h4 className="text-sm">Movimentações</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border text-center">
                  <p className="text-2xl mb-1">{processData.movimentacoes}</p>
                  <p className="text-xs text-muted-foreground">Total de Movimentações</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">Última Movimentação</p>
                  <p className="text-sm">{processData.ultimaMovimentacao.toLocaleDateString('pt-BR')}</p>
                  {processData.descricaoUltimaMovimentacao && (
                    <p className="text-xs text-muted-foreground mt-1">{processData.descricaoUltimaMovimentacao}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setProcessData(null);
                  setNumeroProcesso('');
                }}
              >
                Buscar Outro
              </Button>
              <Button 
                onClick={handleAddProcess}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adicionando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Adicionar aos Meus Casos
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informação sobre busca automática */}
      <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900 dark:text-blue-300">
          <p className="mb-2">
            <strong>🔍 Busca Automática em Tribunais</strong>
          </p>
          <p className="text-blue-700 dark:text-blue-400 mb-1">
            Nosso sistema consulta automaticamente os dados do processo em múltiplos tribunais, 
            importando informações como partes, movimentações, situação e muito mais.
          </p>
          <p className="text-blue-600 dark:text-blue-500 text-xs">
            💡 Após adicionar o processo, você poderá complementar com documentos e análises adicionais!
          </p>
        </div>
      </div>
    </div>
  );
}
