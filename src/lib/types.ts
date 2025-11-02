// Tipos de dados do sistema

export type DocumentType = 
  | 'rg'
  | 'cpf'
  | 'rgp'
  | 'comprovante_residencia'
  | 'declaracao_colonia'
  | 'comprovante_venda'
  | 'carteira_trabalho'
  | 'outros';

export type CaseStatus = 
  | 'pendente'
  | 'em_analise'
  | 'aprovado'
  | 'negado'
  | 'documentacao_incompleta';

export type SolicitacaoStatus =
  | 'pendente'
  | 'em_analise'
  | 'aprovada'
  | 'reprovada'
  | 'documentacao_incompleta';

export type ProcessoStatus =
  | 'em_andamento'
  | 'aguardando_documentos'
  | 'deferido'
  | 'indeferido'
  | 'arquivado';

export type DocumentStatus = 'presente' | 'ausente' | 'invalido' | 'vencido';

export interface Document {
  id: string;
  type: DocumentType;
  name: string;
  url: string;
  uploadedAt: Date;
  status: DocumentStatus;
  expirationDate?: Date;
}

export interface Pescador {
  id: string;
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: Date;
  endereco: string;
  colonia: string;
  rgpNumero?: string;
  rgpDataEmissao?: Date;
  telefone: string;
  email?: string;
}

export interface EligibilityCheck {
  criterion: string;
  status: 'approved' | 'rejected' | 'pending' | 'warning';
  details: string;
}

export interface Analysis {
  id: string;
  caseId: string;
  score: number; // 0-100
  eligibilityChecks: EligibilityCheck[];
  missingDocuments: DocumentType[];
  inconsistencies: string[];
  recommendations: string[];
  analyzedAt: Date;
  aiConfidence: number; // 0-100
}

export interface Case {
  id: string;
  pescador: Pescador;
  status: CaseStatus;
  documents: Document[];
  analysis?: Analysis;
  createdAt: Date;
  updatedAt: Date;
  lawyerNotes?: string;
  priority: 'baixa' | 'media' | 'alta';
  // Informações processuais
  numeroProcesso?: string;
  tribunal?: string;
  orgaoJulgador?: string;
  classeProcessual?: string;
  assunto?: string;
  situacao?: string;
  dataAjuizamento?: Date;
  movimentacoes?: number;
  ultimaMovimentacao?: Date;
}

// Solicitação - Pré-análise de documentos
export interface Solicitacao {
  id: string;
  pescador: Pescador;
  status: SolicitacaoStatus;
  documents: Document[];
  analysis?: Analysis;
  createdAt: Date;
  updatedAt: Date;
  lawyerNotes?: string;
  priority: 'baixa' | 'media' | 'alta';
}

// Processo Judicial
export interface Processo {
  id: string;
  pescador: Pescador;
  status: ProcessoStatus;
  documents: Document[];
  numeroProcesso: string;
  tribunal: string;
  orgaoJulgador?: string;
  classeProcessual?: string;
  assunto?: string;
  situacao?: string;
  dataAjuizamento: Date;
  movimentacoes?: number;
  ultimaMovimentacao?: Date;
  createdAt: Date;
  updatedAt: Date;
  lawyerNotes?: string;
  priority: 'baixa' | 'media' | 'alta';
  // Referência à solicitação original (se foi criado a partir de uma)
  solicitacaoId?: string;
}

export interface DefesoPeriod {
  id: string;
  regiao: string;
  especie: string;
  inicio: Date;
  fim: Date;
  anoReferencia: number;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: 'legislacao' | 'procedimentos' | 'faq' | 'modelos';
  content: string;
  lastUpdated: Date;
  tags: string[];
}

export type NotificationType = 
  | 'case_created'
  | 'analysis_complete'
  | 'status_change'
  | 'document_missing'
  | 'deadline_approaching'
  | 'system'
  | 'alert';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  caseId?: string;
  isRead: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}
