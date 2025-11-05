import { useNavigate } from '@tanstack/react-router';
import { ForgotPassword } from '../../components/auth/forgot-password';

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  return (
    <ForgotPassword onBackToLogin={() => navigate({ to: '/login' })} />
  );
}
