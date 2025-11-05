# Lista de Documentos Atualizada - Seguro-Defeso do Pescador Artesanal

## Documentos Obrigatórios (9 documentos)

1. **Certificado de Regularidade – PesqBrasil**
   - Tipo: `certificado_regularidade_pesqbrasil`
   - Fonte: Sistema PesqBrasil
   
2. **CAEPF – E-CAC**
   - Tipo: `caepf_ecac`
   - Fonte: Portal E-CAC da Receita Federal

3. **Declaração de Residência (Assinado pelo Pescador)**
   - Tipo: `declaracao_residencia`
   - Obs: Deve conter assinatura do pescador

4. **CNIS – Meu INSS**
   - Tipo: `cnis_meu_inss`
   - Fonte: Portal Meu INSS

5. **Termo de Representação e Procuração (Assinado)**
   - Tipo: `termo_representacao_procuracao`
   - Obs: Deve conter assinatura do pescador

6. **GPS e Comprovante de GPS – E-Social**
   - Tipo: `gps_comprovante_esocial`
   - Fonte: Sistema E-Social

7. **Biometria – Site TSE**
   - Tipo: `biometria_tse`
   - Fonte: Portal do Tribunal Superior Eleitoral

8. **Novo CIN (Identidade) e CPF**
   - Tipo: `novo_cin_cpf`
   - Obs: Responsabilidade do pescador

9. **REAP 2021-2024 – PesqBrasil**
   - Tipo: `reap_2021_2024`
   - Nome completo: Relatório de Exercício da Atividade Pesqueira
   - Período: Entre os anos de 2021 a 2024
   - Fonte: Sistema PesqBrasil

## Documento Opcional (1 documento)

10. **OAB Advogados**
    - Tipo: `oab_advogados`
    - Responsabilidade: Do escritório de advocacia
    - Obs: Não é informado nas pastas de documentos enviados pelos pescadores

## Sistema de IA - Identificação Automática

O sistema utiliza IA com OCR para identificar automaticamente o tipo de cada documento através de:
- Análise do conteúdo do documento
- Reconhecimento de padrões no texto
- Identificação de palavras-chave no nome do arquivo (fallback)

## Palavras-chave para Identificação

O sistema reconhece os seguintes termos nos nomes dos arquivos:

- **Certificado PesqBrasil**: "certificado", "regularidade", "pesqbrasil"
- **CAEPF**: "caepf", "ecac"
- **Declaração de Residência**: "declaracao", "residencia", "assinado"
- **CNIS**: "cnis", "inss"
- **Termo/Procuração**: "termo", "representacao", "procuracao"
- **GPS**: "gps", "esocial"
- **Biometria**: "biometria", "tse"
- **CIN/CPF**: "cin", "identidade", "cpf"
- **OAB**: "oab"
- **REAP**: "reap", "relatorio", "atividade"

## Atualização do Sistema

✅ Tipos atualizados em `/lib/types.ts`
✅ Componente de upload atualizado em `/components/document-upload.tsx`
✅ Função de identificação por IA atualizada
✅ Botão de teste mockado atualizado com novos documentos

## Observações Importantes

- O sistema agora requer **9 documentos obrigatórios** (antes eram 5)
- O documento OAB é opcional e de responsabilidade do escritório
- Todos os documentos são identificados automaticamente pela IA
- O sistema aceita qualquer tipo de arquivo para demonstração (modo mockado)
