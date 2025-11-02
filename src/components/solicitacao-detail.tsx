import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock,
  FileText,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Download,
  FileX,
  Scale,
  Loader2
} from 'lucide-react';
import { Solicitacao } from '../lib/types';
import { useState } from 'react';

interface SolicitacaoDetailProps {
  solicitacao: Solicitacao;
  onConvertToProcesso?: (solicitacao: Solicitacao) => void;
  onApprove?: (solicitacaoId: string) => void;
  onGenerateReport?: () => void;
  onRequestDocuments?: () => void;
}

export function SolicitacaoDetail({ 
  solicitacao, 
  onConvertToProcesso,
  onApprove,
  onGenerateReport,
  onRequestDocuments 
}: SolicitacaoDetailProps) {
  const [notes, setNotes] = useState(solicitacao.lawyerNotes || '');
  const [isConverting, setIsConverting] = useState(false);
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);

  const getStatusBadge = () => {
    const statusConfig = {
      pendente: { label: 'Pendente', icon: Clock, className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
      em_analise: { label: 'Em Análise', icon: AlertCircle, className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      aprovada: { label: 'Aprovada', icon: CheckCircle2, className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      reprovada: { label: 'Reprovada', icon: XCircle, className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
      documentacao_incompleta: { label: 'Documentação Incompleta', icon: FileX, className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
    };

    const config = statusConfig[solicitacao.status];
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

    return <Badge variant="outline" className={config[solicitacao.priority].className}>{config[solicitacao.priority].label}</Badge>;
  };

  const handleApprove = () => {
    if (onApprove) {
      setShowApproveDialog(false);
      onApprove(solicitacao.id);
    }
  };

  const handleConvertToProcesso = async () => {
    if (onConvertToProcesso) {
      setShowConvertDialog(false);
      setIsConverting(true);
      // Simula delay de conversão
      setTimeout(() => {
        onConvertToProcesso(solicitacao);
        setIsConverting(false);
      }, 1500);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle>Solicitação #{solicitacao.id}</CardTitle>
                {getStatusBadge()}
                {getPriorityBadge()}
              </div>
              <p className="text-sm text-muted-foreground">
                Criado em {new Date(solicitacao.createdAt).toLocaleDateString('pt-BR')} às {new Date(solicitacao.createdAt).toLocaleTimeString('pt-BR')}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {/* Botão de Aprovar - Aparece para solicitações em_analise ou pendente */}
              {(solicitacao.status === 'em_analise' || solicitacao.status === 'pendente') && onApprove && (
                <Button 
                  onClick={() => setShowApproveDialog(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Aprovar Solicitação
                </Button>
              )}
              
              {/* Botão de Abrir Processo - Aparece apenas para aprovadas */}
              {solicitacao.status === 'aprovada' && onConvertToProcesso && (
                <Button 
                  onClick={() => setShowConvertDialog(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={isConverting}
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Convertendo...
                    </>
                  ) : (
                    <>
                      <Scale className="h-4 w-4 mr-2" />
                      Abrir Processo
                    </>
                  )}
                </Button>
              )}
              
              {onGenerateReport && (
                <Button variant="outline" onClick={onGenerateReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Relatório
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analysis">Análise IA</TabsTrigger>
          <TabsTrigger value="pescador">Pescador</TabsTrigger>
          <TabsTrigger value="documents">Documentos ({solicitacao.documents.length})</TabsTrigger>
        </TabsList>

        {/* Aba de Análise */}
        <TabsContent value="analysis" className="space-y-4">
          {solicitacao.analysis ? (
            <>
              {/* Score Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Score de Elegibilidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - solicitacao.analysis.score / 100)}`}
                          className={
                            solicitacao.analysis.score >= 70
                              ? 'text-green-600'
                              : solicitacao.analysis.score >= 40
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{solicitacao.analysis.score}%</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        Confiança da IA: {solicitacao.analysis.aiConfidence}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Analisado em {new Date(solicitacao.analysis.analyzedAt).toLocaleDateString('pt-BR')}
                      </p>
                      <div className="mt-2">
                        {solicitacao.analysis.score >= 70 ? (
                          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                            ✓ Documentação adequada para abertura de processo
                          </p>
                        ) : solicitacao.analysis.score >= 40 ? (
                          <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                            ⚠ Requer atenção - documentos adicionais podem ser necessários
                          </p>
                        ) : (
                          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                            ✗ Documentação insuficiente
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Critérios de Elegibilidade */}
              <Card>
                <CardHeader>
                  <CardTitle>Critérios de Elegibilidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {solicitacao.analysis.eligibilityChecks.map((check, index) => {
                      const Icon =
                        check.status === 'approved'
                          ? CheckCircle2
                          : check.status === 'rejected'
                          ? XCircle
                          : check.status === 'warning'
                          ? AlertCircle
                          : Clock;

                      const colorClass =
                        check.status === 'approved'
                          ? 'text-green-600 dark:text-green-400'
                          : check.status === 'rejected'
                          ? 'text-red-600 dark:text-red-400'
                          : check.status === 'warning'
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-gray-600 dark:text-gray-400';

                      return (
                        <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                          <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${colorClass}`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{check.criterion}</p>
                            <p className="text-sm text-muted-foreground">{check.details}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Documentos Faltantes */}
              {solicitacao.analysis.missingDocuments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                      <FileX className="h-5 w-5" />
                      Documentos Faltantes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {solicitacao.analysis.missingDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded bg-yellow-50 dark:bg-yellow-900/20">
                          <FileText className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          <span className="text-sm">{doc.replace('_', ' ').toUpperCase()}</span>
                        </div>
                      ))}
                    </div>
                    {onRequestDocuments && (
                      <Button variant="outline" className="w-full mt-4" onClick={onRequestDocuments}>
                        <Download className="h-4 w-4 mr-2" />
                        Gerar Carta de Solicitação
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Recomendações */}
              {solicitacao.analysis.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recomendações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {solicitacao.analysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex gap-2 text-sm">
                          <span className="text-cyan-600 dark:text-cyan-400">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">Análise pendente</p>
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
                placeholder="Adicione observações sobre esta solicitação..."
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
                  <p className="font-medium">{solicitacao.pescador.nome}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-medium font-mono">{solicitacao.pescador.cpf}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">RG</p>
                  <p className="font-medium font-mono">{solicitacao.pescador.rg}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                  <p className="font-medium">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    {new Date(solicitacao.pescador.dataNascimento).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">
                    <Phone className="h-4 w-4 inline mr-1" />
                    {solicitacao.pescador.telefone}
                  </p>
                </div>
                {solicitacao.pescador.email && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">E-mail</p>
                    <p className="font-medium">
                      <Mail className="h-4 w-4 inline mr-1" />
                      {solicitacao.pescador.email}
                    </p>
                  </div>
                )}
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="font-medium">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    {solicitacao.pescador.endereco}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Colônia de Pescadores</p>
                  <p className="font-medium">{solicitacao.pescador.colonia}</p>
                </div>
                {solicitacao.pescador.rgpNumero && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">RGP</p>
                    <p className="font-medium font-mono">{solicitacao.pescador.rgpNumero}</p>
                  </div>
                )}
                {solicitacao.pescador.rgpDataEmissao && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Data de Emissão RGP</p>
                    <p className="font-medium">
                      {new Date(solicitacao.pescador.rgpDataEmissao).toLocaleDateString('pt-BR')}
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
              <CardTitle>Documentos Enviados</CardTitle>
            </CardHeader>
            <CardContent>
              {solicitacao.documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {solicitacao.documents.map((doc) => (
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
                  <FileX className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Nenhum documento enviado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de Confirmação de Aprovação */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Aprovar Solicitação
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a aprovar esta solicitação. Esta ação irá:
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Alterar o status para "Aprovada"</li>
                <li>Indicar que a documentação está adequada</li>
                <li>Permitir a conversão em processo judicial</li>
                <li>Notificar que o caso está pronto para ajuizamento</li>
              </ul>
              <p className="mt-3 font-medium">
                Confirma a aprovação desta solicitação?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              Sim, Aprovar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de Confirmação de Conversão */}
      <AlertDialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-purple-600" />
              Abrir Processo Judicial
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a converter esta solicitação em um processo judicial. 
              Esta ação irá:
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Criar um novo processo no sistema</li>
                <li>Gerar um número de processo automaticamente</li>
                <li>Transferir todos os documentos para o processo</li>
                <li>Manter a referência à solicitação original</li>
              </ul>
              <p className="mt-3 font-medium">
                Deseja continuar?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConvertToProcesso}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Sim, Abrir Processo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
