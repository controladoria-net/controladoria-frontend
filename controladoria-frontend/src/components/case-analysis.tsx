import { Case } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { CheckCircle2, XCircle, AlertTriangle, Clock, FileText } from 'lucide-react';
import { getDocumentTypeLabel, formatDate, getScoreColor, getScoreBgColor } from '../lib/utils';
import { Button } from './ui/button';

interface CaseAnalysisProps {
  case: Case;
  onGenerateReport: () => void;
  onRequestDocuments: () => void;
}

export function CaseAnalysis({ case: caseData, onGenerateReport, onRequestDocuments }: CaseAnalysisProps) {
  const { analysis, documents, pescador } = caseData;

  if (!analysis) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Análise ainda não realizada</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Score Card */}
      <Card className={`${getScoreBgColor(analysis.score)} border-2`}>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xs md:text-sm text-muted-foreground mb-1">Score de Aprovação</h3>
              <div className={`text-3xl md:text-4xl ${getScoreColor(analysis.score)}`}>
                {analysis.score}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Confiança da IA: {analysis.aiConfidence}%
              </p>
            </div>
            <div className="text-left sm:text-right w-full sm:w-auto">
              <p className="text-xs md:text-sm text-muted-foreground">Analisado em</p>
              <p className="text-xs md:text-sm">{formatDate(analysis.analyzedAt)}</p>
            </div>
          </div>
          <Progress value={analysis.score} className="mt-4" />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
        <Button onClick={onGenerateReport} className="w-full sm:w-auto">
          <FileText className="h-4 w-4 mr-2" />
          Gerar Relatório
        </Button>
        {analysis.missingDocuments.length > 0 && (
          <Button onClick={onRequestDocuments} variant="outline" className="w-full sm:w-auto">
            Solicitar Documentos
          </Button>
        )}
      </div>

      {/* Detailed Analysis */}
      <Accordion type="single" collapsible defaultValue="eligibility" className="space-y-2">
        {/* Eligibility Checks */}
        <AccordionItem value="eligibility">
          <AccordionTrigger className="px-2 md:px-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span className="text-sm md:text-base">Critérios de Elegibilidade</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 md:space-y-3 pt-2">
              {analysis.eligibilityChecks.map((check, index) => (
                <Card key={index}>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-start gap-2 md:gap-3">
                      {getStatusIcon(check.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm break-words">{check.criterion}</p>
                        <p className="text-xs text-muted-foreground mt-1 break-words">{check.details}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Documents */}
        <AccordionItem value="documents">
          <AccordionTrigger className="px-2 md:px-0">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span className="text-sm md:text-base">Documentos ({documents.length})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between gap-2 p-3 border rounded-lg">
                  <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm truncate">{getDocumentTypeLabel(doc.type)}</p>
                      <p className="text-xs text-muted-foreground truncate">{doc.name}</p>
                    </div>
                  </div>
                  <Badge
                    variant={doc.status === 'presente' ? 'default' : 'destructive'}
                    className={`flex-shrink-0 ${
                      doc.status === 'presente'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : ''
                    }`}
                  >
                    {doc.status === 'presente' ? 'Presente' : doc.status === 'invalido' ? 'Inválido' : 'Ausente'}
                  </Badge>
                </div>
              ))}
              {analysis.missingDocuments.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm mb-2">Documentos Faltantes:</p>
                  <div className="space-y-2">
                    {analysis.missingDocuments.map((docType, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950 rounded">
                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800 dark:text-red-300 break-words">
                          {getDocumentTypeLabel(docType)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Inconsistencies */}
        {analysis.inconsistencies.length > 0 && (
          <AccordionItem value="inconsistencies">
            <AccordionTrigger className="px-2 md:px-0">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                <span className="text-sm md:text-base">Inconsistências ({analysis.inconsistencies.length})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {analysis.inconsistencies.map((issue, index) => (
                  <Card key={index} className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-yellow-800 dark:text-yellow-300 break-words">{issue}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Recommendations */}
        <AccordionItem value="recommendations">
          <AccordionTrigger className="px-2 md:px-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span className="text-sm md:text-base">Recomendações ({analysis.recommendations.length})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {analysis.recommendations.map((rec, index) => (
                <Card key={index} className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-800 dark:text-blue-300 break-words">{rec}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Lawyer Notes */}
      <Card>
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-base md:text-lg">Observações do Advogado</CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <textarea
            className="w-full min-h-[100px] p-3 border rounded-lg bg-background resize-none text-sm"
            placeholder="Adicione suas observações sobre este caso..."
            defaultValue={caseData.lawyerNotes || ''}
          />
        </CardContent>
      </Card>
    </div>
  );
}
