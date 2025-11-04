import { Case, Solicitacao, Processo } from '../lib/types';
import { formatDate, getDocumentTypeLabel } from '../lib/utils';

export function generateTextReport(caseData: Case): string {
  const { pescador, analysis, documents } = caseData;

  const report = `
═══════════════════════════════════════════════════════════════════
            RELATÓRIO DE ANÁLISE DE SEGURO-DEFESO
═══════════════════════════════════════════════════════════════════

DADOS DO PESCADOR
─────────────────────────────────────────────────────────────────
Nome Completo: ${pescador.nome}
CPF: ${pescador.cpf}
RG: ${pescador.rg}
Endereço: ${pescador.endereco}
Colônia de Pescadores: ${pescador.colonia}
${pescador.rgpNumero ? `RGP: ${pescador.rgpNumero}` : ''}
${pescador.rgpDataEmissao ? `Data de Emissão RGP: ${formatDate(pescador.rgpDataEmissao)}` : ''}
Telefone: ${pescador.telefone}
${pescador.email ? `E-mail: ${pescador.email}` : ''}

─────────────────────────────────────────────────────────────────

RESULTADO DA ANÁLISE
─────────────────────────────────────────────────────────────────
Score de Aprovação: ${analysis?.score}%
Confiança da IA: ${analysis?.aiConfidence}%
Data da Análise: ${analysis ? formatDate(analysis.analyzedAt) : 'Não analisado'}

Status do Caso: ${caseData.status.toUpperCase().replace('_', ' ')}

─────────────────────────────────────────────────────────────────

CRITÉRIOS DE ELEGIBILIDADE
─────────────────────────────────────────────────────────────────
${analysis?.eligibilityChecks.map((check, index) => `
${index + 1}. ${check.criterion}
   Status: ${check.status === 'approved' ? '✓ APROVADO' : check.status === 'rejected' ? '✗ REPROVADO' : '⚠ ATENÇÃO'}
   Detalhes: ${check.details}
`).join('\n') || 'Nenhuma análise disponível'}

─────────────────────────────────────────────────────────────────

DOCUMENTOS APRESENTADOS (${documents.length})
─────────────────────────────────────────────────────────────────
${documents.map((doc, index) => `
${index + 1}. ${getDocumentTypeLabel(doc.type)}
   Arquivo: ${doc.name}
   Status: ${doc.status === 'presente' ? '✓ Presente' : doc.status === 'invalido' ? '✗ Inválido' : '- Ausente'}
   Data de Upload: ${formatDate(doc.uploadedAt)}
`).join('\n')}

${analysis && analysis.missingDocuments.length > 0 ? `
─────────────────────────────────────────────────────────────────

DOCUMENTOS FALTANTES (${analysis.missingDocuments.length})
─────────────────────────────────────────────────────────────────
${analysis.missingDocuments.map((docType, index) => `
${index + 1}. ${getDocumentTypeLabel(docType)}
`).join('\n')}
` : ''}

${analysis && analysis.inconsistencies.length > 0 ? `
─────────────────────────────────────────────────────────────────

INCONSISTÊNCIAS IDENTIFICADAS (${analysis.inconsistencies.length})
─────────────────────────────────────────────────────────────────
${analysis.inconsistencies.map((issue, index) => `
${index + 1}. ${issue}
`).join('\n')}
` : ''}

${analysis && analysis.recommendations.length > 0 ? `
─────────────────────────────────────────────────────────────────

RECOMENDAÇÕES
─────────────────────────────────────────────────────────────────
${analysis.recommendations.map((rec, index) => `
${index + 1}. ${rec}
`).join('\n')}
` : ''}

${caseData.lawyerNotes ? `
─────────────────────────────────────────────────────────────────

OBSERVAÇÕES DO ADVOGADO
─────────────────────────────────────────────────────────────────
${caseData.lawyerNotes}
` : ''}

─────────────────────────────────────────────────────────────────

INFORMAÇÕES DO RELATÓRIO
─────────────────────────────────────────────────────────────────
Data de Criação do Caso: ${formatDate(caseData.createdAt)}
Última Atualização: ${formatDate(caseData.updatedAt)}
Prioridade: ${caseData.priority.toUpperCase()}

─────────────────────────────────────────────────────────────────

DISCLAIMER
─────────────────────────────────────────────────────────────────
Este relatório foi gerado automaticamente por sistema de análise
com auxílio de Inteligência Artificial. A análise final e a 
responsabilidade pela verificação dos documentos e elegibilidade
são do profissional jurídico responsável.

A IA é uma ferramenta de auxílio e não substitui a análise
jurídica humana especializada.

═══════════════════════════════════════════════════════════════════
        Relatório gerado em ${formatDate(new Date())}
═══════════════════════════════════════════════════════════════════
`;

  return report;
}

