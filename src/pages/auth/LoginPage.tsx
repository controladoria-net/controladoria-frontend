import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Login } from '../../components/auth/login';
import { useAppState } from '../../contexts/AppStateContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { handleLoginSuccess, user } = useAppState();

  useEffect(() => {
    if (user) {
      navigate({ to: '/' });
    }
  }, [user, navigate]);

  return (
    <Login
      onLoginSuccess={(user) => {
        handleLoginSuccess(user);
        navigate({ to: '/' });
      }}
      onForgotPassword={() => navigate({ to: '/forgot-password' })}
    />
  );
}
