import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ChevronLeft, Mail, Loader2, CheckCircle2, Scale } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import logoImage from 'figma:asset/80fc1f1e9ee50b88e65b40f85f7f2f310a0875da.png';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Por favor, informe seu e-mail');
      return;
    }

    // Validação básica de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor, informe um e-mail válido');
      return;
    }

    setIsLoading(true);

    // Simula envio de e-mail de recuperação
    setTimeout(() => {
      setIsEmailSent(true);
      setIsLoading(false);
      toast.success('E-mail de recuperação enviado com sucesso!');
    }, 2000);
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-cyan-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">E-mail Enviado!</CardTitle>
              <CardDescription className="mt-2">
                Verifique sua caixa de entrada
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Enviamos um link de recuperação de senha para:
              </p>
              <p className="font-medium text-cyan-600 dark:text-cyan-400">
                {email}
              </p>
              <p className="text-sm text-muted-foreground">
                O link é válido por 24 horas. Caso não encontre o e-mail, 
                verifique sua caixa de spam.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={onBackToLogin}
                className="w-full"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Voltar para o Login
              </Button>

              <Button
                variant="outline"
                onClick={() => setIsEmailSent(false)}
                className="w-full"
              >
                <Mail className="mr-2 h-4 w-4" />
                Reenviar E-mail
              </Button>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Scale className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>
                  Este sistema é uma ferramenta de apoio para análise jurídica.
                  Sempre consulte um profissional qualificado.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-cyan-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <img 
              src={logoImage} 
              alt="Logo" 
              className="h-36 w-auto object-contain dark:brightness-0 dark:invert transition-all"
            />
          </div>
          <div>
            <CardTitle className="text-2xl">Recuperar Senha</CardTitle>
            <CardDescription className="mt-2">
              Digite seu e-mail para receber o link de recuperação
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enviaremos um link para redefinir sua senha
              </p>
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar Link de Recuperação
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={onBackToLogin}
                className="w-full"
                disabled={isLoading}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Voltar para o Login
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Scale className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <p>
                Este sistema é uma ferramenta de apoio para análise jurídica.
                Sempre consulte um profissional qualificado.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
