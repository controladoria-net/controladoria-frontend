# Fluxo de Trabalho - Sistema ControladorIA

## Visão Geral

O Sistema ControladorIA é uma plataforma completa para escritórios de advocacia que automatiza a análise de documentos de pescadores artesanais para verificação de elegibilidade ao Seguro-Defeso.

## Estrutura do Sistema

O sistema é dividido em **duas seções principais**:

### 1. **Solicitações** (Pré-Análise)
Fase inicial onde o advogado cadastra o pescador e seus documentos para análise automatizada por IA.

### 2. **Processos** (Processos Judiciais)
Fase posterior onde são acompanhados os processos judiciais já ajuizados.

---

## Fluxo Completo

```
┌─────────────────────┐
│  Nova Solicitação   │  ← Advogado cadastra pescador + documentos
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Análise por IA    │  ← Sistema processa documentos (OCR + IA)
│    (Automática)     │  ← Gera score de elegibilidade
└──────────┬──────────┘
           │
           ▼
   ┌───────┴────────┐
   │                │
   ▼                ▼
┌──────┐      ┌──────────┐
│Aprov.│      │Reprovada │
│ ou   │      │    ou    │
│Inc.  │      │Pendente  │
└──┬───┘      └──────────┘
   │                │
   │                └──► Solicitar Docs → Atualizar → Nova Análise
   │
   ▼
┌─────────────────────┐
│ Abrir Processo      │  ← Advogado converte em processo judicial
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Processo Criado    │  ← Número de processo gerado
│  (Em Andamento)     │  ← Acompanhamento de movimentações
└─────────────────────┘
           │
           ▼
   ┌───────┴────────┐
   │                │
   ▼                ▼
┌──────────┐   ┌────────────┐
│Deferido  │   │ Indeferido │
└──────────┘   └────────────┘
```

---

## Detalhamento por Fase

## 📋 Fase 1: Solicitações

### 1.1 Criar Nova Solicitação

**Caminho:** Dashboard → "Nova Solicitação"

**Processo:**
1. Preencher dados do pescador:
   - Nome completo
   - CPF
   - RG
   - Data de nascimento
   - Endereço
   - Telefone
   - Colônia de pescadores
   - RGP (se disponível)
   - E-mail (opcional)

2. Upload de documentos via drag-and-drop:
   - RG
   - CPF
   - RGP (Registro Geral da Pesca)
   - Comprovante de residência
   - Declaração da colônia
   - Comprovantes de venda de pescado
   - Carteira de trabalho
   - Outros

3. Sistema identifica automaticamente o tipo de cada documento (IA/OCR)

4. Clicar em "Criar Solicitação"

### 1.2 Análise Automática por IA

**O que a IA analisa:**
- ✅ Presença de documentos obrigatórios
- ✅ Validade do RGP
- ✅ Comprovação de atividade pesqueira
- ✅ Vínculo com colônia
- ✅ Ausência de vínculo empregatício CLT
- ✅ Documentação de comercialização

**Score de Elegibilidade:**
- **70-100%** = ✅ Aprovada (pronta para processo)
- **40-69%** = ⚠️ Documentação Incompleta
- **0-39%** = ❌ Reprovada

**Confiança da IA:**
- Indica o nível de certeza da análise (0-100%)

### 1.3 Visualizar Solicitação

**Caminho:** Solicitações → Clicar em "Ver Detalhes"

**Abas disponíveis:**

#### Aba "Análise IA"
- Score circular visual
- Critérios de elegibilidade (item por item)
- Documentos faltantes (se houver)
- Inconsistências identificadas
- Recomendações da IA
- Notas do advogado

#### Aba "Pescador"
- Dados pessoais completos
- Informações de contato
- Dados do RGP

#### Aba "Documentos"
- Lista de todos os documentos enviados
- Download individual
- Data de upload
- Tipo identificado

### 1.4 Status das Solicitações

- 🔵 **Pendente** - Aguardando análise
- 🔄 **Em Análise** - IA processando documentos
- ✅ **Aprovada** - Pronta para virar processo
- ❌ **Reprovada** - Não atende requisitos
- ⚠️ **Documentação Incompleta** - Faltam documentos

