import { Outlet } from '@tanstack/react-router';
import { Toaster } from '../components/ui/sonner';

export function AuthLayout() {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
}
