import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { CaseStatus, DocumentType } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusColor(status: CaseStatus): string {
  switch (status) {
    case 'aprovado':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'negado':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'em_analise':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'documentacao_incompleta':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'pendente':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getStatusLabel(status: CaseStatus): string {
  switch (status) {
    case 'aprovado':
      return 'Aprovado';
    case 'negado':
      return 'Negado';
    case 'em_analise':
      return 'Em Análise';
    case 'documentacao_incompleta':
      return 'Doc. Incompleta';
    case 'pendente':
      return 'Pendente';
    default:
      return status;
  }
}

export function getDocumentTypeLabel(type: DocumentType): string {
  const labels: Record<DocumentType, string> = {
    rg: 'RG (Registro Geral)',
    cpf: 'CPF',
    rgp: 'RGP (Registro Geral da Pesca)',
    comprovante_residencia: 'Comprovante de Residência',
    declaracao_colonia: 'Declaração da Colônia',
    comprovante_venda: 'Comprovante de Venda',
    carteira_trabalho: 'Carteira de Trabalho',
    outros: 'Outros Documentos',
  };
  return labels[type] || type;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatRG(rg: string): string {
  return rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-100 dark:bg-green-900';
  if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900';
  return 'bg-red-100 dark:bg-red-900';
}
