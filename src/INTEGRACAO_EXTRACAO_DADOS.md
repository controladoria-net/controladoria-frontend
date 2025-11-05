# Integração com API de Extração de Dados

## Visão Geral

O sistema agora possui uma interface completa para exibir dados extraídos dos documentos dos pescadores pela IA com OCR. Os dados são organizados em DTOs (Data Transfer Objects) que correspondem aos diferentes tipos de documentos do Seguro-Defeso.

## Arquitetura

### Frontend (TypeScript/React)

**Tipos Definidos em `/lib/types.ts`:**
- `RGPDTO` - Registro Geral da Pesca
- `CAEPFDTO` - Cadastro de Atividade Econômica
- `ComprovanteResidenciaDTO` - Declaração de Residência
- `CNISDTO` - Cadastro Nacional de Informação Social
- `TermoRepresentacaoDTO` - Termo de Representação e Procuração
- `GPSDTO` - Guia da Previdência Social
- `BiometriaDTO` - Biometria TSE
- `DocumentoIdentidadeDTO` - Novo CIN e CPF
- `REAPDTO` - Relatório de Atividade Pesqueira 2021-2024
- `ExtractedDocumentData` - Container para dados extraídos

**Componentes:**
- `/components/extracted-data-view.tsx` - Exibe os dados extraídos em cards visuais
- `/components/solicitacao-detail.tsx` - Inclui nova aba "Dados Extraídos"

### Backend (Python)

**DTOs Python (fornecidos pelo usuário):**
- Mesmos nomes e estruturas dos DTOs TypeScript
- Usa `@dataclass` para definição
- `DTO_REGISTRY` mapeia tipos de documento para classes DTO
- Função `build_dto()` instancia DTOs a partir da resposta da IA

## Como Integrar

### 1. Fluxo de Extração

```
Upload de Documento → API OCR/IA → DTO Python → API Response → DTO TypeScript → UI
```

### 2. Endpoint de API Sugerido

```typescript
// POST /api/documents/extract
interface ExtractRequest {
  documentId: string;
  documentType: DocumentType;
  fileUrl: string;
}

interface ExtractResponse {
  success: boolean;
  data: ExtractedDocumentData;
  errors?: string[];
}
```

### 3. Integração no Frontend

**Atualmente (Mock):**
```typescript
const mockExtractedData: ExtractedDocumentData[] = [
  // dados mockados...
];
```

**Em Produção:**
```typescript
// Em /components/solicitacao-detail.tsx
const [extractedData, setExtractedData] = useState<ExtractedDocumentData[]>([]);
const [isExtracting, setIsExtracting] = useState(false);

useEffect(() => {
  const extractDocumentData = async () => {
    setIsExtracting(true);
    try {
      const promises = solicitacao.documents.map(doc => 
        fetch('/api/documents/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentId: doc.id,
            documentType: doc.type,
            fileUrl: doc.url
          })
        }).then(res => res.json())
      );
      
      const results = await Promise.all(promises);
      const successfulExtractions = results
        .filter(r => r.success)
        .map(r => r.data);
        
      setExtractedData(successfulExtractions);
    } catch (error) {
      console.error('Erro ao extrair dados:', error);
    } finally {
      setIsExtracting(false);
    }
  };

  if (solicitacao.documents.length > 0) {
    extractDocumentData();
  }
}, [solicitacao.id]);
```

### 4. Exemplo de Response da API

```json
{
  "success": true,
  "data": {
    "documentType": "certificado_regularidade_pesqbrasil",
    "documentName": "Certificado_RGP.pdf",
    "extractedData": {
      "nome": "João Silva",
      "cpf": "123.456.789-00",
      "rgp": "SP-123456",
      "atividade": "Pesca Artesanal",
      "categoria": "Pescador Profissional Artesanal",
      "data_emissao": "2023-01-15",
      "data_primeiro_registro": "2018-03-20",
      "situacao": "Ativo",
      "endereco": {
        "logradouro": "Rua dos Pescadores",
        "numero": "123",
        "bairro": "Centro",
        "cidade": "Santos",
        "estado": "SP",
        "cep": "11010-100"
      },
      "orgao_emissor": "Ministério da Pesca e Aquicultura"
    },
    "confidence": 95,
    "extractedAt": "2024-11-04T10:30:00Z"
  }
}
```

## Mapeamento de Tipos

### Documentos → DTOs

