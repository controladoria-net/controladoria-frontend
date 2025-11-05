'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  FileText, 
  User, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FileCheck,
  Building2,
  CreditCard,
  Fingerprint,
  Activity,
  DollarSign,
  Clock,
  MapPinned,
  Scale,
  Users,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import type { 
  ExtractedDocumentData, 
  RGPDTO, 
  CAEPFDTO, 
  ComprovanteResidenciaDTO,
  CNISDTO,
  TermoRepresentacaoDTO,
  GPSDTO,
  BiometriaDTO,
  DocumentoIdentidadeDTO,
  REAPDTO
} from '../lib/types';
import { Alert, AlertDescription } from './ui/alert';

interface ExtractedDataViewProps {
  extractedData: ExtractedDocumentData[];
}

export function ExtractedDataView({ extractedData }: ExtractedDataViewProps) {
  const formatDate = (date?: string) => {
    if (!date) return 'Não informado';
    try {
      return new Date(date).toLocaleDateString('pt-BR');
    } catch {
      return date;
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatAddress = (endereco?: Record<string, any>) => {
    if (!endereco) return 'Não informado';
    const parts = [];
    if (endereco.logradouro) parts.push(endereco.logradouro);
    if (endereco.numero) parts.push(`nº ${endereco.numero}`);
    if (endereco.bairro) parts.push(endereco.bairro);
    if (endereco.cidade) parts.push(endereco.cidade);
    if (endereco.estado) parts.push(endereco.estado);
    if (endereco.cep) parts.push(`CEP: ${endereco.cep}`);
    return parts.length > 0 ? parts.join(', ') : JSON.stringify(endereco);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 90) return <CheckCircle2 className="h-4 w-4" />;
    if (confidence >= 70) return <AlertCircle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  const renderRGP = (data: RGPDTO, confidence: number, extractedAt: Date) => (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <FileCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Registro Geral da Pesca (RGP)</CardTitle>
              <p className="text-xs text-muted-foreground">
                Extraído em {extractedAt.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
          <Badge className={getConfidenceColor(confidence)}>
            {getConfidenceIcon(confidence)}
            <span className="ml-1">{confidence}% confiança</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Nome Completo</span>
            </div>
            <p className="font-medium">{data.nome || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>CPF</span>
            </div>
            <p className="font-medium font-mono">{data.cpf || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileCheck className="h-4 w-4" />
              <span>Número RGP</span>
            </div>
            <p className="font-medium">{data.rgp || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Atividade</span>
            </div>
            <p className="font-medium">{data.atividade || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Scale className="h-4 w-4" />
              <span>Categoria</span>
            </div>
            <p className="font-medium">{data.categoria || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Data de Emissão</span>
            </div>
            <p className="font-medium">{formatDate(data.data_emissao)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Primeiro Registro</span>
            </div>
            <p className="font-medium">{formatDate(data.data_primeiro_registro)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>Situação</span>
            </div>
            <Badge variant={data.situacao?.toLowerCase().includes('ativo') ? 'default' : 'secondary'}>
              {data.situacao || 'Não informado'}
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>Órgão Emissor</span>
            </div>
            <p className="font-medium">{data.orgao_emissor || 'Não informado'}</p>
          </div>
        </div>

        {data.endereco && (
          <>
            <Separator />
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Endereço</span>
              </div>
              <p className="font-medium text-sm">{formatAddress(data.endereco)}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  const renderCAEPF = (data: CAEPFDTO, confidence: number, extractedAt: Date) => (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">CAEPF - E-CAC</CardTitle>
              <p className="text-xs text-muted-foreground">
                Extraído em {extractedAt.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
          <Badge className={getConfidenceColor(confidence)}>
            {getConfidenceIcon(confidence)}
            <span className="ml-1">{confidence}% confiança</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Nome Completo</span>
            </div>
            <p className="font-medium">{data.nome || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>CPF</span>
            </div>
            <p className="font-medium font-mono">{data.cpf || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileCheck className="h-4 w-4" />
              <span>Número CAEPF</span>
            </div>
            <p className="font-medium">{data.caepf || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Data de Inscrição</span>
            </div>
            <p className="font-medium">{formatDate(data.data_inscricao)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>Situação</span>
            </div>
            <Badge variant={data.situacao?.toLowerCase().includes('ativo') ? 'default' : 'secondary'}>
              {data.situacao || 'Não informado'}
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Atividade Principal</span>
            </div>
            <p className="font-medium text-sm">{data.atividade_principal || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Código CNAE</span>
            </div>
            <p className="font-medium font-mono">{data.codigo_cnae || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPinned className="h-4 w-4" />
              <span>Município/Estado</span>
            </div>
            <p className="font-medium">{data.municipio && data.estado ? `${data.municipio}/${data.estado}` : 'Não informado'}</p>
          </div>
        </div>

        {data.endereco && (
          <>
            <Separator />
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Endereço Completo</span>
              </div>
              <p className="font-medium text-sm">{formatAddress(data.endereco)}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  const renderComprovanteResidencia = (data: ComprovanteResidenciaDTO, confidence: number, extractedAt: Date) => (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-500 rounded-lg">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Declaração de Residência</CardTitle>
              <p className="text-xs text-muted-foreground">
                Extraído em {extractedAt.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
          <Badge className={getConfidenceColor(confidence)}>
            {getConfidenceIcon(confidence)}
            <span className="ml-1">{confidence}% confiança</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Nome Completo</span>
            </div>
            <p className="font-medium">{data.nome || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>CPF</span>
            </div>
            <p className="font-medium font-mono">{data.cpf || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileCheck className="h-4 w-4" />
              <span>Tipo de Documento</span>
            </div>
            <p className="font-medium">{data.tipo_documento || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Data de Emissão</span>
            </div>
            <p className="font-medium">{formatDate(data.data_emissao)}</p>
          </div>

          <div className="space-y-1 md:col-span-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>Entidade Emissora</span>
            </div>
            <p className="font-medium">{data.entidade_emissora || 'Não informado'}</p>
          </div>
        </div>

        {data.endereco && (
          <>
            <Separator />
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Endereço</span>
              </div>
              <p className="font-medium text-sm">{formatAddress(data.endereco)}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  const renderCNIS = (data: CNISDTO, confidence: number, extractedAt: Date) => (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">CNIS - Meu INSS</CardTitle>
              <p className="text-xs text-muted-foreground">
                Extraído em {extractedAt.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
          <Badge className={getConfidenceColor(confidence)}>
            {getConfidenceIcon(confidence)}
            <span className="ml-1">{confidence}% confiança</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Nome Completo</span>
            </div>
            <p className="font-medium">{data.nome || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>CPF</span>
            </div>
            <p className="font-medium font-mono">{data.cpf || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileCheck className="h-4 w-4" />
              <span>NIS</span>
            </div>
            <p className="font-medium font-mono">{data.nis || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Scale className="h-4 w-4" />
              <span>Categoria</span>
            </div>
            <p className="font-medium">{data.categoria || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Início da Atividade</span>
            </div>
            <p className="font-medium">{formatDate(data.data_inicio_atividade)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Fim da Atividade</span>
            </div>
            <p className="font-medium">{formatDate(data.data_fim_atividade)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>Situação do Vínculo</span>
            </div>
            <Badge variant={data.situacao_vinculo?.toLowerCase().includes('ativo') ? 'default' : 'secondary'}>
              {data.situacao_vinculo || 'Não informado'}
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              <span>Período Aquisitivo Defeso</span>
            </div>
            <Badge variant={data.periodo_aquisitivo_defeso ? 'default' : 'secondary'}>
              {data.periodo_aquisitivo_defeso ? 'Sim' : 'Não'}
            </Badge>
          </div>
        </div>

        {data.outros_vinculos && data.outros_vinculos.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4" />
                <span>Outros Vínculos</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.outros_vinculos.map((vinculo, idx) => (
                  <Badge key={idx} variant="outline">{vinculo}</Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {data.beneficios_ativos && data.beneficios_ativos.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                <span>Benefícios Ativos</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.beneficios_ativos.map((beneficio, idx) => (
                  <Badge key={idx} variant="default">{beneficio}</Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  const renderTermoRepresentacao = (data: TermoRepresentacaoDTO, confidence: number, extractedAt: Date) => (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500 rounded-lg">
              <Scale className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Termo de Representação e Procuração</CardTitle>
              <p className="text-xs text-muted-foreground">
                Extraído em {extractedAt.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
          <Badge className={getConfidenceColor(confidence)}>
            {getConfidenceIcon(confidence)}
            <span className="ml-1">{confidence}% confiança</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1 md:col-span-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Nome do Pescador</span>
            </div>
            <p className="font-medium">{data.nome_pescador || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Data de Emissão</span>
            </div>
            <p className="font-medium">{formatDate(data.data_emissao)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Validade</span>
            </div>
            <p className="font-medium">{formatDate(data.validade)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              <span>Assinatura do Pescador</span>
            </div>
            <Badge variant={data.assinatura_pescador ? 'default' : 'destructive'}>
              {data.assinatura_pescador ? 'Assinado' : 'Não Assinado'}
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>Órgão Emissor</span>
            </div>
            <p className="font-medium">{data.orgao_emissor || 'Não informado'}</p>
          </div>
        </div>

        {data.advogados && data.advogados.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Advogados Responsáveis</span>
              </div>
              <div className="space-y-1">
                {data.advogados.map((advogado, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <Scale className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{advogado}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {!data.assinatura_pescador && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              O termo não contém assinatura do pescador. É necessário providenciar assinatura para prosseguir.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  const renderGPS = (data: GPSDTO, confidence: number, extractedAt: Date) => (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">GPS - Guia da Previdência Social</CardTitle>
              <p className="text-xs text-muted-foreground">
                Extraído em {extractedAt.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
          <Badge className={getConfidenceColor(confidence)}>
            {getConfidenceIcon(confidence)}
            <span className="ml-1">{confidence}% confiança</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Nome Completo</span>
            </div>
            <p className="font-medium">{data.nome || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>CPF</span>
            </div>
            <p className="font-medium font-mono">{data.cpf || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileCheck className="h-4 w-4" />
              <span>Código de Pagamento</span>
            </div>
            <p className="font-medium font-mono">{data.codigo_pagamento || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Competência</span>
            </div>
            <p className="font-medium">{data.competencia || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Valor Pago</span>
            </div>
            <p className="font-medium text-green-600">{formatCurrency(data.valor_pago)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Data de Pagamento</span>
            </div>
            <p className="font-medium">{formatDate(data.data_pagamento)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>Banco</span>
            </div>
            <p className="font-medium">{data.banco || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Período de Apuração</span>
            </div>
            <p className="font-medium">{data.periodo_apuracao || 'Não informado'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderBiometria = (data: BiometriaDTO, confidence: number, extractedAt: Date) => (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-pink-500 rounded-lg">
              <Fingerprint className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Biometria - TSE</CardTitle>
              <p className="text-xs text-muted-foreground">
                Extraído em {extractedAt.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
          <Badge className={getConfidenceColor(confidence)}>
            {getConfidenceIcon(confidence)}
            <span className="ml-1">{confidence}% confiança</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Nome Completo</span>
            </div>
            <p className="font-medium">{data.nome || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>CPF</span>
            </div>
            <p className="font-medium font-mono">{data.cpf || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileCheck className="h-4 w-4" />
              <span>Título de Eleitor</span>
            </div>
            <p className="font-medium font-mono">{data.titulo_eleitor || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPinned className="h-4 w-4" />
              <span>Município/Estado</span>
            </div>
            <p className="font-medium">{data.municipio && data.estado ? `${data.municipio}/${data.estado}` : 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Fingerprint className="h-4 w-4" />
              <span>Biometria Coletada</span>
            </div>
            <Badge variant={data.biometria_coletada ? 'default' : 'destructive'}>
              {data.biometria_coletada ? 'Coletada' : 'Não Coletada'}
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Data de Emissão</span>
            </div>
            <p className="font-medium">{formatDate(data.data_emissao)}</p>
          </div>
        </div>

        {!data.biometria_coletada && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Biometria não coletada. É necessário comparecer ao TSE para coleta biométrica.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  const renderDocumentoIdentidade = (data: DocumentoIdentidadeDTO, confidence: number, extractedAt: Date) => (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-500 rounded-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Novo CIN (Identidade) e CPF</CardTitle>
              <p className="text-xs text-muted-foreground">
                Extraído em {extractedAt.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
          <Badge className={getConfidenceColor(confidence)}>
            {getConfidenceIcon(confidence)}
            <span className="ml-1">{confidence}% confiança</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Nome Completo</span>
            </div>
            <p className="font-medium">{data.nome || 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>CPF</span>
            </div>
            <p className="font-medium font-mono">{data.cpf || 'Não informado'}</p>
          </div>

          <div className="space-y-1 md:col-span-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              <span>Status do Documento</span>
            </div>
            <Badge variant={data.documento_existe ? 'default' : 'destructive'}>
              {data.documento_existe ? 'Documento Válido' : 'Documento Inválido ou Inexistente'}
            </Badge>
          </div>
        </div>

        {!data.documento_existe && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Documento de identidade não encontrado ou inválido. Pescador deve providenciar novo CIN.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  const renderREAP = (data: REAPDTO, confidence: number, extractedAt: Date) => (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-500 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">REAP 2021-2024</CardTitle>
              <p className="text-sm text-muted-foreground">
                Relatório de Exercício da Atividade Pesqueira
              </p>
              <p className="text-xs text-muted-foreground">
                Extraído em {extractedAt.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
          <Badge className={getConfidenceColor(confidence)}>
            {getConfidenceIcon(confidence)}
            <span className="ml-1">{confidence}% confiança</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              <span>Status do Relatório</span>
            </div>
            <Badge variant={data.completo ? 'default' : 'destructive'} className="text-base px-4 py-2">
              {data.completo ? '✓ Relatório Completo (2021-2024)' : '✗ Relatório Incompleto'}
            </Badge>
          </div>

          {data.anos_verificados && data.anos_verificados.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Anos Verificados ({data.anos_verificados.length} de 4)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.anos_verificados.map((ano) => (
                  <Badge key={ano} variant="default" className="text-base px-3 py-1">
                    ✓ {ano}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {data.anos_faltando && data.anos_faltando.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-red-600">Anos Faltando ({data.anos_faltando.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.anos_faltando.map((ano) => (
                    <Badge key={ano} variant="destructive" className="text-base px-3 py-1">
                      ✗ {ano}
                    </Badge>
                  ))}
                </div>
                <Alert variant="destructive" className="mt-3">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    O REAP não está completo. É necessário apresentar relatórios para {data.anos_faltando.length === 1 ? 'o ano' : 'os anos'}: {data.anos_faltando.join(', ')}.
                  </AlertDescription>
                </Alert>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (extractedData.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Nenhum dado extraído disponível. A análise dos documentos ainda não foi realizada.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Dados Extraídos dos Documentos</h2>
          <p className="text-muted-foreground mt-1">
            Informações extraídas automaticamente pela IA com OCR de {extractedData.length} documento(s)
          </p>
        </div>
        <Badge variant="outline" className="text-base px-4 py-2">
          {extractedData.length} {extractedData.length === 1 ? 'documento analisado' : 'documentos analisados'}
        </Badge>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-6">
        {extractedData.map((item, index) => {
          const { documentType, extractedData: data, confidence, extractedAt } = item;

          // Renderiza o card apropriado baseado no tipo de documento
          if ('rgp' in data) {
            return <div key={index}>{renderRGP(data as RGPDTO, confidence, extractedAt)}</div>;
          } else if ('caepf' in data) {
            return <div key={index}>{renderCAEPF(data as CAEPFDTO, confidence, extractedAt)}</div>;
          } else if ('tipo_documento' in data) {
            return <div key={index}>{renderComprovanteResidencia(data as ComprovanteResidenciaDTO, confidence, extractedAt)}</div>;
          } else if ('nis' in data) {
            return <div key={index}>{renderCNIS(data as CNISDTO, confidence, extractedAt)}</div>;
          } else if ('nome_pescador' in data) {
            return <div key={index}>{renderTermoRepresentacao(data as TermoRepresentacaoDTO, confidence, extractedAt)}</div>;
          } else if ('codigo_pagamento' in data) {
            return <div key={index}>{renderGPS(data as GPSDTO, confidence, extractedAt)}</div>;
          } else if ('biometria_coletada' in data) {
            return <div key={index}>{renderBiometria(data as BiometriaDTO, confidence, extractedAt)}</div>;
          } else if ('documento_existe' in data) {
            return <div key={index}>{renderDocumentoIdentidade(data as DocumentoIdentidadeDTO, confidence, extractedAt)}</div>;
          } else if ('anos_verificados' in data) {
            return <div key={index}>{renderREAP(data as REAPDTO, confidence, extractedAt)}</div>;
          }

          return null;
        })}
      </div>
    </div>
  );
}
