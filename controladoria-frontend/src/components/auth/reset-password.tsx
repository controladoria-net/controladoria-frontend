import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Eye, EyeOff, Lock, Loader2, CheckCircle2, Scale } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import logoImage from 'figma:asset/80fc1f1e9ee50b88e65b40f85f7f2f310a0875da.png';

interface ResetPasswordProps {
  onResetSuccess: () => void;
}

export function ResetPassword({ onResetSuccess }: ResetPasswordProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetComplete, setIsResetComplete] = useState(false);

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];
    
    if (pwd.length < 8) {
      errors.push('Mínimo de 8 caracteres');
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push('Uma letra maiúscula');
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push('Uma letra minúscula');
    }
    if (!/[0-9]/.test(pwd)) {
      errors.push('Um número');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      errors.push('Um caractere especial');
    }
    
    return errors;
  };

  const passwordErrors = password ? validatePassword(password) : [];
  const passwordStrength = password ? 
    (5 - passwordErrors.length) * 20 : 0;

  const getStrengthColor = () => {
    if (passwordStrength >= 80) return 'bg-green-500';
    if (passwordStrength >= 60) return 'bg-yellow-500';
    if (passwordStrength >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStrengthText = () => {
    if (passwordStrength >= 80) return 'Forte';
    if (passwordStrength >= 60) return 'Média';
    if (passwordStrength >= 40) return 'Fraca';
    return 'Muito Fraca';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (passwordErrors.length > 0) {
      toast.error('A senha não atende aos requisitos mínimos');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setIsLoading(true);

    // Simula redefinição de senha
    setTimeout(() => {
      setIsResetComplete(true);
      setIsLoading(false);
      toast.success('Senha redefinida com sucesso!');
      
      // Redireciona para o login após 3 segundos
      setTimeout(() => {
        onResetSuccess();
      }, 3000);
    }, 2000);
  };

  if (isResetComplete) {
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
              <CardTitle className="text-2xl">Senha Redefinida!</CardTitle>
              <CardDescription className="mt-2">
                Sua senha foi alterada com sucesso
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Você será redirecionado para a página de login em instantes.
              </p>
              <p className="text-sm font-medium">
                Use sua nova senha para acessar o sistema.
              </p>
            </div>

            <Button
              onClick={onResetSuccess}
              className="w-full"
            >
              Ir para o Login
            </Button>

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
            <CardTitle className="text-2xl">Redefinir Senha</CardTitle>
            <CardDescription className="mt-2">
              Crie uma nova senha segura para sua conta
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="new-password"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              {password && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium min-w-[80px]">
                      {getStrengthText()}
                    </span>
                  </div>
                  
                  {passwordErrors.length > 0 && (
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p className="font-medium">A senha deve conter:</p>
                      <ul className="space-y-0.5 pl-4">
                        {passwordErrors.map((error, index) => (
                          <li key={index} className="text-red-600 dark:text-red-400">
                            • {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="new-password"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  As senhas não coincidem
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || passwordErrors.length > 0 || password !== confirmPassword}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redefinindo...
                </>
              ) : (
                'Redefinir Senha'
              )}
            </Button>
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