| DocumentType (Frontend) | DTO Python | DTO TypeScript |
|------------------------|------------|----------------|
| `certificado_regularidade_pesqbrasil` | `RGPDTO` | `RGPDTO` |
| `caepf_ecac` | `CAEPFDTO` | `CAEPFDTO` |
| `declaracao_residencia` | `ComprovanteResidenciaDTO` | `ComprovanteResidenciaDTO` |
| `cnis_meu_inss` | `CNISDTO` | `CNISDTO` |
| `termo_representacao_procuracao` | `TermoRepresentacaoDTO` | `TermoRepresentacaoDTO` |
| `gps_comprovante_esocial` | `GPSDTO` | `GPSDTO` |
| `biometria_tse` | `BiometriaDTO` | `BiometriaDTO` |
| `novo_cin_cpf` | `DocumentoIdentidadeDTO` | `DocumentoIdentidadeDTO` |
| `reap_2021_2024` | `REAPDTO` | `REAPDTO` |

## Características da UI

### Cards Visuais por Tipo de Documento

Cada tipo de documento tem um card visual específico com:
- **Ícone e cor únicos** - Identificação visual rápida
- **Badge de confiança** - Mostra % de confiança da extração
  - Verde (≥90%): Alta confiança
  - Amarelo (70-89%): Média confiança
  - Vermelho (<70%): Baixa confiança
- **Dados organizados em grid** - Fácil leitura
- **Alertas contextuais** - Para problemas específicos

### Alertas Especiais

- **REAP Incompleto** - Mostra anos faltantes
- **Termo sem assinatura** - Alerta vermelho
- **Biometria não coletada** - Instrução para coleta
- **Documento inválido** - CIN/CPF inexistente

### Formatação Automática

- **Datas**: YYYY-MM-DD → DD/MM/YYYY
- **Valores**: Number → R$ X.XXX,XX
- **Endereços**: Object → String formatada
- **Listas**: Arrays → Badges visuais

## Exemplo de Integração Completa

```typescript
// /lib/api/documents.ts
export async function extractDocumentData(
  documentId: string,
  documentType: DocumentType,
  fileUrl: string
): Promise<ExtractedDocumentData> {
  const response = await fetch('/api/documents/extract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({
      documentId,
      documentType,
      fileUrl
    })
  });

  if (!response.ok) {
    throw new Error('Erro ao extrair dados do documento');
  }

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.errors?.join(', ') || 'Erro desconhecido');
  }

  return result.data;
}

export async function extractAllDocuments(
  documents: Document[]
): Promise<ExtractedDocumentData[]> {
  const results = await Promise.allSettled(
    documents.map(doc => 
      extractDocumentData(doc.id, doc.type, doc.url)
    )
  );

  return results
    .filter((r): r is PromiseFulfilledResult<ExtractedDocumentData> => 
      r.status === 'fulfilled'
    )
    .map(r => r.value);
}
```

## Tratamento de Erros

```typescript
try {
  const extractedData = await extractDocumentData(doc.id, doc.type, doc.url);
  // Sucesso
} catch (error) {
  if (error.message.includes('confiança baixa')) {
    // Extração com baixa confiança - revisar manualmente
  } else if (error.message.includes('formato inválido')) {
    // Documento em formato não suportado
  } else {
    // Outro erro
  }
}
```

## Performance

- **Extração paralela**: Todos os documentos processados simultaneamente
- **Cache de resultados**: Armazenar dados extraídos no backend
- **Loading states**: Skeleton/spinner durante extração
- **Fallback gracioso**: Mostrar documentos mesmo sem extração

## Próximos Passos

1. **Backend**: Implementar API de extração com Python/FastAPI
2. **OCR**: Integrar serviço de OCR (Tesseract, Google Vision, AWS Textract)
3. **IA**: Treinar modelo ou usar GPT-4 Vision para classificação
4. **Cache**: Implementar cache Redis para resultados
5. **Queue**: Usar Celery/RQ para processamento assíncrono
6. **Validação**: Adicionar validação cruzada entre documentos
7. **Auditoria**: Log de todas as extrações para compliance

## Notas de Segurança

- Não armazenar imagens dos documentos permanentemente
- Criptografar dados sensíveis em trânsito e em repouso
- Implementar rate limiting na API
- Logs de auditoria para todas as extrações
- LGPD: Consentimento explícito para processamento de dados