### 1.5 Ações Disponíveis

**Para solicitações aprovadas:**
- 🟣 **Abrir Processo** - Converte em processo judicial
- 📄 **Exportar Relatório** - Gera arquivo .txt com análise completa

**Para solicitações com docs incompletos:**
- 📧 **Gerar Carta de Solicitação** - Documento para pedir docs ao cliente

---

## ⚖️ Fase 2: Processos Judiciais

### 2.1 Converter Solicitação em Processo

**Quando:** Solicitação com status "Aprovada"

**Processo:**
1. Abrir detalhes da solicitação aprovada
2. Clicar em "Abrir Processo"
3. Confirmar no diálogo
4. Sistema automaticamente:
   - Cria novo processo
   - Gera número de processo judicial
   - Transfere todos os documentos
   - Define tribunal (TJSP por padrão)
   - Registra referência à solicitação original
   - Define status inicial como "Em Andamento"

### 2.2 Visualizar Processo

**Caminho:** Processos → Clicar em "Ver Detalhes"

**Abas disponíveis:**

#### Aba "Processo"
- Informações processuais completas
- Número do processo
- Tribunal e órgão julgador
- Classe processual
- Data de ajuizamento
- Última movimentação
- Estatísticas (movimentações, dias em curso)
- Alertas e avisos por status
- Notas do advogado

#### Aba "Pescador"
- Dados completos do autor

#### Aba "Docs"
- Documentos anexados ao processo

#### Aba "Timeline"
- Linha do tempo do processo
- Histórico de movimentações
- Origem (se veio de solicitação)

### 2.3 Status dos Processos

- 🔵 **Em Andamento** - Tramitando normalmente
- ⚠️ **Aguardando Documentos** - Tribunal solicitou docs
- ✅ **Deferido** - Sentença favorável
- ❌ **Indeferido** - Sentença desfavorável
- 📦 **Arquivado** - Processo encerrado

### 2.4 Ações Disponíveis

- 📄 **Exportar Processo** - Gera relatório completo em .txt
- 📝 **Adicionar Notas** - Observações do advogado

---

## 📊 Dashboard

**Visão geral do sistema:**

### Estatísticas Principais
- 📋 Total de Solicitações
- ⚖️ Total de Processos
- 📈 Taxa de Aprovação de Solicitações
- ⚠️ Itens que Precisam de Ação

### Detalhamento de Solicitações
- Pendentes
- Em Análise
- Aprovadas
- Docs Incompletos

### Detalhamento de Processos
- Em Andamento
- Aguardando Docs
- Deferidos
- Taxa de Sucesso

---

## 🔍 Funcionalidades de Busca e Filtros

### Página de Solicitações
**Filtros disponíveis:**
- Status (Pendente, Em Análise, Aprovada, Reprovada, Doc. Incompleta)
- Prioridade (Baixa, Média, Alta)
- Busca por: Nome, CPF, Colônia

**Ordenação:**
- Data de Criação
- Nome do Pescador
- Score da IA

### Página de Processos
**Filtros disponíveis:**
- Status (Em Andamento, Aguardando Docs, Deferido, Indeferido, Arquivado)
- Prioridade (Baixa, Média, Alta)
- Busca por: Nome, CPF, Nº Processo, Tribunal

**Ordenação:**
- Data de Ajuizamento
- Nome do Pescador
- Nº do Processo

---

## 📚 Base de Conhecimento

**Conteúdo disponível:**
- 📖 Legislação sobre Seguro-Defeso
- 📋 Checklist de documentos necessários
- 🗂️ Modelos de petições e requerimentos
- ❓ Perguntas frequentes
- 📅 Períodos de defeso por região

---

## 🔔 Sistema de Notificações

**Tipos de notificações:**
- Análise de solicitação concluída
- Documentos faltantes identificados
- Mudança de status
- Prazos se aproximando
- Alertas do sistema
- Atualizações de legislação

---

## 📁 Relatórios Gerados

