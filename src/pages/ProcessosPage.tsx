import { useNavigate } from '@tanstack/react-router';
import { AllProcessos } from '../components/all-processos';
import { useAppState } from '../contexts/AppStateContext';

export function ProcessosPage() {
  const navigate = useNavigate();
  const { processos, handleAddProcessByNumber } = useAppState();

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="min-w-0">
        <h2 className="truncate">Processos Judiciais</h2>
        <p className="text-sm text-muted-foreground">
          Acompanhamento de processos em andamento
        </p>
      </div>

      <AllProcessos
        processos={processos}
        onViewProcesso={(id) =>
          navigate({ to: '/processos/$processoId', params: { processoId: id } })
        }
        onAddProcessByNumber={handleAddProcessByNumber}
      />
    </div>
  );
}
