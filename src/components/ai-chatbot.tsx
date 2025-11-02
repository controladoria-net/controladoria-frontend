import { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Bot, Send, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou o assistente de IA especializado em Seguro-Defeso. Como posso ajudá-lo hoje? Posso responder sobre legislação, critérios de elegibilidade, documentação necessária e muito mais.',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Foca no input quando abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Mock de respostas da IA
  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Respostas baseadas em palavras-chave
    if (lowerMessage.includes('documento') || lowerMessage.includes('documentação')) {
      return 'Para solicitar o Seguro-Defeso, são necessários os seguintes documentos:\n\n• RG (Registro Geral) - Obrigatório\n• CPF - Obrigatório\n• RGP (Registro Geral da Pesca) - Obrigatório e deve estar ativo\n• Comprovante de Residência - Obrigatório\n• Declaração da Colônia - Obrigatória\n• Comprovante de Venda de Pescado - Opcional, mas reforça o caso\n• Carteira de Trabalho - Opcional\n\nTodos os documentos devem estar legíveis e dentro do prazo de validade.';
    }

    if (lowerMessage.includes('rgp') || lowerMessage.includes('pesca')) {
      return 'O RGP (Registro Geral da Pesca) é o documento mais importante para o Seguro-Defeso. Pontos essenciais:\n\n• Deve estar ativo e válido\n• Emitido há pelo menos 1 ano antes do início do período de defeso\n• Categoria deve ser "Pescador Profissional Artesanal"\n• Não pode ter registro em carteira de trabalho no mesmo período\n\nSem RGP válido, o pescador não tem direito ao benefício.';
    }

    if (lowerMessage.includes('prazo') || lowerMessage.includes('quando')) {
      return 'O Seguro-Defeso é pago durante o período de proibição da pesca (defeso), que varia conforme:\n\n• Espécie de pescado\n• Região geográfica\n• Bacia hidrográfica\n\nO pescador deve fazer a solicitação até 120 dias após o início do período de defeso. O pagamento é mensal, no valor de 1 salário mínimo, durante todo o período de defeso estabelecido pelo IBAMA.';
    }

    if (lowerMessage.includes('critério') || lowerMessage.includes('elegib')) {
      return 'Critérios de elegibilidade para o Seguro-Defeso:\n\n✓ Ser pescador profissional artesanal\n✓ Ter RGP ativo há pelo menos 1 ano\n✓ Não ter vínculo empregatício no período\n✓ Não receber benefício previdenciário\n✓ Ter feito no mínimo 3 contribuições ao INSS nos últimos 12 meses\n✓ Ter vendas de pescado comprovadas\n✓ Não ter outra fonte de renda formal\n\nNossa IA verifica automaticamente todos esses critérios!';
    }

    if (lowerMessage.includes('score') || lowerMessage.includes('análise')) {
      return 'Nosso sistema de análise atribui um score de 0 a 100 baseado em:\n\n• Presença de documentos obrigatórios (40 pontos)\n• Validade e qualidade dos documentos (30 pontos)\n• Atendimento aos critérios de elegibilidade (20 pontos)\n• Consistência entre documentos (10 pontos)\n\nScore acima de 70: Alta probabilidade de aprovação\nScore 50-70: Aprovação possível com ressalvas\nScore abaixo de 50: Documentação incompleta ou problemas graves\n\nA análise final sempre cabe ao advogado!';
    }

    if (lowerMessage.includes('colônia') || lowerMessage.includes('declaração')) {
      return 'A Declaração da Colônia de Pescadores é obrigatória e deve conter:\n\n• Confirmação de que o pescador é membro ativo\n• Período de exercício da atividade pesqueira\n• Assinatura do presidente da colônia\n• Carimbo oficial da entidade\n• Data de emissão recente (últimos 30 dias)\n\nEsta declaração comprova o vínculo do pescador com a atividade pesqueira artesanal.';
    }

    if (lowerMessage.includes('inss') || lowerMessage.includes('contribuiç')) {
      return 'Sobre as contribuições ao INSS:\n\n• Mínimo de 3 contribuições nos últimos 12 meses antes do defeso\n• Contribuições devem ser como Segurado Especial ou Contribuinte Individual\n• Importante: pescador artesanal pode contribuir facultativamente\n• Verificamos automaticamente a regularidade no sistema\n\nSem as contribuições mínimas, o pescador não tem direito ao benefício.';
    }

    if (lowerMessage.includes('negado') || lowerMessage.includes('recurso') || lowerMessage.includes('rejeita')) {
      return 'Se o benefício for negado, é possível:\n\n1. Analisar o motivo da negação\n2. Reunir documentação adicional se necessário\n3. Apresentar recurso administrativo ao INSS em até 30 dias\n4. Se mantida a negação, entrar com ação judicial\n\nNosso sistema ajuda a identificar os pontos fracos antes mesmo de enviar ao INSS, aumentando as chances de aprovação!';
    }

    if (lowerMessage.includes('obrigado') || lowerMessage.includes('valeu')) {
      return 'Por nada! Estou aqui para ajudar sempre que precisar. Boa sorte com seus casos! 🎣';
    }

    // Resposta padrão
    return 'Entendo sua questão. Posso ajudar com informações sobre:\n\n• Documentos necessários\n• Critérios de elegibilidade\n• RGP e requisitos\n• Prazos e períodos de defeso\n• Sistema de score e análise\n• Contribuições ao INSS\n• Recursos e negativas\n\nPoderia reformular sua pergunta ou escolher um desses tópicos?';
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Adiciona mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simula delay da IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(userMessage.content),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 segundos
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Abrir chat com IA"
      >
        <div className="relative">
          {/* Badge de notificação (pulso) */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full animate-pulse" />
          
          {/* Botão principal */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-950 p-4 rounded-full shadow-lg hover:shadow-xl transition-all group-hover:scale-110">
            <Bot className="h-6 w-6 text-cyan-400" />
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Assistente IA
            <div className="absolute top-full right-4 w-2 h-2 bg-slate-900 transform rotate-45 -mt-1" />
          </div>
        </div>
      </button>

      {/* Sheet do Chat - Lateral Direita */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:w-[500px] md:w-[600px] p-0 flex flex-col">
          <SheetHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <SheetTitle>Assistente de IA</SheetTitle>
                <SheetDescription>
                  Online - Especializado em Seguro-Defeso
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Área de mensagens */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                        <Badge variant="secondary" className="text-xs">
                          IA
                        </Badge>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Indicador de digitação */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Elemento invisível para scroll automático */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Disclaimer */}
          <div className="px-6 py-2 bg-yellow-50 dark:bg-yellow-950/20 border-t border-yellow-200 dark:border-yellow-800 flex-shrink-0">
            <p className="text-xs text-yellow-800 dark:text-yellow-300">
              ⚠️ Este assistente é uma ferramenta de apoio. A análise final sempre cabe ao profissional jurídico.
            </p>
          </div>

          {/* Input de mensagem */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua pergunta..."
                disabled={isTyping}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