export function downloadReport(caseData: Case) {
  const report = generateTextReport(caseData);
  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `relatorio_${caseData.pescador.nome.replace(/\s+/g, '_')}_${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function generateDocumentRequest(caseData: Case): string {
  const { pescador, analysis } = caseData;

  const letter = `
═══════════════════════════════════════════════════════════════════
         SOLICITAÇÃO DE DOCUMENTOS COMPLEMENTARES
═══════════════════════════════════════════════════════════════════

${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}

Prezado(a) ${pescador.nome},

Em análise ao seu processo de solicitação do benefício Seguro-Defeso,
identificamos a necessidade de apresentação dos seguintes documentos
complementares:

DOCUMENTOS SOLICITADOS:
─────────────────────────────────────────────────────────────────
${analysis?.missingDocuments.map((docType, index) => `
${index + 1}. ${getDocumentTypeLabel(docType)}
`).join('\n') || 'Nenhum documento faltante'}

─────────────────────────────────────────────────────────────────

OBSERVAÇÕES IMPORTANTES:
${analysis?.inconsistencies.map((issue, index) => `
${index + 1}. ${issue}
`).join('\n') || 'Nenhuma observação adicional'}

─────────────────────────────────────────────────────────────────

PRAZO PARA APRESENTAÇÃO:
Os documentos deverão ser apresentados no prazo de 15 (quinze) dias
corridos a partir do recebimento desta solicitação.

FORMA DE APRESENTAÇÃO:
Os documentos podem ser enviados:
- Pessoalmente em nosso escritório
- Por e-mail: documentos@escritorio.com.br
- Via WhatsApp: (13) 99999-9999

Permanecemos à disposição para quaisquer esclarecimentos.

Atenciosamente,

_________________________________
Escritório de Advocacia
OAB/SP XXXXX

═══════════════════════════════════════════════════════════════════
`;

  return letter;
}

export function downloadDocumentRequest(caseData: Case) {
  const letter = generateDocumentRequest(caseData);
  const blob = new Blob([letter], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `solicitacao_documentos_${caseData.pescador.nome.replace(/\s+/g, '_')}_${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// ============================================================================
// FUNÇÕES PARA SOLICITAÇÕES
// ============================================================================

export function generateSolicitacaoReport(solicitacao: Solicitacao): string {
  const { pescador, analysis, documents } = solicitacao;

  const report = `
═══════════════════════════════════════════════════════════════════
          RELATÓRIO DE ANÁLISE DE SOLICITAÇÃO - SEGURO-DEFESO
═══════════════════════════════════════════════════════════════════

DADOS DO PESCADOR
─────────────────────────────────────────────────────────────────
Nome Completo: ${pescador.nome}
CPF: ${pescador.cpf}
RG: ${pescador.rg}
Endereço: ${pescador.endereco}
Colônia de Pescadores: ${pescador.colonia}
${pescador.rgpNumero ? `RGP: ${pescador.rgpNumero}` : ''}
${pescador.rgpDataEmissao ? `Data de Emissão RGP: ${formatDate(pescador.rgpDataEmissao)}` : ''}
Telefone: ${pescador.telefone}
${pescador.email ? `E-mail: ${pescador.email}` : ''}

─────────────────────────────────────────────────────────────────

RESULTADO DA ANÁLISE IA
─────────────────────────────────────────────────────────────────
Score de Aprovação: ${analysis?.score}%
Confiança da IA: ${analysis?.aiConfidence}%
Data da Análise: ${analysis ? formatDate(analysis.analyzedAt) : 'Aguardando análise'}

Status da Solicitação: ${solicitacao.status.toUpperCase().replace('_', ' ')}
Prioridade: ${solicitacao.priority.toUpperCase()}

─────────────────────────────────────────────────────────────────

CRITÉRIOS DE ELEGIBILIDADE
─────────────────────────────────────────────────────────────────
${analysis?.eligibilityChecks.map((check, index) => `
${index + 1}. ${check.criterion}
   Status: ${check.status === 'approved' ? '✓ APROVADO' : check.status === 'rejected' ? '✗ REPROVADO' : '⚠ ATENÇÃO'}
   Detalhes: ${check.details}
`).join('\n') || 'Nenhuma análise disponível'}

─────────────────────────────────────────────────────────────────

DOCUMENTOS APRESENTADOS (${documents.length})
─────────────────────────────────────────────────────────────────
${documents.map((doc, index) => `
${index + 1}. ${getDocumentTypeLabel(doc.type)}
   Arquivo: ${doc.name}
   Status: ${doc.status === 'presente' ? '✓ Presente' : doc.status === 'invalido' ? '✗ Inválido' : '- Ausente'}
   Data de Upload: ${formatDate(doc.uploadedAt)}
`).join('\n')}

${analysis && analysis.missingDocuments.length > 0 ? `
─────────────────────────────────────────────────────────────────

DOCUMENTOS FALTANTES (${analysis.missingDocuments.length})
─────────────────────────────────────────────────────────────────
${analysis.missingDocuments.map((docType, index) => `
${index + 1}. ${getDocumentTypeLabel(docType)}
`).join('\n')}
` : ''}

${analysis && analysis.recommendations.length > 0 ? `
─────────────────────────────────────────────────────────────────

RECOMENDAÇÕES
─────────────────────────────────────────────────────────────────
${analysis.recommendations.map((rec, index) => `
${index + 1}. ${rec}
`).join('\n')}
` : ''}

${solicitacao.lawyerNotes ? `
─────────────────────────────────────────────────────────────────

OBSERVAÇÕES DO ADVOGADO
─────────────────────────────────────────────────────────────────
${solicitacao.lawyerNotes}
` : ''}

─────────────────────────────────────────────────────────────────

PRÓXIMOS PASSOS
─────────────────────────────────────────────────────────────────
${solicitacao.status === 'aprovada' ? 
'✓ Solicitação APROVADA para abertura de processo judicial.\n  Recomenda-se prosseguir com a ação judicial.' : 
solicitacao.status === 'documentacao_incompleta' ?
'⚠ Documentação INCOMPLETA.\n  Solicitar documentos faltantes ao cliente antes de prosseguir.' :
solicitacao.status === 'reprovada' ?
'✗ Solicitação REPROVADA.\n  Informar cliente sobre inelegibilidade e motivos.' :
'→ Análise em andamento. Aguardar conclusão.'}

─────────────────────────────────────────────────────────────────

INFORMAÇÕES DO RELATÓRIO
─────────────────────────────────────────────────────────────────
ID da Solicitação: ${solicitacao.id}
Data de Criação: ${formatDate(solicitacao.createdAt)}
Última Atualização: ${formatDate(solicitacao.updatedAt)}

─────────────────────────────────────────────────────────────────

DISCLAIMER
─────────────────────────────────────────────────────────────────
Este relatório foi gerado automaticamente por sistema de análise
com auxílio de Inteligência Artificial. A análise final e a 
responsabilidade pela verificação dos documentos e elegibilidade
são do profissional jurídico responsável.

A IA é uma ferramenta de auxílio e não substitui a análise
jurídica humana especializada.

═══════════════════════════════════════════════════════════════════
      Relatório gerado em ${formatDate(new Date())}
═══════════════════════════════════════════════════════════════════
`;

  return report;
}

export function downloadSolicitacaoReport(solicitacao: Solicitacao) {
  const report = generateSolicitacaoReport(solicitacao);
  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `solicitacao_${solicitacao.pescador.nome.replace(/\s+/g, '_')}_${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// ============================================================================
// FUNÇÕES PARA PROCESSOS
// ============================================================================

export function generateProcessoReport(processo: Processo): string {
  const { pescador, documents } = processo;

  const report = `
═══════════════════════════════════════════════════════════════════
           RELATÓRIO DE PROCESSO JUDICIAL - SEGURO-DEFESO
═══════════════════════════════════════════════════════════════════

INFORMAÇÕES PROCESSUAIS
─────────────────────────────────────────────────────────────────
Número do Processo: ${processo.numeroProcesso}
Tribunal: ${processo.tribunal}
${processo.orgaoJulgador ? `Órgão Julgador: ${processo.orgaoJulgador}` : ''}
${processo.classeProcessual ? `Classe Processual: ${processo.classeProcessual}` : ''}
${processo.assunto ? `Assunto: ${processo.assunto}` : ''}

Status do Processo: ${processo.status.toUpperCase().replace('_', ' ')}
${processo.situacao ? `Situação Atual: ${processo.situacao}` : ''}

Data de Ajuizamento: ${formatDate(processo.dataAjuizamento)}
${processo.ultimaMovimentacao ? `Última Movimentação: ${formatDate(processo.ultimaMovimentacao)}` : ''}
Movimentações: ${processo.movimentacoes || 0}

─────────────────────────────────────────────────────────────────

DADOS DO PESCADOR (AUTOR)
─────────────────────────────────────────────────────────────────
Nome Completo: ${pescador.nome}
CPF: ${pescador.cpf}
RG: ${pescador.rg}
Endereço: ${pescador.endereco}
Colônia de Pescadores: ${pescador.colonia}
${pescador.rgpNumero ? `RGP: ${pescador.rgpNumero}` : ''}
${pescador.rgpDataEmissao ? `Data de Emissão RGP: ${formatDate(pescador.rgpDataEmissao)}` : ''}
Telefone: ${pescador.telefone}
${pescador.email ? `E-mail: ${pescador.email}` : ''}

─────────────────────────────────────────────────────────────────

DOCUMENTOS DO PROCESSO (${documents.length})
─────────────────────────────────────────────────────────────────
${documents.map((doc, index) => `
${index + 1}. ${getDocumentTypeLabel(doc.type)}
   Arquivo: ${doc.name}
   Data de Juntada: ${formatDate(doc.uploadedAt)}
`).join('\n')}

─────────────────────────────────────────────────────────────────

ANÁLISE DO PROCESSO
─────────────────────────────────────────────────────────────────
Tempo em Tramitação: ${Math.floor((new Date().getTime() - new Date(processo.dataAjuizamento).getTime()) / (1000 * 60 * 60 * 24))} dias
Prioridade: ${processo.priority.toUpperCase()}

${processo.status === 'deferido' ? 
'✓ PROCESSO DEFERIDO\n  Sentença favorável. Cliente pode receber o benefício do Seguro-Defeso.' : 
processo.status === 'indeferido' ?
'✗ PROCESSO INDEFERIDO\n  Avaliar possibilidade de recurso com o cliente.' :
processo.status === 'aguardando_documentos' ?
'⚠ AGUARDANDO DOCUMENTOS\n  Providenciar documentação complementar solicitada pelo tribunal.' :
'→ Processo em andamento normal.'}

${processo.lawyerNotes ? `
─────────────────────────────────────────────────────────────────

OBSERVAÇÕES DO ADVOGADO
─────────────────────────────────────────────────────────────────
${processo.lawyerNotes}
` : ''}

${processo.solicitacaoId ? `
─────────────────────────────────────────────────────────────────

ORIGEM
─────────────────────────────────────────────────────────────────
Este processo foi originado da Solicitação #${processo.solicitacaoId}
` : ''}

─────────────────────────────────────────────────────────────────

INFORMAÇÕES DO RELATÓRIO
─────────────────────────────────────────────────────────────────
ID do Processo (Sistema): ${processo.id}
Data de Registro: ${formatDate(processo.createdAt)}
Última Atualização: ${formatDate(processo.updatedAt)}

═══════════════════════════════════════════════════════════════════
      Relatório gerado em ${formatDate(new Date())}
═══════════════════════════════════════════════════════════════════
`;

  return report;
}

export function downloadProcessoReport(processo: Processo) {
  const report = generateProcessoReport(processo);
  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `processo_${processo.numeroProcesso.replace(/[^\d]/g, '_')}_${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
