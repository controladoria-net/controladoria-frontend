import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { LayoutDashboard, Plus, BookOpen, FolderOpen } from 'lucide-react';
import { Case } from '../lib/types';

interface MobileNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  cases: Case[];
}

export function MobileNav({
  currentView,
  onNavigate,
}: MobileNavProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Button
            variant={currentView === 'dashboard' ? 'default' : 'outline'}
            size="sm"
            className="flex-shrink-0"
            onClick={() => onNavigate('dashboard')}
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={currentView === 'all-cases' ? 'default' : 'outline'}
            size="sm"
            className="flex-shrink-0"
            onClick={() => onNavigate('all-cases')}
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Casos
          </Button>
          <Button
            variant={currentView === 'new-case' ? 'default' : 'outline'}
            size="sm"
            className="flex-shrink-0"
            onClick={() => onNavigate('new-case')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo
          </Button>
          <Button
            variant={currentView === 'knowledge-base' ? 'default' : 'outline'}
            size="sm"
            className="flex-shrink-0"
            onClick={() => onNavigate('knowledge-base')}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Base
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
