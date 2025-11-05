import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { DocumentUpload, UploadedDocument } from './document-upload';
import { Pescador } from '../lib/types';
import { Loader2 } from 'lucide-react';

interface NewCaseFormProps {
  onSubmit: (pescador: Pescador, documents: UploadedDocument[]) => void;
  isAnalyzing: boolean;
}

export function NewCaseForm({ onSubmit, isAnalyzing }: NewCaseFormProps) {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [formData, setFormData] = useState<Partial<Pescador>>({
    nome: '',
  });

  const handleDocumentsChange = (newDocuments: UploadedDocument[]) => {
    setDocuments(newDocuments);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Os demais dados serão extraídos pela IA dos documentos
    const pescador: Pescador = {
      id: `p${Date.now()}`,
      nome: formData.nome || '',
      cpf: '', // Será extraído dos documentos
      rg: '', // Será extraído dos documentos
      dataNascimento: new Date(),
      endereco: '', // Será extraído dos documentos
      colonia: '', // Será extraído dos documentos
      telefone: '', // Será extraído dos documentos
      email: undefined,
    };

    onSubmit(pescador, documents);
  };

  const handleInputChange = (field: keyof Pescador, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.nome && documents.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-base md:text-lg">Identificação do Pescador</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-4 md:px-6">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo do Pescador *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Digite o nome completo do pescador"
              required
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">
              💡 CPF, RG, endereço, colônia e demais dados serão extraídos automaticamente dos documentos pela IA
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-4 md:px-6 pt-6">
          <DocumentUpload onDocumentsChange={handleDocumentsChange} />
        </CardContent>
      </Card>

      <div className="space-y-3">
        {/* Indicador de progresso */}
        {!isFormValid && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>📋 Para continuar, você precisa:</strong>
            </p>
            <ul className="text-sm text-amber-700 dark:text-amber-400 mt-2 space-y-1 ml-4 list-disc">
              {!formData.nome && <li>Preencher o nome do pescador</li>}
              {documents.length === 0 && <li>Fazer upload de pelo menos 1 documento</li>}
            </ul>
          </div>
        )}
        
        {isFormValid && !isAnalyzing && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-300">
              ✅ <strong>Tudo pronto!</strong> Você pode criar a solicitação e iniciar a análise por IA.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3 sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-2 pb-2">
          <Button type="button" variant="outline" className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid || isAnalyzing}
            className={`w-full sm:w-auto ${isFormValid && !isAnalyzing ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700' : ''}`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <span className="hidden md:inline">🚀 Criar Solicitação e Iniciar Análise IA</span>
                <span className="md:hidden">🚀 Criar e Analisar</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
