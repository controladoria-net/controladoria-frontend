import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Eye, EyeOff, Scale, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import logoImage from 'figma:asset/80fc1f1e9ee50b88e65b40f85f7f2f310a0875da.png';
import { api, extractApiErrorMessage } from '../../services/api';

interface LoginProps {
  onLoginSuccess: (user: { email: string; name: string }) => void;
  onForgotPassword: () => void;
}

export function Login({ onLoginSuccess, onForgotPassword }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);

    try {
      // O backend usa cookies HttpOnly, então apenas precisamos postar as credenciais
      // Assumindo campo username para compatibilidade; ajuste para { email, password } se necessário
      await api.post('/session/login', { username: email, password });

      // Buscar o usuário autenticado para popular o header
      const userResp = await api.get('/session/user');
      const u = (userResp?.data as any)?.data;
      const nameParts = [u?.first_name, u?.last_name].filter(Boolean);
      const friendlyName = nameParts.length > 0 ? nameParts.join(' ') : (u?.username || email);

      const userForApp = { email: u?.email || email, name: friendlyName };
      toast.success(`Bem-vindo, ${userForApp.name}!`);
      onLoginSuccess(userForApp);
    } catch (err) {
      // Toast vermelho em caso de erro no login
      toast.error(extractApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

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
            <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                {/* <button
                  type="button"
                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline"
                  onClick={onForgotPassword}
                  disabled={isLoading}
                >
                  Esqueceu a senha?
                </button> */}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="pr-10"
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
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
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
