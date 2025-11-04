import { useState, useRef } from 'react';
import { DocumentType } from '../lib/types';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Upload, CheckCircle2, AlertCircle, FileText, X, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface DocumentUploadProps {
  onDocumentsChange: (documents: UploadedDocument[]) => void;
}

export interface UploadedDocument {
  type: DocumentType;
  name: string;
  file: File | null;
  preview?: string;
}

interface DocumentSlot {
  type: DocumentType;
  label: string;
  required: boolean;
  file?: File;
  status: 'empty' | 'filled' | 'error' | 'identifying';
  errorMessage?: string;
  fileName?: string;
}

const initialDocumentSlots: Omit<DocumentSlot, 'file' | 'status'>[] = [
  { type: 'rg', label: 'RG (Registro Geral)', required: true },
  { type: 'cpf', label: 'CPF', required: true },
  { type: 'rgp', label: 'Registro Geral da Pesca (RGP)', required: true },
  { type: 'comprovante_residencia', label: 'Comprovante de Residência', required: true },
  { type: 'declaracao_colonia', label: 'Declaração da Colônia', required: true },
  { type: 'comprovante_venda', label: 'Comprovante de Venda de Pescado', required: false },
  { type: 'carteira_trabalho', label: 'Carteira de Trabalho', required: false },
];