### Relatório de Solicitação
**Conteúdo:**
- Dados completos do pescador
- Resultado da análise IA
- Score e confiança
- Critérios de elegibilidade (aprovado/reprovado)
- Documentos apresentados
- Documentos faltantes
- Recomendações
- Próximos passos
- Disclaimer sobre IA

**Formato:** Arquivo .txt

### Relatório de Processo
**Conteúdo:**
- Informações processuais completas
- Dados do pescador (autor)
- Documentos do processo
- Análise de tempo de tramitação
- Status e situação atual
- Observações do advogado
- Origem (se veio de solicitação)

**Formato:** Arquivo .txt

### Carta de Solicitação de Documentos
**Conteúdo:**
- Cabeçalho formal
- Lista de documentos faltantes
- Observações importantes
- Prazo para apresentação
- Formas de envio
- Assinatura do escritório

**Formato:** Arquivo .txt

---

## 🎨 Interface

### Paleta de Cores Profissional
- **Primária:** Slate Dark (#0f172a)
- **Secundária:** Cyan (tons de azul-água)
- **Sucesso:** Verde
- **Alerta:** Amarelo
- **Erro:** Vermelho

### Responsividade
- ✅ Desktop (telas grandes)
- ✅ Tablet
- ✅ Mobile (navegação adaptada)

### Modo Escuro
- ✅ Suportado em todo o sistema
- Toggle no header

---

## 🔐 Autenticação

### Login
- E-mail e senha
- Persistência de sessão (localStorage)

### Recuperação de Senha
1. Tela de solicitação (informa e-mail)
2. Confirmação de envio
3. Link de redefinição (simulado)
4. Tela de redefinição com validação forte
5. Confirmação e redirecionamento

**Requisitos de senha:**
- Mínimo 8 caracteres
- Uma letra maiúscula
- Uma letra minúscula
- Um número
- Um caractere especial

---

## ⚠️ Disclaimers

**Presente em todos os relatórios:**

> Este sistema é uma ferramenta de auxílio para análise jurídica com suporte de Inteligência Artificial. A análise final e a responsabilidade pela verificação dos documentos e elegibilidade são do profissional jurídico responsável.
>
> A IA é uma ferramenta de apoio e NÃO substitui a análise jurídica humana especializada.

---

## 💡 Dicas de Uso

### Para Máxima Eficiência:

1. **Upload de Documentos**
   - Envie todos os documentos de uma vez
   - Use arquivos legíveis e de boa qualidade
   - O sistema identifica automaticamente o tipo

2. **Análise de Score**
   - Score > 70% = Boa chance de aprovação
   - Sempre revise os critérios individualmente
   - Verifique a confiança da IA

3. **Documentação Incompleta**
   - Use a carta automática para solicitar docs
   - Adicione notas personalizadas se necessário

4. **Conversão para Processo**
   - Só converta solicitações aprovadas
   - Revise todos os documentos antes
   - O número de processo é gerado automaticamente

5. **Acompanhamento**
   - Use os filtros para encontrar rapidamente
   - Configure prioridades para casos urgentes
   - Adicione notas para contexto futuro

---

## 🚀 Fluxo Recomendado para Novos Casos

1. **Recebimento do Cliente**
   - Solicitar documentos básicos
   - Explicar o processo

2. **Cadastro no Sistema**
   - Criar nova solicitação
   - Upload de todos os documentos disponíveis

3. **Aguardar Análise IA**
   - Sistema processa automaticamente
   - Notificação quando concluir

4. **Avaliar Resultado**
   - Se aprovado → abrir processo
   - Se incompleto → solicitar documentos
   - Se reprovado → informar cliente

5. **Abertura de Processo**
   - Converter solicitação em processo
   - Ajuizar no tribunal
   - Acompanhar movimentações

6. **Acompanhamento**
   - Atualizar status conforme movimentações
   - Adicionar notas relevantes
   - Gerar relatórios quando necessário

---

## 📞 Suporte

Para dúvidas ou problemas, consulte a Base de Conhecimento ou entre em contato com o suporte técnico.

---

**Versão do Sistema:** 1.0  
**Última Atualização:** Novembro 2024
