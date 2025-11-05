import { useNavigate } from '@tanstack/react-router';
import { ResetPassword } from '../../components/auth/reset-password';

export function ResetPasswordPage() {
  const navigate = useNavigate();

  return (
    <ResetPassword onResetSuccess={() => navigate({ to: '/login' })} />
  );
}