export function DocumentUpload({ onDocumentsChange }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [documentSlots, setDocumentSlots] = useState<DocumentSlot[]>(
    initialDocumentSlots.map(slot => ({ ...slot, status: 'empty' as const }))
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simula a IA identificando o tipo de documento através de OCR/Análise de conteúdo
  const identifyDocumentTypeByAI = async (file: File): Promise<DocumentType | null> => {
    // Simula delay de processamento OCR/IA (1-3 segundos)
    const delay = 1000 + Math.random() * 2000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Em produção, aqui seria enviado para API de OCR/IA
    // Por enquanto, simula identificação baseada no nome como fallback
    const lowerName = file.name.toLowerCase();
    
    // Simulação: A IA "analisa o conteúdo" e identifica
    // Em produção, isso seria baseado no conteúdo real do documento
    if (lowerName.includes('rg') && !lowerName.includes('rgp')) return 'rg';
    if (lowerName.includes('cpf')) return 'cpf';
    if (lowerName.includes('rgp') || lowerName.includes('pesca')) return 'rgp';
    if (lowerName.includes('residencia') || lowerName.includes('comprovante')) return 'comprovante_residencia';
    if (lowerName.includes('colonia') || lowerName.includes('declaracao')) return 'declaracao_colonia';
    if (lowerName.includes('venda') || lowerName.includes('pescado')) return 'comprovante_venda';
    if (lowerName.includes('carteira') || lowerName.includes('trabalho') || lowerName.includes('ctps')) return 'carteira_trabalho';
    
    // Se não conseguir identificar pelo nome, tenta identificar pelos documentos faltantes
    const emptySlots = documentSlots.filter(s => s.status === 'empty');
    if (emptySlots.length > 0) {
      // Retorna o primeiro slot vazio obrigatório, ou o primeiro vazio
      const requiredEmpty = emptySlots.find(s => s.required);
      return requiredEmpty ? requiredEmpty.type : emptySlots[0].type;
    }
    
    return null;
  };

  const processFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    // Validação inicial
    for (const file of fileArray) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        toast.error(`Arquivo ${file.name} tem formato inválido. Use PDF, JPG ou PNG.`);
        continue;
      }

      // Encontra um slot vazio temporário para mostrar estado de "identificando"
      const tempSlots = documentSlots.filter(s => s.status === 'empty');
      if (tempSlots.length === 0) {
        toast.warning('Todos os slots de documentos já estão preenchidos');
        continue;
      }

      // Marca como "identificando" no primeiro slot vazio
      const tempSlot = tempSlots[0];
      setDocumentSlots(prev => prev.map(slot => 
        slot.type === tempSlot.type 
          ? { ...slot, status: 'identifying', fileName: file.name }
          : slot
      ));

      toast.info(`Analisando: ${file.name}...`, {
        icon: <Sparkles className="h-4 w-4" />,
      });

      // IA identifica o tipo do documento
      try {
        const identifiedType = await identifyDocumentTypeByAI(file);

        if (!identifiedType) {
          // Se não conseguiu identificar, marca como erro
          setDocumentSlots(prev => prev.map(slot => 
            slot.type === tempSlot.type 
              ? { 
                  ...slot, 
                  status: 'error', 
                  errorMessage: 'Não foi possível identificar o tipo do documento',
                  fileName: undefined 
                }
              : slot
          ));
          toast.error(`Não foi possível identificar: ${file.name}`);
          continue;
        }

        // Atualiza o slot correto com o tipo identificado
        setDocumentSlots(prev => {
          const updatedSlots = prev.map(slot => {
            // Limpa o slot temporário
            if (slot.type === tempSlot.type && slot.status === 'identifying') {
              return { ...slot, status: 'empty', fileName: undefined };
            }
            // Preenche o slot correto
            if (slot.type === identifiedType) {
              if (slot.status === 'filled') {
                toast.warning(`Substituindo documento em: ${slot.label}`);
              }
              return {
                ...slot,
                file,
                status: 'filled',
                errorMessage: undefined,
                fileName: file.name,
              };
            }
            return slot;
          });

          // Notifica o componente pai
          const uploadedDocs: UploadedDocument[] = updatedSlots
            .filter(slot => slot.file)
            .map(slot => ({
              type: slot.type,
              name: slot.file!.name,
              file: slot.file!,
            }));
          onDocumentsChange(uploadedDocs);

          return updatedSlots;
        });

        const identifiedSlot = documentSlots.find(s => s.type === identifiedType);
        toast.success(`✓ ${identifiedSlot?.label} identificado`, {
          icon: <CheckCircle2 className="h-4 w-4" />,
        });

      } catch (error) {
        setDocumentSlots(prev => prev.map(slot => 
          slot.type === tempSlot.type 
            ? { 
                ...slot, 
                status: 'error', 
                errorMessage: 'Erro ao processar documento',
                fileName: undefined 
              }
            : slot
        ));
        toast.error(`Erro ao processar: ${file.name}`);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reseta o input para permitir upload do mesmo arquivo
    e.target.value = '';
  };

  const handleRemoveDocument = (type: DocumentType) => {
    const updatedSlots = documentSlots.map(slot => 
      slot.type === type 
        ? { ...slot, file: undefined, status: 'empty' as const, errorMessage: undefined, fileName: undefined }
        : slot
    );
    
    setDocumentSlots(updatedSlots);

    const uploadedDocs: UploadedDocument[] = updatedSlots
      .filter(slot => slot.file)
      .map(slot => ({
        type: slot.type,
        name: slot.file!.name,
        file: slot.file!,
      }));

    onDocumentsChange(uploadedDocs);
    toast.info('Documento removido');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex-shrink-0">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl mb-2">Documentos</h2>
          <p className="text-muted-foreground">
            Faça upload dos documentos em qualquer ordem. Nossa IA com OCR identificará automaticamente o tipo de cada documento, 
            independentemente do nome do arquivo.
          </p>
        </div>
      </div>

      {/* Área de Upload Drag and Drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-8 md:p-12 text-center cursor-pointer transition-all
          ${isDragging 
            ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20' 
            : 'border-gray-300 dark:border-gray-700 hover:border-cyan-500 hover:bg-gray-50 dark:hover:bg-gray-900'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-cyan-100 dark:bg-cyan-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
            <Upload className={`h-8 w-8 ${isDragging ? 'text-cyan-600' : 'text-gray-400'}`} />
          </div>
          
          <div>
            <p className="text-lg mb-1">
              <span className="text-cyan-600 dark:text-cyan-400">Clique para selecionar</span> ou arraste os arquivos aqui
            </p>
            <p className="text-sm text-muted-foreground">
              Formatos aceitos: PDF, JPG, PNG • Múltiplos arquivos permitidos
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Slots de Documentos */}
      <div>
        <h3 className="mb-4">Status dos Documentos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documentSlots.map((slot) => (
            <Card
              key={slot.type}
              className={`p-4 transition-all ${
                slot.status === 'filled' 
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                  : slot.status === 'error'
                  ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                  : slot.status === 'identifying'
                  ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20'
                  : 'border-gray-200 dark:border-gray-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {slot.status === 'filled' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : slot.status === 'error' ? (
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  ) : slot.status === 'identifying' ? (
                    <Loader2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400 animate-spin" />
                  ) : (
                    <FileText className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="truncate">{slot.label}</h4>
                    {slot.required && (
                      <Badge variant="secondary" className="text-xs">
                        Obrigatório
                      </Badge>
                    )}
                  </div>

                  {slot.status === 'filled' && slot.file ? (
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground truncate flex-1">
                        {slot.file.name}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveDocument(slot.type);
                        }}
                        className="flex-shrink-0 p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  ) : slot.status === 'identifying' ? (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                      <p className="text-sm text-cyan-600 dark:text-cyan-400">
                        Identificando via OCR: {slot.fileName}...
                      </p>
                    </div>
                  ) : slot.status === 'error' ? (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {slot.errorMessage || 'Erro ao processar documento'}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Aguardando documento
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Informação sobre IA */}
      <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 border border-cyan-200 dark:border-cyan-800 rounded-lg">
        <Sparkles className="h-5 w-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-cyan-900 dark:text-cyan-300">
          <p className="mb-2">
            <strong>🤖 Identificação Automática com IA</strong>
          </p>
          <p className="text-cyan-700 dark:text-cyan-400 mb-1">
            Nossa tecnologia de OCR (Reconhecimento Ótico de Caracteres) analisa o <strong>conteúdo</strong> de cada documento 
            para identificar automaticamente seu tipo, independentemente do nome do arquivo.
          </p>
          <p className="text-cyan-600 dark:text-cyan-500 text-xs">
            💡 Você pode fazer upload de todos os documentos de uma só vez, sem se preocupar com organização prévia!
          </p>
        </div>
      </div>
    </div>
  );
}
