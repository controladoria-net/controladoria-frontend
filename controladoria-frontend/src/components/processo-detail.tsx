import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { 
  CheckCircle2, 
  XCircle, 
  Clock,
  FileText,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Download,
  Scale,
  Archive,
  AlertTriangle,
  History
} from 'lucide-react';
import { Processo } from '../lib/types';
import { useState } from 'react';

interface ProcessoDetailProps {
  processo: Processo;
  onGenerateReport?: () => void;
}

export function ProcessoDetail({ 
  processo, 
  onGenerateReport 
}: ProcessoDetailProps) {
  const [notes, setNotes] = useState(processo.lawyerNotes || '');

  const getStatusBadge = () => {
    const statusConfig = {
      em_andamento: { label: 'Em Andamento', icon: Clock, className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      aguardando_documentos: { label: 'Aguardando Docs', icon: FileText, className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
      deferido: { label: 'Deferido', icon: CheckCircle2, className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      indeferido: { label: 'Indeferido', icon: XCircle, className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
      arquivado: { label: 'Arquivado', icon: Archive, className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
    };

    const config = statusConfig[processo.status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.className} flex items-center gap-1 w-fit`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = () => {
    const config = {
      baixa: { label: 'Baixa', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
      media: { label: 'Média', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
      alta: { label: 'Alta', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' },
    };

    return <Badge variant="outline" className={config[processo.priority].className}>{config[processo.priority].label}</Badge>;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle>Processo #{processo.id}</CardTitle>
                {getStatusBadge()}
                {getPriorityBadge()}
              </div>
              <p className="text-sm text-muted-foreground font-mono">
                {processo.numeroProcesso}
              </p>
              <p className="text-sm text-muted-foreground">
                Ajuizado em {new Date(processo.dataAjuizamento).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {onGenerateReport && (
                <Button variant="outline" onClick={onGenerateReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Processo
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="processo" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="processo">Processo</TabsTrigger>
          <TabsTrigger value="pescador">Pescador</TabsTrigger>
          <TabsTrigger value="documents">Docs ({processo.documents.length})</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Aba de Processo */}
        <TabsContent value="processo" className="space-y-4">
          {/* Informações do Processo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-purple-600" />
                Informações Processuais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Número do Processo</p>
                  <p className="font-medium font-mono">{processo.numeroProcesso}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tribunal</p>
                  <p className="font-medium">{processo.tribunal}</p>
                </div>
                {processo.orgaoJulgador && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Órgão Julgador</p>
                    <p className="font-medium">{processo.orgaoJulgador}</p>
                  </div>
                )}
                {processo.classeProcessual && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Classe Processual</p>
                    <p className="font-medium">{processo.classeProcessual}</p>
                  </div>
                )}
                {processo.assunto && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Assunto</p>
                    <p className="font-medium">{processo.assunto}</p>
                  </div>
                )}
                {processo.situacao && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Situação Atual</p>
                    <p className="font-medium">{processo.situacao}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Data de Ajuizamento</p>
                  <p className="font-medium">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    {new Date(processo.dataAjuizamento).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {processo.ultimaMovimentacao && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Última Movimentação</p>
                    <p className="font-medium">
                      <History className="h-4 w-4 inline mr-1" />
                      {new Date(processo.ultimaMovimentacao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {processo.movimentacoes || 0}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Movimentações</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {Math.floor((new Date().getTime() - new Date(processo.dataAjuizamento).getTime()) / (1000 * 60 * 60 * 24))}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Dias em Curso</p>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-2 md:col-span-1">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {processo.documents.length}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Documentos</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alertas e Avisos */}
          {processo.status === 'aguardando_documentos' && (
            <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900 dark:text-yellow-100">
                      Ação Necessária
                    </p>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                      Este processo está aguardando documentação complementar. 
                      Providencie os documentos solicitados para dar continuidade ao processo.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {processo.status === 'deferido' && (
            <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      Processo Deferido
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                      Sentença favorável. O cliente pode receber o benefício do Seguro-Defeso.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {processo.status === 'indeferido' && (
            <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900 dark:text-red-100">
                      Processo Indeferido
                    </p>
                    <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                      O pedido foi indeferido. Avalie a possibilidade de recurso com o cliente.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notas do Advogado */}
          <Card>
            <CardHeader>
              <CardTitle>Notas do Advogado</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Adicione observações sobre este processo..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba do Pescador */}
        <TabsContent value="pescador" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Dados do Pescador
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Nome Completo</p>
                  <p className="font-medium">{processo.pescador.nome}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-medium font-mono">{processo.pescador.cpf}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">RG</p>
                  <p className="font-medium font-mono">{processo.pescador.rg}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                  <p className="font-medium">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    {new Date(processo.pescador.dataNascimento).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">
                    <Phone className="h-4 w-4 inline mr-1" />
                    {processo.pescador.telefone}
                  </p>
                </div>
                {processo.pescador.email && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">E-mail</p>
                    <p className="font-medium">
                      <Mail className="h-4 w-4 inline mr-1" />
                      {processo.pescador.email}
                    </p>
                  </div>
                )}
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="font-medium">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    {processo.pescador.endereco}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Colônia de Pescadores</p>
                  <p className="font-medium">{processo.pescador.colonia}</p>
                </div>
                {processo.pescador.rgpNumero && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">RGP</p>
                    <p className="font-medium font-mono">{processo.pescador.rgpNumero}</p>
                  </div>
                )}
                {processo.pescador.rgpDataEmissao && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Data de Emissão RGP</p>
                    <p className="font-medium">
                      {new Date(processo.pescador.rgpDataEmissao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Documentos */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentos do Processo</CardTitle>
            </CardHeader>
            <CardContent>
              {processo.documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {processo.documents.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.type.replace('_', ' ').toUpperCase()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Enviado em {new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Nenhum documento anexado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Timeline */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Linha do Tempo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Última Movimentação */}
                {processo.ultimaMovimentacao && (
                  <div className="flex gap-3">
                    <div className="w-2 bg-purple-600 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium">Última Movimentação</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(processo.ultimaMovimentacao).toLocaleString('pt-BR')}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {processo.situacao}
                      </p>
                    </div>
                  </div>
                )}

                {/* Ajuizamento */}
                <div className="flex gap-3">
                  <div className="w-2 bg-primary rounded-full flex-shrink-0"></div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium">Processo Ajuizado</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(processo.dataAjuizamento).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Processo distribuído ao {processo.orgaoJulgador || processo.tribunal}
                    </p>
                  </div>
                </div>

                {/* Criação */}
                <div className="flex gap-3">
                  <div className="w-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Registro Criado</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(processo.createdAt).toLocaleString('pt-BR')}
                    </p>
                    {processo.solicitacaoId && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Originado da solicitação #{processo.solicitacaoId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
