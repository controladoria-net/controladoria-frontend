# 🧪 Como Testar o Sistema - Guia Rápido

## 🚀 Sistema 100% Funcional (Mockado)

O sistema de upload de documentos está totalmente operacional e **aceita QUALQUER arquivo** do seu computador para demonstração.

**⚠️ IMPORTANTE:** Este é um sistema mockado para demonstração. Aceita qualquer tipo de arquivo (.txt, .jpg, .pdf, .doc, .mp3, etc.) e simula o processamento por IA. Não é necessário usar documentos reais!

## ⚡ Teste Rápido (2 minutos)

### 1️⃣ Criar Nova Solicitação
```
Menu Lateral → "Nova Solicitação"
ou
Dashboard → Botão "+ Nova Solicitação"
```

### 2️⃣ Preencher Nome do Pescador

**Campo Obrigatório:**
- ✅ **Nome Completo:** João da Silva

💡 **CPF, RG, endereço, colônia e demais dados serão extraídos automaticamente dos documentos pela IA!**

### 3️⃣ Upload de Documentos (MÚLTIPLOS DE UMA VEZ!)

**Opção A - Drag & Drop (RECOMENDADO):**
1. Selecione **VÁRIOS ARQUIVOS** do seu PC (pode ser 5, 10, 15 arquivos!)
2. Arraste TODOS DE UMA VEZ para a área azul
3. Veja a IA processar e identificar cada um automaticamente

**Opção B - Seleção Manual:**
1. Clique na área de upload
2. Selecione **MÚLTIPLOS ARQUIVOS** usando Ctrl+clique (Windows) ou Cmd+clique (Mac)
3. Confirme

**💡 Sistema mockado:** Aceita qualquer tipo de arquivo para demonstração!
**🚀 DICA:** Quanto mais arquivos enviar de uma vez, mais impressionante!

### 4️⃣ Aguarde a IA

- ⏳ Cada arquivo leva 0.5-1.5 segundos (processamento mockado)
- 🎯 IA identifica o tipo automaticamente e preenche os slots
- ✅ Verde = sucesso (funciona com qualquer arquivo!)

### 5️⃣ Verifique o Contador

```
📊 5 / 5 obrigatórios
✅ Documentos obrigatórios completos
```

### 6️⃣ Crie a Solicitação

```
✅ Tudo pronto! Você pode criar a solicitação...
[Botão verde aparece]
```

Clique em: **"🚀 Criar Solicitação e Iniciar Análise IA"**

### 7️⃣ Veja o Resultado

- ⏳ "Analisando..." (2-3 segundos)
- 📊 IA calcula score
- ✅ Solicitação criada
- 👁️ Visualização detalhada

## 📁 Arquivos para Teste

Você pode usar **LITERALMENTE QUALQUER ARQUIVO** do seu computador:

### ✅ Exemplos de Arquivos Aceitos:
```
✅ documento.pdf
✅ foto.jpg
✅ arquivo.txt
✅ planilha.xlsx
✅ codigo.js
✅ musica.mp3
✅ video.mp4
✅ README.md
✅ screenshot.png
✅ qualquer-coisa.qualquer-extensao
```

### Sugestão para Identificação Automática:
Se quiser que a IA identifique o tipo correto, nomeie com palavras-chave:
```
1. rg.pdf          → Identificado como RG
2. cpf.jpg         → Identificado como CPF  
3. rgp.pdf         → Identificado como RGP
4. comprovante.txt → Identificado como Comprovante Residência
5. colonia.doc     → Identificado como Declaração Colônia
```

**💡 Sistema 100% mockado: A IA preenche automaticamente qualquer arquivo nos slots vazios!**

## ✅ Checklist de Teste

- [ ] Abrir "Nova Solicitação"
- [ ] Preencher Nome, CPF, Colônia
- [ ] Arrastar 5 arquivos
- [ ] Ver IA identificando (loading azul)
- [ ] Ver documentos preenchidos (check verde)
- [ ] Ver contador "5/5 obrigatórios"
- [ ] Ver badge verde de conclusão
- [ ] Ver botão ficar verde gradient
- [ ] Clicar "Criar e Analisar"
- [ ] Ver loading "Analisando..."
- [ ] Ver solicitação criada
- [ ] Ver análise da IA
- [ ] Ver score calculado

