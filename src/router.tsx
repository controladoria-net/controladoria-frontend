import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from '@tanstack/react-router';
import { AuthenticatedLayout } from './layouts/AuthenticatedLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardPage } from './pages/DashboardPage';
import { SolicitacoesPage } from './pages/SolicitacoesPage';
import { SolicitacaoDetailPage } from './pages/SolicitacaoDetailPage';
import { NewSolicitacaoPage } from './pages/NewSolicitacaoPage';
import { ProcessosPage } from './pages/ProcessosPage';
import { ProcessoDetailPage } from './pages/ProcessoDetailPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { LoginPage } from './pages/auth/LoginPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { App } from './App';

const rootRoute = createRootRoute({
  component: App,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth',
  component: AuthLayout,
});

const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: 'login',
  component: LoginPage,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => authRoute,
  path: 'forgot-password',
  component: ForgotPasswordPage,
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => authRoute,
  path: 'reset-password',
  component: ResetPasswordPage,
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: AuthenticatedLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/',
  component: DashboardPage,
});

const solicitacoesRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'solicitacoes',
  component: SolicitacoesPage,
});

const solicitacaoDetailRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'solicitacoes/$solicitacaoId',
  component: SolicitacaoDetailPage,
});

const newSolicitacaoRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'solicitacoes/nova',
  component: NewSolicitacaoPage,
});

const processosRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'processos',
  component: ProcessosPage,
});

const processoDetailRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'processos/$processoId',
  component: ProcessoDetailPage,
});

const knowledgeBaseRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'base-conhecimento',
  component: KnowledgeBasePage,
});

const routeTree = rootRoute.addChildren([
  authRoute.addChildren([loginRoute, forgotPasswordRoute, resetPasswordRoute]),
  protectedRoute.addChildren([
    dashboardRoute,
    solicitacoesRoute,
    solicitacaoDetailRoute,
    newSolicitacaoRoute,
    processosRoute,
    processoDetailRoute,
    knowledgeBaseRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
