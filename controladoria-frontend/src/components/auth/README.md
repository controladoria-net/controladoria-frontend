# Fluxo de Autenticação - Sistema ControladorIA

## Componentes de Autenticação

Este diretório contém todos os componentes relacionados à autenticação do sistema.

### 1. Login (`login.tsx`)

Tela principal de autenticação onde o usuário insere suas credenciais.

**Funcionalidades:**
- Login com e-mail e senha
- Toggle de visualização de senha
- Link para recuperação de senha
- Validação de campos obrigatórios
- Feedback visual durante o carregamento

**Props:**
- `onLoginSuccess`: Callback executado após login bem-sucedido
- `onForgotPassword`: Callback para navegar para recuperação de senha

### 2. Recuperação de Senha (`forgot-password.tsx`)

Tela onde o usuário solicita um link de recuperação de senha.

**Funcionalidades:**
- Campo de e-mail com validação
- Envio simulado de e-mail de recuperação
- Tela de confirmação após envio
- Opção de reenvio de e-mail
- Botão para voltar ao login

**Fluxo:**
1. Usuário insere e-mail cadastrado
2. Sistema valida formato do e-mail
3. Sistema simula envio de e-mail (2 segundos)
4. Exibe tela de confirmação com o e-mail enviado
5. Usuário pode reenviar ou voltar ao login

**Props:**
- `onBackToLogin`: Callback para retornar à tela de login

### 3. Redefinição de Senha (`reset-password.tsx`)

Tela onde o usuário cria uma nova senha segura.

**Funcionalidades:**
- Campos de nova senha e confirmação
- Validação de força da senha em tempo real
- Indicador visual de força da senha
- Requisitos mínimos de segurança:
  - Mínimo de 8 caracteres
  - Uma letra maiúscula
  - Uma letra minúscula
  - Um número
  - Um caractere especial
- Verificação de correspondência entre senhas
- Toggle de visualização de senha
- Tela de sucesso após redefinição
- Redirecionamento automático para login (3 segundos)

**Props:**
- `onResetSuccess`: Callback executado após redefinição bem-sucedida

## Fluxo Completo de Recuperação de Senha

```
┌─────────────┐
│    Login    │
└──────┬──────┘
       │ Clica "Esqueceu a senha?"
       ▼
┌──────────────────┐
│ Forgot Password  │ ◄─┐
└──────┬───────────┘   │
       │ Insere e-mail │ Opção "Voltar"
       ▼               │
┌──────────────────┐   │
│ Confirmação de   │   │
│  Envio de Email  │ ──┘
└──────┬───────────┘
       │ Acessa link do e-mail
       │ (simulado)
       ▼
┌──────────────────┐
│ Reset Password   │
└──────┬───────────┘
       │ Define nova senha
       ▼
┌──────────────────┐
│ Confirmação de   │
│    Sucesso       │
└──────┬───────────┘
       │ Auto-redirect (3s)
       ▼
┌──────────────────┐
│    Login         │
│ (usa nova senha) │
└──────────────────┘
```

## Integração com App.tsx

O `App.tsx` gerencia a navegação entre as telas de autenticação usando o estado `authView`:

```typescript
type AuthView = 'login' | 'forgot-password' | 'reset-password';
const [authView, setAuthView] = useState<AuthView>('login');
```

## Observações Importantes

### Simulação (Mock)
- O sistema atualmente **simula** todo o processo de recuperação de senha
- Não há envio real de e-mails
- Não há validação de token ou link de recuperação
- Aceita qualquer e-mail no formato válido

### Implementação Futura (Backend Real)
Quando integrar com backend real, será necessário:

1. **Forgot Password:**
   - Verificar se o e-mail existe no banco de dados
   - Gerar token único de recuperação (ex: JWT)
   - Enviar e-mail com link contendo o token
   - Definir tempo de expiração do token (ex: 24 horas)

2. **Reset Password:**
   - Validar token recebido na URL
   - Verificar se token não expirou
   - Hash da nova senha antes de salvar
   - Invalidar token após uso
   - Enviar e-mail de confirmação de alteração

3. **Segurança:**
   - Rate limiting para evitar spam de e-mails
   - CAPTCHA para prevenir ataques automatizados
   - Logs de tentativas de recuperação
   - Notificação ao usuário sobre tentativa de recuperação

## Personalização

### Cores
O sistema usa a paleta de cores definida:
- Primary: `#0f172a` (Slate Dark)
- Accent: Cyan (`cyan-600`, `cyan-400`)

### Validação de Senha
Os requisitos de senha podem ser ajustados em `reset-password.tsx` na função `validatePassword()`.

### Tempo de Redirecionamento
O tempo de redirecionamento automático após sucesso pode ser ajustado:
- Forgot Password: linha com o setTimeout após confirmação
- Reset Password: linha 25 (atualmente 3000ms = 3 segundos)
