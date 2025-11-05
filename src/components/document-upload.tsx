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
  { type: 'certificado_regularidade_pesqbrasil', label: 'Certificado de Regularidade – PesqBrasil', required: true },
  { type: 'caepf_ecac', label: 'CAEPF – E-CAC', required: true },
  { type: 'declaracao_residencia', label: 'Declaração de Residência (Assinado pelo Pescador)', required: true },
  { type: 'cnis_meu_inss', label: 'CNIS – Meu INSS', required: true },
  { type: 'termo_representacao_procuracao', label: 'Termo de Representação e Procuração (Assinado)', required: true },
  { type: 'gps_comprovante_esocial', label: 'GPS e Comprovante de GPS – E-Social', required: true },
  { type: 'biometria_tse', label: 'Biometria – Site TSE', required: true },
  { type: 'novo_cin_cpf', label: 'Novo CIN (Identidade) e CPF', required: true },
  { type: 'oab_advogados', label: 'OAB Advogados (Responsabilidade do Escritório)', required: false },
  { type: 'reap_2021_2024', label: 'REAP 2021-2024 – PesqBrasil', required: true },
];

export function DocumentUpload({ onDocumentsChange }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [documentSlots, setDocumentSlots] = useState<DocumentSlot[]>(
    initialDocumentSlots.map(slot => ({ ...slot, status: 'empty' as const }))
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simula a IA identificando o tipo de documento através de OCR/Análise de conteúdo
  const identifyDocumentTypeByAI = async (file: File, currentSlots: DocumentSlot[]): Promise<DocumentType | null> => {
    // Simula delay de processamento OCR/IA (mais rápido para demonstração)
    const delay = 500 + Math.random() * 1000; // 0.5-1.5 segundos
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Em produção, aqui seria enviado para API de OCR/IA
    // Por enquanto, simula identificação baseada no nome como fallback
    const lowerName = file.name.toLowerCase();
    
    // Simulação: A IA "analisa o conteúdo" e identifica
    // Em produção, isso seria baseado no conteúdo real do documento
    if (lowerName.includes('certificado') && lowerName.includes('regularidade')) return 'certificado_regularidade_pesqbrasil';
    if (lowerName.includes('pesqbrasil') && lowerName.includes('certificado')) return 'certificado_regularidade_pesqbrasil';
    if (lowerName.includes('caepf')) return 'caepf_ecac';
    if (lowerName.includes('ecac')) return 'caepf_ecac';
    if (lowerName.includes('declaracao') && lowerName.includes('residencia')) return 'declaracao_residencia';
    if (lowerName.includes('residencia') && lowerName.includes('assinado')) return 'declaracao_residencia';
    if (lowerName.includes('cnis')) return 'cnis_meu_inss';
    if (lowerName.includes('inss')) return 'cnis_meu_inss';
    if (lowerName.includes('termo') && (lowerName.includes('representacao') || lowerName.includes('procuracao'))) return 'termo_representacao_procuracao';
    if (lowerName.includes('procuracao')) return 'termo_representacao_procuracao';
    if (lowerName.includes('gps')) return 'gps_comprovante_esocial';
    if (lowerName.includes('esocial')) return 'gps_comprovante_esocial';
    if (lowerName.includes('biometria')) return 'biometria_tse';
    if (lowerName.includes('tse')) return 'biometria_tse';
    if (lowerName.includes('cin') || (lowerName.includes('identidade') && lowerName.includes('cpf'))) return 'novo_cin_cpf';
    if (lowerName.includes('oab')) return 'oab_advogados';
    if (lowerName.includes('reap')) return 'reap_2021_2024';
    if (lowerName.includes('relatorio') && lowerName.includes('atividade')) return 'reap_2021_2024';
    
    // Para qualquer outro arquivo: preenche automaticamente os slots vazios obrigatórios
    const emptySlots = currentSlots.filter(s => s.status === 'empty');
    if (emptySlots.length > 0) {
      // Prioriza slots obrigatórios vazios
      const requiredEmpty = emptySlots.find(s => s.required);
      return requiredEmpty ? requiredEmpty.type : emptySlots[0].type;
    }
    
    // Se todos os slots estão preenchidos, substitui o último obrigatório
    const requiredSlots = currentSlots.filter(s => s.required);
    return requiredSlots.length > 0 ? requiredSlots[requiredSlots.length - 1].type : null;
  };

  const processFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    // Processa todos os arquivos de forma mais simples
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      
      // Aguarda processamento completo do arquivo
      await processOneFile(file);
      
      // Pequeno delay entre arquivos
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  };

  const processOneFile = (file: File): Promise<void> => {
    return new Promise((resolve) => {
      // Passo 1: Captura estado atual
      setDocumentSlots(prevSlots => {
        const emptySlots = prevSlots.filter(s => s.status === 'empty');
        if (emptySlots.length === 0) {
          toast.warning('Todos os slots de documentos já estão preenchidos');
          resolve();
          return prevSlots;
        }

        const tempSlot = emptySlots[0];
        
        toast.info(`Analisando: ${file.name}...`, {
          icon: <Sparkles className="h-4 w-4" />,
        });

        // Passo 2: Marca como identificando
        const slotsIdentifying = prevSlots.map(slot => 
          slot.type === tempSlot.type 
            ? { ...slot, status: 'identifying' as const, fileName: file.name }
            : slot
        );

        // Passo 3: Inicia identificação assíncrona
        (async () => {
          try {
            const identifiedType = await identifyDocumentTypeByAI(file, slotsIdentifying);

            if (!identifiedType) {
              setDocumentSlots(prev => prev.map(slot => 
                slot.type === tempSlot.type && slot.status === 'identifying'
                  ? { ...slot, status: 'error' as const, errorMessage: 'Não identificado', fileName: undefined }
                  : slot
              ));
              toast.error(`Não foi possível identificar: ${file.name}`);
              resolve();
              return;
            }

            // Passo 4: Atualiza com o documento identificado
            setDocumentSlots(prev => {
              const newSlots = prev.map(slot => {
                // Limpa slot temporário
                if (slot.type === tempSlot.type && slot.status === 'identifying') {
                  return { ...slot, status: 'empty' as const, fileName: undefined };
                }
                // Preenche slot correto
                if (slot.type === identifiedType) {
                  if (slot.status === 'filled') {
                    toast.warning(`Substituindo: ${slot.label}`);
                  }
                  return {
                    ...slot,
                    file,
                    status: 'filled' as const,
                    errorMessage: undefined,
                    fileName: file.name,
                  };
                }
                return slot;
              });

              // Passo 5: Notifica componente pai
              const uploadedDocs: UploadedDocument[] = newSlots
                .filter(s => s.file)
                .map(s => ({
                  type: s.type,
                  name: s.file!.name,
                  file: s.file!,
                }));
              
              onDocumentsChange(uploadedDocs);

              // Toast de sucesso
              const identifiedSlot = newSlots.find(s => s.type === identifiedType);
              if (identifiedSlot) {
                toast.success(`✓ ${identifiedSlot.label}`, {
                  icon: <CheckCircle2 className="h-4 w-4" />,
                });
              }

              resolve();
              return newSlots;
            });

          } catch (error) {
            setDocumentSlots(prev => prev.map(slot => 
              slot.type === tempSlot.type && slot.status === 'identifying'
                ? { ...slot, status: 'error' as const, errorMessage: 'Erro ao processar', fileName: undefined }
                : slot
            ));
            toast.error(`Erro: ${file.name}`);
            resolve();
          }
        })();

        return slotsIdentifying;
      });
    });
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
          <h2 className="text-2xl mb-2">Documentos do Seguro-Defeso</h2>
          <p className="text-muted-foreground">
            <strong>Envie todos os documentos de uma vez!</strong> Você pode selecionar ou arrastar múltiplos arquivos simultaneamente. 
            Nossa IA com OCR identificará automaticamente o tipo de cada documento e extrairá os dados do pescador (CPF, RG, endereço, colônia, etc.).
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
          accept="*/*"
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
              📤 Envie <strong>vários documentos de uma vez</strong> • Aceita qualquer tipo de arquivo • IA identifica automaticamente
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Slots de Documentos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3>Status dos Documentos</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {documentSlots.filter(s => s.status === 'filled').length} / {documentSlots.filter(s => s.required).length} obrigatórios
            </Badge>
            {documentSlots.filter(s => s.status === 'filled' && s.required).length === documentSlots.filter(s => s.required).length && (
              <Badge className="bg-green-600 text-sm">
                ✓ Documentos obrigatórios completos
              </Badge>
            )}
          </div>
        </div>
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
            <strong>🤖 Sistema Mockado para Demonstração</strong>
          </p>
          <p className="text-cyan-700 dark:text-cyan-400 mb-1">
            Este sistema aceita <strong>qualquer arquivo</strong> do seu computador para demonstração. 
            A IA simulada identifica automaticamente o tipo de documento e preenche os slots necessários.
          </p>
          <p className="text-cyan-600 dark:text-cyan-500 text-xs">
            💡 Arraste 9 arquivos quaisquer para preencher todos os documentos obrigatórios. Não precisa ser documento real.
          </p>
        </div>
      </div>
    </div>
  );
}
