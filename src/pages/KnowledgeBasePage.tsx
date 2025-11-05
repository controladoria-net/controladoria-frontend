import { KnowledgeBase } from '../components/knowledge-base';
import { useAppState } from '../contexts/AppStateContext';

export function KnowledgeBasePage() {
  const { mockKnowledgeBase, mockDefesoPeriods } = useAppState();

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="truncate">Base de Conhecimento</h2>
        <p className="text-sm text-muted-foreground">
          Informações sobre o Seguro-Defeso, legislação e procedimentos
        </p>
      </div>

      <KnowledgeBase articles={mockKnowledgeBase} defesoPeriods={mockDefesoPeriods} />
    </div>
  );
}
