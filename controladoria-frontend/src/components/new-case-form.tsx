import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DocumentUpload, UploadedDocument } from './document-upload';
import { ProcessSearch } from './process-search';
import { Pescador } from '../lib/types';
import { Loader2, FileUp, Scale } from 'lucide-react';

interface NewCaseFormProps {
  onSubmit: (pescador: Pescador, documents: UploadedDocument[], processData?: any) => void;
  isAnalyzing: boolean;
}

export function NewCaseForm({ onSubmit, isAnalyzing }: NewCaseFormProps) {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [activeTab, setActiveTab] = useState('documents');
  const [formData, setFormData] = useState<Partial<Pescador>>({
    nome: '',
    cpf: '',
    rg: '',
    endereco: '',
    colonia: '',
    telefone: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const pescador: Pescador = {
      id: `p${Date.now()}`,
      nome: formData.nome || '',
      cpf: formData.cpf || '',
      rg: formData.rg || '',
      dataNascimento: new Date(),
      endereco: formData.endereco || '',
      colonia: formData.colonia || '',
      telefone: formData.telefone || '',
      email: formData.email,
    };

    onSubmit(pescador, documents);
  };

  const handleProcessFound = (processData: any) => {
    // Extrai dados do processo para criar o caso
    const pescador: Pescador = {
      id: `p${Date.now()}`,
      nome: processData.partes.autor || '',
      cpf: processData.partes.cpf || '',
      rg: '',
      dataNascimento: new Date(),
      endereco: '',
      colonia: '',
      telefone: '',
    };

    onSubmit(pescador, [], processData);
  };

  const handleInputChange = (field: keyof Pescador, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.nome && formData.cpf && formData.colonia && documents.length > 0;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
      <TabsList className="grid w-full grid-cols-2 max-w-[600px] mx-auto">
        <TabsTrigger value="documents" className="flex items-center gap-2">
          <FileUp className="h-4 w-4" />
          <span className="hidden sm:inline">Upload de Documentos</span>
          <span className="sm:hidden">Documentos</span>
        </TabsTrigger>
        <TabsTrigger value="process" className="flex items-center gap-2">
          <Scale className="h-4 w-4" />
          <span className="hidden sm:inline">Número do Processo</span>
          <span className="sm:hidden">Processo</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="documents" className="space-y-4 md:space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader className="px-4 md:px-6">
              <CardTitle className="text-base md:text-lg">Dados do Pescador</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Nome completo do pescador"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                placeholder="000.000.000-00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                value={formData.rg}
                onChange={(e) => handleInputChange('rg', e.target.value)}
                placeholder="00.000.000-0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="colonia">Colônia de Pescadores *</Label>
              <Input
                id="colonia"
                value={formData.colonia}
                onChange={(e) => handleInputChange('colonia', e.target.value)}
                placeholder="Ex: Z-10 Santos"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço Completo</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) => handleInputChange('endereco', e.target.value)}
              placeholder="Rua, número, bairro, cidade"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-4 md:px-6 pt-6">
          <DocumentUpload onDocumentsChange={setDocuments} />
        </CardContent>
      </Card>

          <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3 sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-4 pb-2">
            <Button type="button" variant="outline" className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isAnalyzing}
              className="w-full sm:w-auto"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <span className="hidden md:inline">Criar Caso e Iniciar Análise</span>
                  <span className="md:hidden">Criar e Analisar</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </TabsContent>

      <TabsContent value="process">
        <ProcessSearch onProcessFound={handleProcessFound} isAnalyzing={isAnalyzing} />
      </TabsContent>
    </Tabs>
  );
}
