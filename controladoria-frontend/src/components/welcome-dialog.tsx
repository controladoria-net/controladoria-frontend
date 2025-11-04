import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { FileCheck, Upload, BarChart3, BookOpen, CheckCircle2 } from 'lucide-react';

interface WelcomeDialogProps {
  open: boolean;
  onClose: () => void;
}

export function WelcomeDialog({ open, onClose }: WelcomeDialogProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <FileCheck className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />,
      title: 'Bem-vindo ao ControladorIA',
      description:
        'Sistema completo de análise de documentos para pescadores artesanais. Automatize a verificação de elegibilidade ao Seguro-Defeso com auxílio de Inteligência Artificial.',
    },
    {
      icon: <Upload className="h-12 w-12 text-cyan-600 dark:text-cyan-400 mx-auto mb-4" />,
      title: 'Upload de Documentos',
      description:
        'Faça upload de múltiplos documentos (RG, CPF, RGP, comprovantes) em formato PDF, JPG ou PNG. O sistema organiza automaticamente por tipo de documento.',
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />,
      title: 'Análise Inteligente',
      description:
        'A IA analisa os documentos, verifica critérios de elegibilidade, identifica inconsistências e gera um score de probabilidade de aprovação de 0 a 100%.',
    },
    {
      icon: <BookOpen className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />,
      title: 'Base de Conhecimento',
      description:
        'Acesse informações sobre legislação, períodos de defeso por região, modelos de documentos e FAQ sobre o Seguro-Defeso.',
    },
    {
      icon: <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />,
      title: 'Comece Agora!',
      description:
        'Crie seu primeiro caso clicando em "Novo Caso" no menu lateral. Lembre-se: a IA é uma ferramenta de auxílio, a análise jurídica final é sempre sua responsabilidade.',
    },
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {currentStep.icon}
            {currentStep.title}
          </DialogTitle>
          <DialogDescription className="text-center pt-4">
            {currentStep.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-2 my-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                index === step
                  ? 'bg-primary w-8'
                  : index < step
                  ? 'bg-primary/60'
                  : 'bg-gray-300 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 0}
          >
            Anterior
          </Button>
          <Button onClick={handleNext}>
            {step === steps.length - 1 ? 'Começar' : 'Próximo'}
          </Button>
        </div>

        <div className="text-center mt-2">
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Pular tutorial
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