## 🎯 O Que Observar

### Durante Upload:
1. **Área azul** quando arrasta arquivo
2. **Loading girando** enquanto identifica
3. **Card azul** com "Identificando via OCR..."
4. **Card verde** quando identificado
5. **Nome do arquivo** aparece
6. **Contador** atualiza automaticamente

### Validação:
1. **Lista de pendências** (amarelo) quando falta algo
2. **Lista desaparece** quando completo
3. **Alerta verde** quando tudo pronto
4. **Botão muda** de cinza para verde gradient
5. **Emoji 🚀** aparece no botão

### Análise:
1. **Loading "Analisando..."**
2. **Toast de progresso**
3. **Redirecionamento automático**
4. **Análise da IA** aparece
5. **Score de elegibilidade** calculado

## 🎨 Estados Visuais

### Card de Documento:

**Vazio:**
```
📄 RG (Registro Geral)
   Aguardando documento
   [cinza]
```

**Identificando:**
```
⏳ RG (Registro Geral)  
   ✨ Identificando via OCR: rg.pdf...
   [azul pulsando]
```

**Preenchido:**
```
✅ RG (Registro Geral)
   rg.pdf                    [X]
   [verde]
```

**Erro:**
```
❌ RG (Registro Geral)
   Não foi possível identificar
   [vermelho]
```

## 🔄 Testar Remoção

1. Clique no **X** vermelho em um documento
2. Contador diminui
3. Botão desabilita se ficar incompleto
4. Faça upload novamente

## 🚀 Testar Upload Múltiplo

1. Selecione **5 arquivos de uma vez**
2. Veja todos sendo processados
3. IA identifica cada um individualmente
4. Mais rápido que um por vez

## 📊 Resultado Final

Após criar a solicitação, você verá:

```
┌─────────────────────────────────────────┐
│ Solicitação #12345                      │
│ ✅ Aprovada  ⭐ Alta Prioridade         │
├─────────────────────────────────────────┤
│                                         │
│ 📊 Análise da IA                        │
│ ├─ Score: 85%                           │
│ ├─ Status: Aprovado                     │
│ └─ Recomendação: Prosseguir             │
│                                         │
│ 📄 Documentos (5)                       │
│ ├─ ✅ RG                                │
│ ├─ ✅ CPF                               │
│ ├─ ✅ RGP                               │
│ ├─ ✅ Comprovante Residência            │
│ └─ ✅ Declaração Colônia                │
│                                         │
│ [Aprovar Solicitação]                   │
│ [Exportar Relatório]                    │
└─────────────────────────────────────────┘
```

## 💡 Dicas

1. **Use arquivos pequenos** para teste rápido
2. **Nomeie com palavras-chave** para melhor identificação
3. **Teste drag & drop** - é mais rápido
4. **Upload múltiplo** - selecione vários de uma vez
5. **Veja os toasts** - mostram cada etapa

## ❓ Troubleshooting

**Botão não habilita:**
- ✅ Verifique se preencheu Nome, CPF e Colônia
- ✅ Verifique se tem 5 documentos obrigatórios

**IA não identifica:**
- 💡 Arquivo sem nome específico vai para primeiro slot vazio
- 💡 Você pode remover e reenviar
- 💡 Sistema prioriza slots obrigatórios vazios

**Arquivo rejeitado:**
- 💡 Sistema aceita qualquer formato (apenas avisa)
- 💡 Idealmente use PDF, JPG ou PNG

## 🎉 Próximo Passo

Depois de testar o upload, explore:

1. **Aprovar a solicitação** criada
2. **Abrir um processo** judicial
3. **Ver dashboard** com estatísticas
4. **Gerar relatórios** em PDF
5. **Testar notificações**
6. **Usar o chatbot** com IA

## 📝 Feedback

O sistema está funcional e pronto para demonstração!

**Funciona de verdade! 🚀**

---

**Tempo de teste:** ~2 minutos  
**Dificuldade:** Fácil  
**Resultado:** Sistema completo funcionando
